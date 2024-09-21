import { CreateEntryInput, EventEntries, UpdateEntryInput, UpsertEntryInput } from '@/lib/types'

type OneTimeEntryInput = {
  scenario: string
  name: string
  year: number
  amount: number
  taxable?: boolean
}

export function createOneTimeEntries(
  input: OneTimeEntryInput,
): (CreateEntryInput & { related_entries?: CreateEntryInput[] })[] {
  return buildOneTimeEntries(input)
}

export function updateOneTimeEntries(
  input: OneTimeEntryInput,
  selectedEvent: EventEntries,
): (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[] {
  return buildOneTimeEntries(input, selectedEvent)
}

function buildOneTimeEntries(
  input: OneTimeEntryInput,
): (CreateEntryInput & { related_entries?: CreateEntryInput[] })[]
function buildOneTimeEntries(
  input: OneTimeEntryInput,
  selectedEvent: EventEntries,
): (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[]
function buildOneTimeEntries(
  input: OneTimeEntryInput,
  selectedEvent?: EventEntries,
):
  | (CreateEntryInput & { related_entries?: CreateEntryInput[] })[]
  | (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[] {
  const { scenario, name, year, amount, taxable = false } = input
  return [
    {
      ...baseEntry,
      ...(selectedEvent ? { id: selectedEvent.id } : {}),
      scenario,
      name,
      start_year: year,
      end_year: year,
      cash_start: -amount,
      cash_taxable: taxable,
    },
  ]
}

export function getOneTimeFromEntry(event?: EventEntries): OneTimeEntryInput | undefined {
  if (!event) return undefined
  return {
    scenario: event.scenario,
    name: event.name ?? '',
    year: event.start_year ?? 0,
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
