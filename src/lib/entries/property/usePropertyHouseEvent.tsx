import { useReducer } from 'react'
import { getHouseFromEvent, HouseEntryInput } from './house'
import { EventEntries } from '@/services/entries.client'
import { roundToDec } from '@/lib/number'

const DEFAULT_APPRECIATION_RATE = 0.03

type HouseState = {
  // UI
  includeMortgage: boolean
  // General
  name: string
  startYear: string
  endYear: string
  currentHome: boolean
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
  startYear: String(house?.startYear ?? ''),
  endYear: String(house?.endYear ?? ''),
  currentHome: house?.existing ?? false,
  // Property
  houseValue: String(house?.houseValue ?? ''),
  appreciationRate: house?.annualAppreciationRate
    ? String((house.annualAppreciationRate ?? 0) * 100)
    : String(DEFAULT_APPRECIATION_RATE * 100),
  annualExpenses: String(house?.annualExpenses ?? ''),
  annualExpensesRate: String(house?.annualExpensesRate ?? ''),
  // Mortgage
  downPayment: String(
    house?.existing ? '' : (house?.houseValue ?? 0) - (house?.mortgageAmount ?? 0) || '',
  ),
  mortgageAmount: String(house?.mortgageAmount ?? ''),
  mortgageYears: String(house?.mortgageYears ?? ''),
  mortgageRate: String(house?.mortgageRate ?? ''),
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
  const houseEntryInput: HouseEntryInput = {
    userId,
    scenario,
    name: state.name,
    startYear: Number(state.startYear),
    endYear: Number(state.endYear),
    existing: state.currentHome,
    houseValue: Number(state.houseValue),
    annualAppreciationRate: roundToDec(Number(state.appreciationRate) / 100, 4),
    annualExpenses: Number(state.annualExpenses),
    annualExpensesRate: roundToDec(Number(state.annualExpensesRate) / 100, 4),
    mortgageAmount: state.currentHome
      ? Number(state.mortgageAmount)
      : Number(state.houseValue) - Number(state.downPayment),
    mortgageYears: Number(state.mortgageYears),
    mortgageRate: Number(state.mortgageRate),
  }
  return [state, dispatch, houseEntryInput] as const
}
