import { useReducer } from 'react'
import { getHouseFromEvent, HouseEntryInput } from './house'
import { EventEntries } from '@/services/entries.client'
import { roundToDec } from '@/lib/number'

const DEFAULT_APPRECIATION_RATE = 0.03
const currentYear = new Date().getFullYear()

type HouseState = {
  // UI
  includeMortgage: boolean
  // General
  name: string
  startYear: string
  endYear: string
  // Property
  houseValue: string
  appreciationRate: string
  annualExpenses: string
  annualExpensesRate: string
  // Mortgage
  downPayment: string
  mortgageAmount: string
  mortgageYears: string
  mortgageRate: string
}

type HouseAction = {
  type: 'UPDATE_FIELD'
  field: keyof HouseState
  value: string | boolean
}

function getIncludeMortgage(entry?: HouseEntryInput) {
  return !!entry?.mortgageAmount
}

// Define the initial state
const initialState = (house?: HouseEntryInput): HouseState => ({
  // UI
  includeMortgage: getIncludeMortgage(house),
  // General
  name: house?.name ?? '',
  startYear: house?.existing ? 'existing' : String(house?.startYear ?? ''),
  endYear: String(house?.endYear ?? ''),
  // Property
  houseValue: String(house?.houseValue ?? ''),
  appreciationRate: house?.annualAppreciationRate
    ? String(roundToDec((house.annualAppreciationRate ?? 0) * 100, 2))
    : String(DEFAULT_APPRECIATION_RATE * 100),
  annualExpenses: String(house?.annualExpenses ?? ''),
  annualExpensesRate: String(roundToDec((house?.annualExpensesRate ?? 0) * 100, 2)),
  // Mortgage
  downPayment: String(
    house?.existing ? '' : (house?.houseValue ?? 0) - (house?.mortgageAmount ?? 0) || '',
  ),
  mortgageAmount: String(house?.mortgageAmount ?? ''),
  mortgageYears: String(house?.mortgageYears ?? ''),
  mortgageRate: String(roundToDec((house?.mortgageRate ?? 0) * 100, 2)),
})

// Define the reducer function
function reducer(state: HouseState, action: HouseAction): HouseState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    default:
      throw Error('Unknown action.')
  }
}

export default function usePropertyHouseEvent(
  userId: string,
  scenario: string,
  intialEvent?: EventEntries,
) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(getHouseFromEvent(intialEvent)),
  )
  const existing = state.startYear === 'existing'
  const houseEntryInput: HouseEntryInput = {
    userId,
    scenario,
    name: state.name,
    startYear: existing ? currentYear : Number(state.startYear),
    endYear: Number(state.endYear),
    existing: existing,
    houseValue: Number(state.houseValue),
    annualAppreciationRate: roundToDec(Number(state.appreciationRate) / 100, 4),
    annualExpenses: Number(state.annualExpenses),
    annualExpensesRate: roundToDec(Number(state.annualExpensesRate) / 100, 4),
    mortgageAmount: existing
      ? Number(state.mortgageAmount)
      : Number(state.houseValue) - Number(state.downPayment),
    mortgageYears: Number(state.mortgageYears),
    mortgageRate: roundToDec(Number(state.mortgageRate) / 100, 4),
  }
  return [state, dispatch, houseEntryInput] as const
}
