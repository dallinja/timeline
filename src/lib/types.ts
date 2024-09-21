export type EntryType = 'income' | 'expense' | 'property' | 'loan' | 'investment'
type IncomeType = 'job' | 'one_time'
type ExpenseType = 'yearly' | 'one_time' | 'annual_donation'
type PropertyType = 'house' | 'car' | 'other'
export type SubType = IncomeType | ExpenseType | PropertyType

export type EventEntries = Entry & { relatedEntries?: Entry[] | null }

export type EntryField =
  | {
      key: keyof Entry
      type: 'number' | 'string' | 'boolean'
    }
  | {
      key: keyof Entry
      type: 'union'
      options: string[]
    }

export const EntryFields: EntryField[] = [
  { key: 'id', type: 'number' },
  { key: 'created_at', type: 'string' },
  { key: 'user_id', type: 'string' },
  { key: 'scenario', type: 'string' },

  { key: 'type', type: 'union', options: ['income', 'expense', 'property', 'loan', 'investment'] },
  {
    key: 'sub_type',
    type: 'union',
    options: ['job', 'one_time', 'yearly', 'annual_donation', 'house'],
  },
  { key: 'name', type: 'string' },
  { key: 'parent_id', type: 'number' },

  { key: 'start_year', type: 'number' },
  { key: 'end_year', type: 'number' },

  { key: 'cash_start', type: 'number' },
  { key: 'cash_rate', type: 'number' },
  { key: 'cash_recurring', type: 'number' },
  { key: 'cash_recurring_rate', type: 'number' },
  { key: 'cash_taxable', type: 'boolean' },

  { key: 'investments_start', type: 'number' },
  { key: 'investments_rate', type: 'number' },
  { key: 'investments_recurring', type: 'number' },
  { key: 'investments_recurring_rate', type: 'number' },

  { key: 'loans_start', type: 'number' },
  { key: 'loans_rate', type: 'number' },
  { key: 'loans_periods', type: 'number' },

  { key: 'property_start', type: 'number' },
  { key: 'property_rate', type: 'number' },
]

export type Entry = {
  id: number
  created_at: string
  user_id: string
  scenario: string

  type: EntryType | null
  sub_type: SubType | null
  name: string | null
  parent_id: number | null
  meta?: Record<string, any>

  start_year: number | null
  end_year: number | null

  cash_start: number | null
  cash_rate: number | null
  cash_recurring: number | null
  cash_recurring_rate: number | null
  cash_taxable: boolean

  investments_start: number | null
  investments_rate: number | null
  investments_recurring: number | null
  investments_recurring_rate: number | null

  loans_start: number | null
  loans_rate: number | null
  loans_periods: number | null

  property_start: number | null
  property_rate: number | null
}

export type CreateEntryInput = {
  user_id?: string
  scenario: string

  type: EntryType | null
  sub_type?: SubType | null
  name?: string | null
  parent_id?: number | null

  start_year?: number | null
  end_year?: number | null

  cash_start?: number | null
  cash_rate?: number | null
  cash_recurring?: number | null
  cash_recurring_rate?: number | null
  cash_taxable?: boolean

  investments_start?: number | null
  investments_rate?: number | null
  investments_recurring?: number | null
  investments_recurring_rate?: number | null

  loans_start?: number | null
  loans_rate?: number | null
  loans_periods?: number | null

  property_start?: number | null
  property_rate?: number | null
}

export type UpdateEntryInput = {
  id: number
  user_id?: string
  scenario?: string

  type?: EntryType | null
  sub_type?: SubType | null
  name?: string | null
  parent_id?: number | null

  start_year?: number | null
  end_year?: number | null

  cash_start?: number | null
  cash_rate?: number | null
  cash_recurring?: number | null
  cash_recurring_rate?: number | null
  cash_taxable?: boolean

  investments_start?: number | null
  investments_rate?: number | null
  investments_recurring?: number | null
  investments_recurring_rate?: number | null

  loans_start?: number | null
  loans_rate?: number | null
  loans_periods?: number | null

  property_start?: number | null
  property_rate?: number | null
}

export type UpsertEntryInput = CreateEntryInput & { id?: number }

export type DeleteEntryInput =
  | {
      id: number
    }
  | { id: undefined; scenario: string }
