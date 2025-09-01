// lib/supabaseServer.ts
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

// Let the helper infer the correct SupabaseClient type to avoid schema mismatch.
export const supabaseServer = () => createServerComponentClient({ cookies })
