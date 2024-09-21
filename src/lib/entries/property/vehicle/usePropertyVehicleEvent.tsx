import { useReducer } from 'react'
import { getVehicleFromEvent, VehicleEntryInput } from './vehicle'
import { EventEntries } from '@/services/entries.client'
import { roundToDec } from '@/lib/number'

const DEFAULT_APPRECIATION_RATE = 0.03

type VehicleState = {
  // UI
  includeLoan: boolean
  // General
  name: string
  startYear: string
  endYear: string
  currentHome: boolean
  // Property
  vehicleValue: string
  depreciationRate: string
  annualExpenses: string
  annualExpensesRate: string
  // Loan
  downPayment: string
  loanAmount: string
  loanYears: string
  loanRate: string
}

type VehicleAction = {
  type: 'UPDATE_FIELD'
  field: keyof VehicleState
  value: string | boolean
}

function getIncludeLoan(entry?: VehicleEntryInput) {
  return !!entry?.loanAmount
}

// Define the initial state
const initialState = (vehicle?: VehicleEntryInput): VehicleState => ({
  // UI
  includeLoan: getIncludeLoan(vehicle),
  // General
  name: vehicle?.name ?? '',
  startYear: String(vehicle?.startYear ?? ''),
  endYear: String(vehicle?.endYear ?? ''),
  currentHome: vehicle?.existing ?? false,
  // Property
  vehicleValue: String(vehicle?.vehicleValue ?? ''),
  depreciationRate: vehicle?.annualDepreciationRate
    ? String((vehicle.annualDepreciationRate ?? 0) * 100)
    : String(DEFAULT_APPRECIATION_RATE * 100),
  annualExpenses: String(vehicle?.annualExpenses ?? ''),
  annualExpensesRate: String(vehicle?.annualExpensesRate ?? ''),
  // Loan
  downPayment: String(
    vehicle?.existing ? '' : (vehicle?.vehicleValue ?? 0) - (vehicle?.loanAmount ?? 0) || '',
  ),
  loanAmount: String(vehicle?.loanAmount ?? ''),
  loanYears: String(vehicle?.loanYears ?? ''),
  loanRate: String(vehicle?.loanRate ?? ''),
})

// Define the reducer function
function reducer(state: VehicleState, action: VehicleAction): VehicleState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    default:
      throw Error('Unknown action.')
  }
}

export default function usePropertyVehicleEvent(
  userId: string,
  scenario: string,
  intialEvent?: EventEntries,
) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(getVehicleFromEvent(intialEvent)),
  )
  const vehicleEntryInput: VehicleEntryInput = {
    userId,
    scenario,
    name: state.name,
    startYear: Number(state.startYear),
    endYear: Number(state.endYear),
    existing: state.currentHome,
    vehicleValue: Number(state.vehicleValue),
    annualDepreciationRate: roundToDec(Number(state.depreciationRate) / 100, 4),
    annualExpenses: Number(state.annualExpenses),
    annualExpensesRate: roundToDec(Number(state.annualExpensesRate) / 100, 4),
    loanAmount: state.currentHome
      ? Number(state.loanAmount)
      : Number(state.vehicleValue) - Number(state.downPayment),
    loanYears: Number(state.loanYears),
    loanRate: Number(state.loanRate),
  }
  return [state, dispatch, vehicleEntryInput] as const
}
