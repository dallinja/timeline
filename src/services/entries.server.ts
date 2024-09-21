import { Database } from '@/utils/supabase/database.types'
import { createClient } from '@/utils/supabase/server'

export type Entry = Database['public']['Tables']['entries']['Row']
export type EventEntries = Entry & { relatedEntries?: Entry[] | null }
export type CreateEntryInput = Database['public']['Tables']['entries']['Insert']
export type UpdateEntryInput = Database['public']['Tables']['entries']['Update'] & { id: number }
export type UpsertEntryInput = Database['public']['Tables']['entries']['Update'] & {
  id: number
  user_id: string
}
export type DeleteEntriesInput = { ids: number[] }
export type EntryType = 'income' | 'expense' | 'property' | 'investment' | 'loan'
type IncomeType = 'job' | 'one_time'
type ExpenseType = 'yearly' | 'one_time' | 'annual_donation'
type PropertyType = 'house' | 'car' | 'other'
export type SubType = IncomeType | ExpenseType | PropertyType

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
    .select('*')
    .match({ user_id: userId, scenario })
  if (error) throw error
  return data
}

export async function getEntriesAndSubEntries({
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
    .is('parent_id', null)
  if (error) throw error
  return data
}

/**
 * CREATE, UPDATE, DELETE
 */

export async function createEntries(entriesInput: CreateEntryInput[]) {
  const supabase = createClient()
  const { data, error } = await supabase.from('entries').insert(entriesInput).select()
  if (error) throw error
  return data
}

export async function updateEntry(entryInput: UpdateEntryInput) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('entries')
    .update(entryInput)
    .eq('id', entryInput.id)
    .select()
  if (error) throw error
  return data
}

export async function updateEntries(entriesInput: UpsertEntryInput[]) {
  const supabase = createClient()
  const { data, error } = await supabase.from('entries').upsert(entriesInput).select()
  if (error) throw error
  return data
}

export async function deleteEntries(deleteInput: DeleteEntriesInput) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('entries')
    .delete()
    .in('id', deleteInput.ids)
    .select('id')
  if (error) throw error
  return data
}
