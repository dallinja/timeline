import { CreateEntryInput, EventEntries, UpsertEntryInput } from '@/services/entries.server'

export type HouseEntryInput = {
  userId: string
  scenario: string
  name: string
  startYear: number
  endYear: number
  existing?: boolean
  houseValue: number
  taxable?: boolean
  annualAppreciationRate?: number
  annualExpenses?: number
  annualExpensesRate?: number
  mortgageAmount?: number
  mortgageYears?: number
  mortgageRate?: number
}

export function createHouseEntries(
  input: HouseEntryInput,
): [CreateEntryInput, CreateEntryInput[], null] {
  return buildHouseEntries(input)
}

export function updateHouseEntries(
  input: HouseEntryInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null] {
  return buildHouseEntries(input, selectedEvent)
}

function buildHouseEntries(input: HouseEntryInput): [CreateEntryInput, CreateEntryInput[], null]
function buildHouseEntries(
  input: HouseEntryInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null]

function buildHouseEntries(
  {
    userId,
    scenario,
    name,
    startYear,
    endYear,
    existing,
    houseValue,
    taxable = false,
    annualAppreciationRate,
    annualExpenses,
    annualExpensesRate,
    mortgageAmount,
    mortgageYears,
    mortgageRate,
  }: HouseEntryInput,
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
    sub_type: 'house',
    start_year: startYear,
    end_year: endYear,
    existing,
    ...(houseValue ? { property_start: houseValue } : {}),
    ...(annualAppreciationRate ? { property_rate: annualAppreciationRate } : {}),
    ...(annualExpenses ? { cash_recurring: annualExpenses } : {}),
    ...(annualExpensesRate ? { cash_recurring_rate: annualExpensesRate } : {}),
    ...(taxable ? { cash_taxable: true } : {}),
  }

  const relatedLoan = selectedEvent?.relatedEntries?.find((ent) => ent.type === 'loan')
  const relatedEntries: (CreateEntryInput | UpsertEntryInput)[] = []

  if (mortgageAmount) {
    const loadEntry: CreateEntryInput | UpsertEntryInput = {
      ...(relatedLoan ? { id: relatedLoan.id } : {}),
      user_id: userId,
      scenario,
      name: 'Mortgage',
      type: 'loan' as CreateEntryInput['type'],
      start_year: startYear,
      end_year: endYear,
      existing,
      loans_start: mortgageAmount,
      loans_rate: mortgageRate,
      loans_periods: mortgageYears,
    }
    relatedEntries.push(loadEntry)
  }

  const deletedEntries = relatedLoan && !mortgageAmount ? { ids: [relatedLoan.id] } : null

  return [entry, relatedEntries, deletedEntries]
}

export function getHouseFromEvent(event?: EventEntries): HouseEntryInput | undefined {
  if (!event) return undefined
  const loan = event.relatedEntries?.find((ent) => ent.type === 'loan')
  return {
    userId: event.user_id,
    scenario: event.scenario ?? '',
    name: event.name ?? '',
    startYear: event.start_year ?? 0,
    endYear: event.end_year ?? 0,
    existing: event.existing ?? false,
    houseValue: event.property_start ?? 0,
    taxable: event.cash_taxable ?? false,
    annualAppreciationRate: event.property_rate ?? 0,
    annualExpenses: event.cash_recurring ?? 0,
    annualExpensesRate: event.cash_recurring_rate ?? 0,
    mortgageAmount: loan?.loans_start ?? 0,
    mortgageYears: loan?.loans_periods ?? 0,
    mortgageRate: loan?.loans_rate ?? 0,
  }
}
