import { CreateEntryInput, EventEntries, UpsertEntryInput } from '@/services/entries.client'

export type VehicleEntryInput = {
  userId: string
  scenario: string
  name: string
  startYear: number
  endYear: number
  existing?: boolean
  vehicleValue: number
  taxable?: boolean
  annualDepreciationRate?: number
  annualExpenses?: number
  annualExpensesRate?: number
  loanAmount?: number
  loanYears?: number
  loanRate?: number
}

export function createVehicleEntries(
  input: VehicleEntryInput,
): [CreateEntryInput, CreateEntryInput[], null] {
  return buildVehicleEntries(input)
}

export function updateVehicleEntries(
  input: VehicleEntryInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null] {
  return buildVehicleEntries(input, selectedEvent)
}

function buildVehicleEntries(input: VehicleEntryInput): [CreateEntryInput, CreateEntryInput[], null]
function buildVehicleEntries(
  input: VehicleEntryInput,
  selectedEvent: EventEntries,
): [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null]

function buildVehicleEntries(
  {
    userId,
    scenario,
    name,
    startYear,
    endYear,
    existing,
    vehicleValue,
    taxable = false,
    annualDepreciationRate,
    annualExpenses,
    annualExpensesRate,
    loanAmount,
    loanYears,
    loanRate,
  }: VehicleEntryInput,
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
    type: 'property',
    sub_type: 'vehicle',
    start_year: startYear,
    end_year: endYear,
    existing,
    ...(vehicleValue ? { property_start: vehicleValue } : {}),
    ...(annualDepreciationRate ? { property_rate: -annualDepreciationRate } : {}),
    ...(annualExpenses ? { cash_recurring: annualExpenses } : {}),
    ...(annualExpensesRate ? { cash_recurring_rate: annualExpensesRate } : {}),
    ...(taxable ? { cash_taxable: true } : {}),
  }

  const relatedLoan = selectedEvent?.relatedEntries?.find((ent) => ent.type === 'loan')
  const relatedEntries: (CreateEntryInput | UpsertEntryInput)[] = []

  if (loanAmount) {
    const loadEntry: CreateEntryInput | UpsertEntryInput = {
      ...(relatedLoan ? { id: relatedLoan.id } : {}),
      user_id: userId,
      scenario,
      name: 'Loan',
      type: 'loan' as CreateEntryInput['type'],
      start_year: startYear,
      end_year: endYear,
      existing,
      loans_start: loanAmount,
      loans_rate: loanRate,
      loans_periods: loanYears,
      ...(selectedEvent ? { parent_id: selectedEvent.id } : {}),
    }
    relatedEntries.push(loadEntry)
  }

  const deletedEntries = relatedLoan && !loanAmount ? { ids: [relatedLoan.id] } : null

  return [entry, relatedEntries, deletedEntries]
}

export function getVehicleFromEvent(event?: EventEntries): VehicleEntryInput | undefined {
  if (!event) return undefined
  const loan = event.relatedEntries?.find((ent) => ent.type === 'loan')
  return {
    userId: event.user_id,
    scenario: event.scenario ?? '',
    name: event.name ?? '',
    startYear: event.start_year ?? 0,
    endYear: event.end_year ?? 0,
    existing: event.existing ?? false,
    vehicleValue: event.property_start ?? 0,
    taxable: event.cash_taxable ?? false,
    annualDepreciationRate: -(event.property_rate ?? 0),
    annualExpenses: event.cash_recurring ?? 0,
    annualExpensesRate: event.cash_recurring_rate ?? 0,
    loanAmount: loan?.loans_start ?? 0,
    loanYears: loan?.loans_periods ?? 0,
    loanRate: loan?.loans_rate ?? 0,
  }
}
