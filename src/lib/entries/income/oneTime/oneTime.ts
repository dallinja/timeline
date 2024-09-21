import {
  CreateEntryInput,
  EventEntries,
  UpdateEntryInput,
  UpsertEntryInput,
} from '@/services/entries.client'

export type OneTimeEventInput = {
  userId: string
  scenario: string
  name: string
  year: number
  amount: number
  taxable?: boolean
}

export function createOneTimeEntries(
  input: OneTimeEventInput,
): [CreateEntryInput, CreateEntryInput[], null] {
  return buildOneTimeEntries(input)
}

export function updateOneTimeEntries(
  input: OneTimeEventInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null] {
  return buildOneTimeEntries(input, selectedEvent)
}

function buildOneTimeEntries(input: OneTimeEventInput): [CreateEntryInput, CreateEntryInput[], null]
function buildOneTimeEntries(
  input: OneTimeEventInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null]

function buildOneTimeEntries(
  { userId, scenario, name, year, amount, taxable = false }: OneTimeEventInput,
  selectedEvent?: EventEntries,
): [
  CreateEntryInput | UpsertEntryInput,
  (CreateEntryInput | UpsertEntryInput)[],
  { ids: number[] } | null,
] {
  const entry: CreateEntryInput | UpsertEntryInput = {
    ...(selectedEvent ? { id: selectedEvent.id } : {}),
    user_id: userId,
    scenario,
    name,
    type: 'income',
    sub_type: 'one_time',
    start_year: year,
    end_year: year,
    ...(amount ? { cash_start: amount } : {}),
    ...(taxable ? { cash_taxable: true } : {}),
  }
  const relatedEntries: CreateEntryInput[] = []

  return [entry, relatedEntries, null]
}

export function getOneTimeFromEvent(event?: EventEntries): OneTimeEventInput | undefined {
  if (!event) return undefined
  return {
    userId: event.user_id,
    scenario: event.scenario ?? '',
    name: event.name ?? '',
    year: event.start_year ?? 0,
    amount: event.cash_start ?? 0,
    taxable: event.cash_taxable ?? false,
  }
}
