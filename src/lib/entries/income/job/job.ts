import { CreateEntryInput, EventEntries, UpsertEntryInput } from '@/services/entries.client'

export type JobEventInput = {
  userId: string
  scenario: string
  name: string
  startYear: number
  endYear: number
  annualSalary: number
  annualRaiseRate?: number
  taxable?: boolean
  startingBonus?: number
  annualInvestmentRate?: number
  annualDonationRate?: number
}

export function createJobEntries(
  input: JobEventInput,
): [CreateEntryInput, CreateEntryInput[], null] {
  return buildJobEntries(input)
}

export function updateJobEntries(
  input: JobEventInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null] {
  return buildJobEntries(input, selectedEvent)
}

function buildJobEntries(input: JobEventInput): [CreateEntryInput, CreateEntryInput[], null]
function buildJobEntries(
  input: JobEventInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null]

function buildJobEntries(
  {
    userId,
    scenario,
    name,
    startYear,
    endYear,
    annualSalary,
    annualRaiseRate,
    taxable = false,
    startingBonus,
    annualInvestmentRate,
    annualDonationRate,
  }: JobEventInput,
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
    sub_type: 'job',
    start_year: startYear,
    end_year: endYear,
    ...(startingBonus ? { cash_start: startingBonus } : {}),
    ...(annualSalary ? { cash_recurring: annualSalary } : {}),
    ...(annualRaiseRate ? { cash_recurring_rate: annualRaiseRate } : {}),
    ...(taxable ? { cash_taxable: true } : {}),
  }

  const relatedInvestment = selectedEvent?.relatedEntries?.find(
    (ent) => ent.sub_type === 'annual_investment',
  )
  const relatedDonation = selectedEvent?.relatedEntries?.find(
    (ent) => ent.sub_type === 'annual_donation',
  )
  const relatedEntries: (CreateEntryInput | UpsertEntryInput)[] = []

  if (annualInvestmentRate) {
    const investmentEntry: CreateEntryInput | UpsertEntryInput = {
      ...(relatedInvestment ? { id: relatedInvestment.id } : {}),
      user_id: userId,
      scenario,
      name: 'Annual investment',
      type: 'investment' as CreateEntryInput['type'],
      sub_type: 'annual_investment' as CreateEntryInput['sub_type'],
      start_year: startYear,
      end_year: endYear,
      investments_recurring: annualSalary * annualInvestmentRate,
      investments_rate: 0.1,
      ...(annualRaiseRate ? { investments_recurring_rate: annualRaiseRate } : {}),
      ...(selectedEvent ? { parent_id: selectedEvent.id } : {}),
    }
    relatedEntries.push(investmentEntry)
  }

  if (annualDonationRate) {
    const donationEntry: CreateEntryInput | UpsertEntryInput = {
      ...(relatedDonation ? { id: relatedDonation.id } : {}),
      user_id: userId,
      scenario,
      name: 'Annual donation',
      type: 'expense' as CreateEntryInput['type'],
      sub_type: 'annual_donation' as CreateEntryInput['sub_type'],
      start_year: startYear,
      end_year: endYear,
      cash_recurring: -annualSalary * annualDonationRate,
      ...(annualRaiseRate ? { cash_recurring_rate: annualRaiseRate } : {}),
      ...(selectedEvent ? { parent_id: selectedEvent.id } : {}),
    }
    relatedEntries.push(donationEntry)
  }

  const deletedEntries =
    relatedDonation && !annualDonationRate ? { ids: [relatedDonation.id] } : null

  return [entry, relatedEntries, deletedEntries]
}

export function getJobFromEvent(event?: EventEntries): JobEventInput | undefined {
  if (!event) return undefined
  const relatedInvestment = event.relatedEntries?.find(
    (ent) => ent.sub_type === 'annual_investment',
  )
  const relatedDonation = event.relatedEntries?.find((ent) => ent.sub_type === 'annual_donation')
  return {
    userId: event.user_id,
    scenario: event.scenario ?? '',
    name: event.name ?? '',
    startYear: event.start_year ?? 0,
    endYear: event.end_year ?? 0,
    annualSalary: event.cash_recurring ?? 0,
    taxable: event.cash_taxable ?? false,
    annualRaiseRate: event.cash_recurring_rate ?? 0,
    startingBonus: event.cash_start ?? 0,
    annualInvestmentRate: relatedInvestment
      ? (relatedInvestment.investments_recurring ?? 0) / (event.cash_recurring ?? 1)
      : undefined,
    annualDonationRate: relatedDonation
      ? (relatedDonation.cash_recurring ?? 0) / -(event.cash_recurring ?? 1)
      : undefined,
  }
}
