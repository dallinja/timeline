import { CreateEntryInput, EventEntries, UpsertEntryInput } from '@/services/entries.client'

export type InvestmentEventInput = {
  userId: string
  scenario: string
  name: string
  startYear: number
  endYear: number
  existing?: boolean
  startAmount: number
  annualAmount: number
  annualGrowthRate?: number
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
    existing,
    startAmount,
    annualAmount,
    annualGrowthRate,
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
    existing: existing ?? false,
    end_year: endYear,
    ...(startAmount ? { investments_start: startAmount } : {}),
    ...(annualAmount ? { investments_recurring: annualAmount } : {}),
    ...(annualGrowthRate ? { investments_recurring_rate: annualGrowthRate } : {}),
    ...(annualReturnRate ? { investments_rate: annualReturnRate } : {}),
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
    existing: event.existing ?? false,
    startAmount: event.investments_start ?? 0,
    annualAmount: event.investments_recurring ?? 0,
    annualGrowthRate: event.investments_recurring_rate ?? 0,
    annualReturnRate: event.investments_rate ?? 0,
    taxable: event.cash_taxable ?? false,
  }
}
