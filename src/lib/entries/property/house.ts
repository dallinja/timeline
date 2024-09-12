import {
  CreateEntryInput,
  Entry,
  EventEntries,
  UpdateEntryInput,
  UpsertEntryInput,
} from '@/services/entries'

export type HouseEntryInput = {
  scenario: string
  name: string
  startYear: number
  endYear: number
  cashStart?: number
  includeMortgage?: boolean
  houseValue: number
  taxable?: boolean
  annualAppreciationRate?: number
  annualExpenses?: number
  downPayment?: number
  mortgageAmount?: number
  mortgageYears?: number
  mortgageRate?: number
}

export function createHouseEntries(
  input: HouseEntryInput,
): (CreateEntryInput & { related_entries?: CreateEntryInput[] })[] {
  return buildHouseEntries(input)
}

export function updateHouseEntries(
  input: HouseEntryInput,
  selectedEvent: EventEntries,
): (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[] {
  return buildHouseEntries(input, selectedEvent)
}

function buildHouseEntries(
  input: HouseEntryInput,
): (CreateEntryInput & { related_entries?: CreateEntryInput[] })[]
function buildHouseEntries(
  input: HouseEntryInput,
  selectedEvent: EventEntries,
): (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[]
function buildHouseEntries(
  {
    scenario,
    name,
    startYear,
    endYear,
    amount,
    taxable = false,
    annualAppreciationRate,
    startingBonus,
    annualDonationRate,
  }: HouseEntryInput,
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
            cash_recurring: -amount * annualDonationRate,
            ...(annualAppreciationRate ? { cash_recurring_rate: annualAppreciationRate } : {}),
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
      sub_type: 'house',
      start_year: startYear,
      end_year: endYear,
      ...(startingBonus ? { cash_start: startingBonus } : {}),
      ...(amount ? { cash_recurring: amount } : {}),
      ...(annualAppreciationRate ? { cash_recurring_rate: annualAppreciationRate } : {}),
      ...(taxable ? { cash_taxable: true } : {}),
      ...(relatedEntries.length > 0 ? { related_entries: relatedEntries } : {}),
    },
  ]
}

export function getHouseFromEntry(event?: EventEntries): HouseEntryInput | undefined {
  if (!event) return undefined
  const annualDonationEntry = event.relatedEntries?.find(
    (ent) => ent.sub_type === 'annual-donation',
  )
  return {
    scenario: event.scenario,
    name: event.name ?? '',
    startYear: event.start_year ?? 0,
    endYear: event.end_year ?? 0,
    amount: event.cash_recurring ?? 0,
    taxable: event.cash_taxable,
    annualAppreciationRate: event.cash_recurring_rate ?? undefined,
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
  type: 'property',
  sub_type: 'house',
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
