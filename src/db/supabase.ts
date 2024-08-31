import { createClient } from '@supabase/supabase-js'
import { Database } from './supabaseTypes'

const options = {
  // db: {
  //   schema: 'public',
  // },
  // auth: {
  //   autoRefreshToken: true,
  //   persistSession: true,
  //   detectSessionInUrl: true
  // },
  // global: {
  //   headers: { 'x-my-custom-header': 'my-app-name' },
  // },
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  options,
)
