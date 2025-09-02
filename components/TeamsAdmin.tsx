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

export default function TeamsAdmin() {
  const supabase = supabaseBrowser()
  const [rows, setRows] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newTeamName, setNewTeamName] = useState('')
  const [addEmail, setAddEmail] = useState<Record<string, string>>({})
  const [addRole, setAddRole] = useState<Record<string, 'owner' | 'member'>>({})

  const teams: Team[] = useMemo(() => {
    const map = new Map<string, Team>()
    for (const r of rows) {
      if (!map.has(r.team_id)) {
        map.set(r.team_id, { id: r.team_id, name: r.team_name, created_by: r.created_by, members: [] })
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
    setLoading(true); setError(null)
    try {
      const { data, error } = await supabase.rpc('admin_list_teams')
      if (error) throw new Error(error.message)
      setRows((data ?? []) as AdminRow[])
    } catch (e: any) {
      setError(e.message || 'Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const createTeam = async () => {
    setError(null)
    const name = newTeamName.trim()
    if (!name) { setError('Team name is required'); return }
    const { error } = await supabase.rpc('admin_create_team', { p_name: name })
    if (error) { setError(error.message); return }
    setNewTeamName('')
    await load()
  }

  const addMember = async (teamId: string) => {
    setError(null)
    const email = (addEmail[teamId] || '').trim()
    const role = addRole[teamId] || 'member'
    if (!email) { setError('Email is required'); return }
    const { error } = await supabase.rpc('admin_add_member_by_email', {
      p_team_id: teamId, p_email: email, p_role: role
    })
    if (error) { setError(error.message); return }
    setAddEmail(prev => ({ ...prev, [teamId]: '' }))
    await load()
  }

  const setCaptain = async (teamId: string, email: string) => {
    setError(null)
    const { error } = await supabase.rpc('admin_add_member_by_email', {
      p_team_id: teamId, p_email: email, p_role: 'owner'
    })
    if (error) { setError(error.message); return }
    await load()
  }

  const makeMember = async (teamId: string, email: string) => {
    setError(null)
    const { error } = await supabase.rpc('admin_add_member_by_email', {
      p_team_id: teamId, p_email: email, p_role: 'member'
    })
    if (error) { setError(error.message); return }
    await load()
  }

  const removeMember = async (teamId: string, userId: string) => {
    setError(null)
    const ok = confirm('Remove this member from the team?')
    if (!ok) return
    const { error } = await supabase.rpc('admin_remove_member', {
      p_team_id: teamId, p_user_id: userId
    })
    if (error) { setError(error.message); return }
    await load()
  }

  if (loading) return <p>Loading…</p>

  return (
    <section className="grid gap-6">
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {/* Create team */}
      <div className="border rounded-xl p-4 grid gap-3">
        <h2 className="text-lg font-semibold">Create Team</h2>
        <div className="flex gap-2">
          <input
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Team name"
            className="border rounded-xl px-3 py-2 flex-1"
          />
          <button onClick={createTeam} className="border rounded-xl px-3 py-2">
            Create
          </button>
        </div>
        <p className="text-sm opacity-70">
          You’ll be added as the owner automatically.
        </p>
      </div>

      {/* Teams list */}
      <div className="grid gap-4">
        {teams.length === 0 ? (
          <p>No teams yet.</p>
        ) : (
          teams.map(team => (
            <div key={team.id} className="border rounded-xl p-4 grid gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <span className="text-sm opacity-70">ID: {team.id}</span>
              </div>

              {/* Add member */}
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  value={addEmail[team.id] || ''}
                  onChange={(e) => setAddEmail(prev => ({ ...prev, [team.id]: e.target.value }))}
                  placeholder="Add member by email"
                  className="border rounded-xl px-3 py-2"
                />
                <select
                  value={addRole[team.id] || 'member'}
                  onChange={(e) => setAddRole(prev => ({ ...prev, [team.id]: e.target.value as 'owner' | 'member' }))}
                  className="border rounded-xl px-3 py-2"
                >
                  <option value="member">Member</option>
                  <option value="owner">Captain</option>
                </select>
                <button onClick={() => addMember(team.id)} className="border rounded-xl px-3 py-2">
                  Add
                </button>
              </div>

              {/* Members table */}
              <div className="overflow-x-auto">
                <table className="min-w-[640px] w-full border rounded-lg overflow-hidden">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr className="text-left">
                      <th className="p-2 border-b">Email</th>
                      <th className="p-2 border-b">Role</th>
                      <th className="p-2 border-b w-[320px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.members.map(m => (
                      <tr key={m.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                        <td className="p-2 border-b">{m.email}</td>
                        <td className="p-2 border-b">{m.role === 'owner' ? 'Captain' : 'Member'}</td>
                        <td className="p-2 border-b">
                          <div className="flex flex-wrap gap-2">
                            {m.role !== 'owner' ? (
                              <button onClick={() => setCaptain(team.id, m.email)} className="border rounded-xl px-3 py-1">
                                Make Captain
                              </button>
                            ) : (
                              <button onClick={() => makeMember(team.id, m.email)} className="border rounded-xl px-3 py-1">
                                Make Member
                              </button>
                            )}
                            <button onClick={() => removeMember(team.id, m.id)} className="border rounded-xl px-3 py-1">
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {team.members.length === 0 && (
                      <tr><td className="p-2" colSpan={3}>No members yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
