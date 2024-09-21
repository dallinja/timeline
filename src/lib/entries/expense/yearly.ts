import { CreateEntryInput, EventEntries, UpdateEntryInput, UpsertEntryInput } from '@/lib/types'

type YearlyEntryInput = {
  scenario: string
  name: string
  startYear: number
  endYear: number
  amount: number
  taxable?: boolean
}

export function createYearlyEntries(
  input: YearlyEntryInput,
): (CreateEntryInput & { related_entries?: CreateEntryInput[] })[] {
  return buildYearlyEntries(input)
}

export function updateYearlyEntries(
  input: YearlyEntryInput,
  selectedEvent: EventEntries,
): (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[] {
  return buildYearlyEntries(input, selectedEvent)
}

function buildYearlyEntries(
  input: YearlyEntryInput,
): (CreateEntryInput & { related_entries?: CreateEntryInput[] })[]
function buildYearlyEntries(
  input: YearlyEntryInput,
  selectedEvent: EventEntries,
): (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[]
function buildYearlyEntries(
  input: YearlyEntryInput,
  selectedEvent?: EventEntries,
):
  | (CreateEntryInput & { related_entries?: CreateEntryInput[] })[]
  | (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[] {
  const { scenario, name, startYear, endYear, amount, taxable = false } = input
  return [
    {
      ...baseEntry,
      ...(selectedEvent ? { id: selectedEvent.id } : {}),
      scenario,
      name,
      start_year: startYear,
      end_year: endYear,
      cash_start: -amount,
      cash_taxable: taxable,
    },
  ]
}

export function getYearlyFromEntry(event?: EventEntries): YearlyEntryInput | undefined {
  if (!event) return undefined
  return {
    scenario: event.scenario,
    name: event.name ?? '',
    startYear: event.start_year ?? 0,
    endYear: event.end_year ?? 0,
    amount: -(event.cash_start ?? 0),
    taxable: event.cash_taxable,
  }
}

const baseEntry: CreateEntryInput = {
  name: '',
  parent_id: null,
  type: 'expense',
  sub_type: 'one_time',
  user_id: '1',
  scenario: 'default',

  start_year: 0,
  end_year: 0,

  cash_start: 0,
  cash_rate: 0,
  cash_recurring: 0,
  cash_recurring_rate: 0,
  cash_taxable: false,

  property_start: 0,
  property_rate: 0,

  investments_start: 0,
  investments_rate: 0,
  investments_recurring: 0,
  investments_recurring_rate: 0,

  loans_start: 0,
  loans_rate: 0,
  loans_periods: 0,
}
