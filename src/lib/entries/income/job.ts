import {
  CreateEntryInput,
  Entry,
  EventEntries,
  UpdateEntryInput,
  UpsertEntryInput,
} from '@/lib/types'

type JobEntryInput = {
  scenario: string
  name: string
  startYear: number
  endYear: number
  annualAmount: number
  taxable?: boolean
  annualRaiseRate?: number
  startingBonus?: number
  annualDonationRate?: number
  promotions?: {
    startYear: number
    amount?: number
    increaseAmount?: number
    increaseRate?: number
  }[]
}

export function createJobEntries(
  input: JobEntryInput,
): (CreateEntryInput & { related_entries?: CreateEntryInput[] })[] {
  return buildJobEntries(input)
}

export function updateJobEntries(
  input: JobEntryInput,
  selectedEvent: EventEntries,
): (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[] {
  return buildJobEntries(input, selectedEvent)
}

function buildJobEntries(
  input: JobEntryInput,
): (CreateEntryInput & { related_entries?: CreateEntryInput[] })[]
function buildJobEntries(
  input: JobEntryInput,
  selectedEvent: EventEntries,
): (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[]
function buildJobEntries(
  {
    scenario,
    name,
    startYear,
    endYear,
    annualAmount,
    taxable = false,
    annualRaiseRate,
    startingBonus,
    annualDonationRate,
  }: JobEntryInput,
  selectedEvent?: EventEntries,
):
  | (CreateEntryInput & { related_entries?: CreateEntryInput[] })[]
  | (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[] {
  const annualDonationEntry = selectedEvent?.relatedEntries?.find(
    (ent) => ent.sub_type === 'annual-donation',
  )
  const relatedEntries: UpsertEntryInput[] = [
    ...(annualDonationRate
      ? [
          {
            ...baseEntry,
            ...(annualDonationEntry ? { id: annualDonationEntry.id } : {}),
            scenario,
            name: 'Annual donation',
            type: 'expense' as CreateEntryInput['type'],
            sub_type: 'annual-donation' as CreateEntryInput['sub_type'],
            start_year: startYear,
            end_year: endYear,
            cash_recurring: -annualAmount * annualDonationRate,
            ...(annualRaiseRate ? { cash_recurring_rate: annualRaiseRate } : {}),
            ...(selectedEvent ? { parent_id: selectedEvent.id } : {}),
          },
        ]
      : []),
  ]
  return [
    {
      ...baseEntry,
      ...(selectedEvent ? { id: selectedEvent.id } : {}),
      scenario,
      name,
      type: 'income',
      sub_type: 'job',
      start_year: startYear,
      end_year: endYear,
      ...(startingBonus ? { cash_start: startingBonus } : {}),
      ...(annualAmount ? { cash_recurring: annualAmount } : {}),
      ...(annualRaiseRate ? { cash_recurring_rate: annualRaiseRate } : {}),
      ...(taxable ? { cash_taxable: true } : {}),
      ...(relatedEntries.length > 0 ? { related_entries: relatedEntries } : {}),
    },
  ]
}

export function getJobFromEntry(event?: EventEntries): JobEntryInput | undefined {
  if (!event) return undefined
  const annualDonationEntry = event.relatedEntries?.find(
    (ent) => ent.sub_type === 'annual-donation',
  )
  return {
    scenario: event.scenario,
    name: event.name ?? '',
    startYear: event.start_year ?? 0,
    endYear: event.end_year ?? 0,
    annualAmount: event.cash_recurring ?? 0,
    taxable: event.cash_taxable,
    annualRaiseRate: event.cash_recurring_rate ?? undefined,
    startingBonus: event.cash_start ?? undefined,
    annualDonationRate: annualDonationEntry
      ? (annualDonationEntry.cash_recurring || 0) / -(event.cash_recurring ?? 1)
      : undefined,
    // promotions: {
    //   startYear: event.cash_rate,
    //   amount: event.cash_rate,
    //   increaseAmount: event.cash_rate,
    //   increaseRate: event.cash_rate,
    // }[]
  }
}

const baseEntry: CreateEntryInput = {
  name: '',
  parent_id: null,
  type: 'income',
  sub_type: 'job',
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
