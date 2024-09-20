import { CreateEntryInput, EventEntries, UpsertEntryInput } from '@/services/entries.client'

export type JobEntryInput = {
  userId: string
  scenario: string
  name: string
  startYear: number
  endYear: number
  annualSalary: number
  annualRaiseRate?: number
  taxable?: boolean
  startingBonus?: number
  annualDonationRate?: number
}

export function createJobEntries(
  input: JobEntryInput,
): [CreateEntryInput, CreateEntryInput[], null] {
  return buildJobEntries(input)
}

export function updateJobEntries(
  input: JobEntryInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null] {
  return buildJobEntries(input, selectedEvent)
}

function buildJobEntries(input: JobEntryInput): [CreateEntryInput, CreateEntryInput[], null]
function buildJobEntries(
  input: JobEntryInput,
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
    annualDonationRate,
  }: JobEntryInput,
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

  const relatedDonation = selectedEvent?.relatedEntries?.find(
    (ent) => ent.sub_type === 'annual-donation',
  )
  const relatedEntries: (CreateEntryInput | UpsertEntryInput)[] = []

  if (annualDonationRate) {
    const donationEntry: CreateEntryInput | UpsertEntryInput = {
      ...(relatedDonation ? { id: relatedDonation.id } : {}),
      user_id: userId,
      scenario,
      name: 'Annual donation',
      type: 'expense' as CreateEntryInput['type'],
      sub_type: 'annual-donation' as CreateEntryInput['sub_type'],
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

export function getJobFromEvent(event?: EventEntries): JobEntryInput | undefined {
  if (!event) return undefined
  const relatedDonation = event.relatedEntries?.find((ent) => ent.sub_type === 'annual-donation')
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
    annualDonationRate: relatedDonation
      ? (relatedDonation.cash_recurring ?? 0) / -(event.cash_recurring ?? 1)
      : undefined,
  }
}
