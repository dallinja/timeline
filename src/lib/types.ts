export type EntryType = 'income' | 'expense' | 'property' | 'loan' | 'investment'
type IncomeType = 'job' | 'one-time'
type ExpenseType = 'yearly' | 'one-time' | 'annual-donation'
export type SubType = IncomeType | ExpenseType

export type EventEntries = Entry & { relatedEntries?: Entry[] | null }

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
