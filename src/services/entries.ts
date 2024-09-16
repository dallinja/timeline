import { Database } from '@/utils/supabase/database.types'
import { createClient } from '@/utils/supabase/server'

export type Entry = Database['public']['Tables']['entries']['Row']
export type CreateEntryInput = Database['public']['Tables']['entries']['Insert']
export type UpdateEntryInput = Database['public']['Tables']['entries']['Update']
export type DeleteEntryInput =
  | {
      id: number
    }
  | { id: undefined; scenario: string }
export type EntryType = 'income' | 'expense' | 'property' | 'investment' | 'loan'

/**
 * READ
 */

export async function getEntries({
  userId,
  scenario = 'default',
}: {
  userId: string
  scenario?: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('entries')
    .select('*, relatedEntries:entries!parent_id(*)')
    .match({ user_id: userId, scenario })
  // .is('parent_id', null)
  // .returns<>()
  if (error) throw error
  return data
}

/**
 * CREATE
 */

export async function createEntries(entriesInput: CreateEntryInput[]) {
  const supabase = createClient()
  const { data, error } = await supabase.from('entries').insert(entriesInput).select()
  if (error) throw error
  return data
}

export async function updateEntry(entriesInput: UpdateEntryInput & { id: number }) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('entries')
    .update(entriesInput)
    .eq('id', entriesInput.id)
    .select()
  if (error) throw error
  return data
}
