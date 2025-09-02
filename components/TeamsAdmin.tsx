// components/TeamsAdmin.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabaseClient'

type AdminRow = {
  team_id: string
  team_name: string
  created_by: string
  member_id: string | null
  member_email: string | null
  member_role: 'owner' | 'member' | null
}
type Member = { id: string; email: string; role: 'owner' | 'member' }
type Team = { id: string; name: string; created_by: string; members: Member[] }

type Toast = { id: number; type: 'success' | 'error' | 'info'; text: string }

export default function TeamsAdmin() {
  const supabase = supabaseBrowser()

  const [rows, setRows] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(true)

  // per-action loading flags
  const [creating, setCreating] = useState(false)
  const [addingMap, setAddingMap] = useState<Record<string, boolean>>({})
  const [roleMap, setRoleMap] = useState<Record<string, boolean>>({})
  const [removeMap, setRemoveMap] = useState<Record<string, boolean>>({})

  // inline errors
  const [errCreate, setErrCreate] = useState<string | null>(null)
  const [errAdd, setErrAdd] = useState<Record<string, string | null>>({})

  // inputs
  const [newTeamName, setNewTeamName] = useState('')
  const [addEmail, setAddEmail] = useState<Record<string, string>>({})
  const [addRole, setAddRole] = useState<Record<string, 'owner' | 'member'>>({})

  // toasts
  const [toasts, setToasts] = useState<Toast[]>([])
  const pushToast = (type: Toast['type'], text: string) => {
    const id = Math.floor(Date.now() + Math.random() * 1000)
    setToasts((t) => [...t, { id, type, text }])
    // auto-hide after 4s
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 4000)
  }

  const closeToast = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  const teams: Team[] = useMemo(() => {
    const map = new Map<string, Team>()
    for (const r of rows) {
      if (!map.has(r.team_id)) {
        map.set(r.team_id, {
          id: r.team_id,
          name: r.team_name,
          created_by: r.created_by,
          members: [],
        })
      }
      if (r.member_id) {
        map.get(r.team_id)!.members.push({
          id: r.member_id,
          email: r.member_email || '(unknown)',
          role: (r.member_role as 'owner' | 'member') || 'member',
        })
      }
    }
    return Array.from(map.values())
  }, [rows])

  const load = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('admin_list_teams')
      if (error) throw new Error(error.message)
      setRows((data ?? []) as AdminRow[])
    } catch (e: any) {
      pushToast('error', e.message || 'Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const createTeam = async () => {
    setErrCreate(null)
    const name = newTeamName.trim()
    if (!name) {
      setErrCreate('Team name is required')
      return
    }
    setCreating(true)
    try {
      const { data, error } = await supabase.rpc('admin_create_team', { p_name: name })
      if (error) throw new Error(error.message)
      const row = Array.isArray(data) ? data?.[0] : data
      pushToast('success', `Created team “${row?.name ?? name}”.`)
      setNewTeamName('')
      await load()
    } catch (e: any) {
      setErrCreate(e.message || 'Failed to create team')
    } finally {
      setCreating(false)
    }
  }

  const addMember = async (teamId: string) => {
    setErrAdd((prev) => ({ ...prev, [teamId]: null }))
    const email = (addEmail[teamId] || '').trim()
    const role = addRole[teamId] || 'member'
    if (!email) {
      setErrAdd((prev) => ({ ...prev, [teamId]: 'Email is required' }))
      return
    }
    setAddingMap((m) => ({ ...m, [teamId]: true }))
    try {
      const { error } = await supabase.rpc('admin_add_member_by_email', {
        p_team_id: teamId,
        p_email: email,
        p_role: role,
      })
      if (error) throw new Error(error.message)
      pushToast('success', `Added ${email} as ${role === 'owner' ? 'Captain' : 'Member'}.`)
      setAddEmail((prev) => ({ ...prev, [teamId]: '' }))
      await load()
    } catch (e: any) {
      setErrAdd((prev) => ({ ...prev, [teamId]: e.message || 'Failed to add member' }))
    } finally {
      setAddingMap((m) => ({ ...m, [teamId]: false }))
    }
  }

  const setCaptain = async (teamId: string, email: string) => {
    setRoleMap((m) => ({ ...m, [teamId]: true }))
    try {
      const { error } = await supabase.rpc('admin_add_member_by_email', {
        p_team_id: teamId,
        p_email: email,
        p_role: 'owner',
      })
      if (error) throw new Error(error.message)
      pushToast('success', `Promoted ${email} to Captain.`)
      await load()
    } catch (e: any) {
      pushToast('error', e.message || 'Failed to set captain')
    } finally {
      setRoleMap((m) => ({ ...m, [teamId]: false }))
    }
  }

  const makeMember = async (teamId: string, email: string) => {
    setRoleMap((m) => ({ ...m, [teamId]: true }))
    try {
      const { error } = await supabase.rpc('admin_add_member_by_email', {
        p_team_id: teamId,
        p_email: email,
        p_role: 'member',
      })
      if (error) throw new Error(error.message)
      pushToast('success', `Set ${email} as Member.`)
      await load()
    } catch (e: any) {
      pushToast('error', e.message || 'Failed to change role')
    } finally {
      setRoleMap((m) => ({ ...m, [teamId]: false }))
    }
  }

  const removeMember = async (teamId: string, userId: string, email: string) => {
    const ok = confirm(`Remove ${email} from this team?`)
    if (!ok) return
    setRemoveMap((m) => ({ ...m, [teamId]: true }))
    try {
      const { error } = await supabase.rpc('admin_remove_member', {
        p_team_id: teamId,
        p_user_id: userId,
      })
      if (error) throw new Error(error.message)
      pushToast('success', `Removed ${email}.`)
      await load()
    } catch (e: any) {
      pushToast('error', e.message || 'Failed to remove member')
    } finally {
      setRemoveMap((m) => ({ ...m, [teamId]: false }))
    }
  }

  if (loading) return <p>Loading…</p>

  return (
    <>
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              'rounded-xl px-4 py-3 shadow-md border',
              t.type === 'success' && 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/30 dark:text-green-100 dark:border-green-700',
              t.type === 'error' && 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/30 dark:text-red-100 dark:border-red-700',
              t.type === 'info' && 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-700',
            ].filter(Boolean).join(' ')}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">{t.text}</div>
              <button className="opacity-70 hover:opacity-100" onClick={() => closeToast(t.id)} aria-label="Close">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="grid gap-6">
        {/* Create team */}
        <div className="border rounded-xl p-4 grid gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Create Team</h2>
            <button
              onClick={load}
              className="ml-auto text-sm border rounded-xl px-3 py-1"
              title="Reload list"
            >
              Reload
            </button>
          </div>

          <div className="flex gap-2 max-sm:flex-col">
            <input
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
              className="border rounded-xl px-3 py-2 flex-1"
              disabled={creating}
            />
            <button
              onClick={createTeam}
              className="border rounded-xl px-3 py-2"
              disabled={creating}
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
          </div>

          {errCreate && <p className="text-sm text-red-600 dark:text-red-400">{errCreate}</p>}

          <p className="text-sm opacity-70">
            You’ll be added as the Captain automatically.
          </p>
        </div>

        {/* Teams list */}
        <div className="grid gap-4">
          {teams.length === 0 ? (
            <p>No teams yet.</p>
          ) : (
            teams.map((team) => {
              const adding = !!addingMap[team.id]
              const changingRole = !!roleMap[team.id]
              const removing = !!removeMap[team.id]

              return (
                <div key={team.id} className="border rounded-xl p-4 grid gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <span className="text-sm opacity-70">ID: {team.id}</span>
                  </div>

                  {/* Add member */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      value={addEmail[team.id] || ''}
                      onChange={(e) =>
                        setAddEmail((prev) => ({ ...prev, [team.id]: e.target.value }))
                      }
                      placeholder="Add member by email"
                      className="border rounded-xl px-3 py-2"
                      disabled={adding}
                    />
                    <select
                      value={addRole[team.id] || 'member'}
                      onChange={(e) =>
                        setAddRole((prev) => ({
                          ...prev,
                          [team.id]: e.target.value as 'owner' | 'member',
                        }))
                      }
                      className="border rounded-xl px-3 py-2"
                      disabled={adding}
                    >
                      <option value="member">Member</option>
                      <option value="owner">Captain</option>
                    </select>
                    <button
                      onClick={() => addMember(team.id)}
                      className="border rounded-xl px-3 py-2"
                      disabled={adding}
                    >
                      {adding ? 'Adding…' : 'Add'}
                    </button>
                  </div>

                  {errAdd[team.id] && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errAdd[team.id]}</p>
                  )}

                  {/* Members table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-[640px] w-full border rounded-lg overflow-hidden">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr className="text-left">
                          <th className="p-2 border-b">Email</th>
                          <th className="p-2 border-b">Role</th>
                          <th className="p-2 border-b w-[360px]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.members.map((m) => (
                          <tr
                            key={m.id}
                            className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                          >
                            <td className="p-2 border-b">{m.email}</td>
                            <td className="p-2 border-b">
                              {m.role === 'owner' ? 'Captain' : 'Member'}
                            </td>
                            <td className="p-2 border-b">
                              <div className="flex flex-wrap gap-2">
                                {m.role !== 'owner' ? (
                                  <button
                                    onClick={() => setCaptain(team.id, m.email)}
                                    className="border rounded-xl px-3 py-1"
                                    disabled={changingRole}
                                  >
                                    {changingRole ? 'Working…' : 'Make Captain'}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => makeMember(team.id, m.email)}
                                    className="border rounded-xl px-3 py-1"
                                    disabled={changingRole}
                                  >
                                    {changingRole ? 'Working…' : 'Make Member'}
                                  </button>
                                )}
                                <button
                                  onClick={() => removeMember(team.id, m.id, m.email)}
                                  className="border rounded-xl px-3 py-1"
                                  disabled={removing}
                                >
                                  {removing ? 'Removing…' : 'Remove'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {team.members.length === 0 && (
                          <tr>
                            <td className="p-2" colSpan={3}>
                              No members yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>
    </>
  )
}
