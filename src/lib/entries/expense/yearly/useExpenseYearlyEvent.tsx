import { useReducer } from 'react'
import { getYearlyFromEvent, YearlyEventInput } from './yearly'
import { EventEntries } from '@/services/entries.client'
import { roundToDec } from '@/lib/number'

const DEFAULT_APPRECIATION_RATE = 0.03

type YearlyState = {
  // General
  name: string
  startYear: string
  endYear: string
  // Income
  annualAmount: string
  annualIncreaseRate: string
  taxable: boolean
}

type YearlyAction = {
  type: 'UPDATE_FIELD'
  field: keyof YearlyState
  value: string | boolean
}

// Define the initial state
const initialState = (yearly?: YearlyEventInput): YearlyState => ({
  // General
  name: yearly?.name ?? '',
  startYear: String(yearly?.startYear ?? ''),
  endYear: String(yearly?.endYear ?? ''),
  // Yearly
  annualAmount: String(yearly?.annualAmount ?? ''),
  annualIncreaseRate: yearly?.annualIncreaseRate
    ? String((yearly.annualIncreaseRate ?? 0) * 100)
    : String(DEFAULT_APPRECIATION_RATE * 100),
  taxable: yearly?.taxable ?? false,
})

// Define the reducer function
function reducer(state: YearlyState, action: YearlyAction): YearlyState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    default:
      throw Error('Unknown action.')
  }
}

export default function useIncomeYearlyEvent(
  userId: string,
  scenario: string,
  intialEvent?: EventEntries,
) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(getYearlyFromEvent(intialEvent)),
  )
  const houseEntryInput: YearlyEventInput = {
    userId,
    scenario,
    name: state.name,
    startYear: Number(state.startYear),
    endYear: Number(state.endYear),
    annualAmount: Number(state.annualAmount),
    annualIncreaseRate: roundToDec(Number(state.annualIncreaseRate) / 100, 4),
    taxable: state.taxable,
  }
  return [state, dispatch, houseEntryInput] as const
}
