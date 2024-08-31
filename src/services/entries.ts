import { supabase } from '@/db/supabase'
import { Database } from '@/db/supabaseTypes'

/**
 * READ
 */

export type Entry = Database['public']['Tables']['entries']['Row']
export type EntryCreate = Database['public']['Tables']['entries']['Insert']
export type EntryUpdate = Database['public']['Tables']['entries']['Update']

export async function getEntries() {
  const { data, error } = await supabase
    .from('entries')
    .select('*, relatedEntries:entries!parent_id(*)')
    .is('parent_id', null)
  // .returns<>()
  if (error) throw error
  return data
}

/**
 * CREATE
 */

export async function createEntries(entriesInput: EntryCreate[]) {
  const { data, error } = await supabase.from('entries').insert(entriesInput).select()
  if (error) throw error
  return data
}

export async function updateEntry(entriesInput: EntryUpdate & { id: number }) {
  const { data, error } = await supabase
    .from('entries')
    .update(entriesInput)
    .eq('id', entriesInput.id)
    .select()
  if (error) throw error
  return data
}
