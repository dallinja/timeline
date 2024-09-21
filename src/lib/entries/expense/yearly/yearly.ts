import { CreateEntryInput, EventEntries, UpsertEntryInput } from '@/services/entries.client'

export type YearlyEventInput = {
  userId: string
  scenario: string
  name: string
  startYear: number
  endYear: number
  annualAmount: number
  annualIncreaseRate?: number
  taxable?: boolean
}

export function createYearlyEntries(
  input: YearlyEventInput,
): [CreateEntryInput, CreateEntryInput[], null] {
  return buildYearlyEntries(input)
}

export function updateYearlyEntries(
  input: YearlyEventInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null] {
  return buildYearlyEntries(input, selectedEvent)
}

function buildYearlyEntries(input: YearlyEventInput): [CreateEntryInput, CreateEntryInput[], null]
function buildYearlyEntries(
  input: YearlyEventInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null]
function buildYearlyEntries(
  {
    userId,
    scenario,
    name,
    startYear,
    endYear,
    annualAmount,
    annualIncreaseRate,
    taxable = false,
  }: YearlyEventInput,
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
    type: 'expense',
    sub_type: 'yearly',
    start_year: startYear,
    end_year: endYear,
    ...(annualAmount ? { cash_recurring: annualAmount } : {}),
    ...(annualIncreaseRate ? { cash_recurring_rate: annualIncreaseRate } : {}),
    ...(taxable ? { cash_taxable: true } : {}),
  }

  return [entry, [], null]
}

export function getYearlyFromEvent(event?: EventEntries): YearlyEventInput | undefined {
  if (!event) return undefined
  return {
    userId: event.user_id,
    scenario: event.scenario ?? '',
    name: event.name ?? '',
    startYear: event.start_year ?? 0,
    endYear: event.end_year ?? 0,
    annualAmount: event.cash_recurring ?? 0,
    taxable: event.cash_taxable ?? false,
    annualIncreaseRate: event.cash_recurring_rate ?? 0,
  }
}
