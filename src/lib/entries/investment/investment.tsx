import { CreateEntryInput, EventEntries, UpsertEntryInput } from '@/services/entries.client'

export type InvestmentEventInput = {
  userId: string
  scenario: string
  name: string
  startYear: number
  endYear: number
  annualAmount: number
  annualReturnRate?: number
  taxable?: boolean
}

export function createInvestmentEntries(
  input: InvestmentEventInput,
): [CreateEntryInput, CreateEntryInput[], null] {
  return buildInvestmentEntries(input)
}

export function updateInvestmentEntries(
  input: InvestmentEventInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null] {
  return buildInvestmentEntries(input, selectedEvent)
}

function buildInvestmentEntries(
  input: InvestmentEventInput,
): [CreateEntryInput, CreateEntryInput[], null]
function buildInvestmentEntries(
  input: InvestmentEventInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null]

function buildInvestmentEntries(
  {
    userId,
    scenario,
    name,
    startYear,
    endYear,
    annualAmount,
    annualReturnRate,
    taxable = false,
  }: InvestmentEventInput,
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
    type: 'investment',
    sub_type: 'investment',
    start_year: startYear,
    end_year: endYear,
    ...(annualAmount ? { cash_recurring: annualAmount } : {}),
    ...(annualReturnRate ? { cash_recurring_rate: annualReturnRate } : {}),
    ...(taxable ? { cash_taxable: true } : {}),
  }
  const relatedEntries: (CreateEntryInput | UpsertEntryInput)[] = []

  return [entry, relatedEntries, null]
}

export function getInvestmentFromEvent(event?: EventEntries): InvestmentEventInput | undefined {
  if (!event) return undefined
  const relatedDonation = event.relatedEntries?.find((ent) => ent.sub_type === 'annual_donation')
  return {
    userId: event.user_id,
    scenario: event.scenario ?? '',
    name: event.name ?? '',
    startYear: event.start_year ?? 0,
    endYear: event.end_year ?? 0,
    annualAmount: event.cash_recurring ?? 0,
    taxable: event.cash_taxable ?? false,
    annualReturnRate: event.cash_recurring_rate ?? 0,
  }
}
