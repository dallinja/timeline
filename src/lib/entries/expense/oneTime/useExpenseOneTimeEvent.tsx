import { useReducer } from 'react'
import { getOneTimeFromEvent, OneTimeEventInput } from './oneTime'
import { EventEntries } from '@/services/entries.client'

const DEFAULT_APPRECIATION_RATE = 0.03

type OneTimeState = {
  // General
  name: string
  year: string
  // Expense
  amount: string
  taxable: boolean
}

type OneTimeAction = {
  type: 'UPDATE_FIELD'
  field: keyof OneTimeState
  value: string | boolean
}

// Define the initial state
const initialState = (oneTime?: OneTimeEventInput): OneTimeState => ({
  // General
  name: oneTime?.name ?? '',
  year: String(oneTime?.year ?? ''),
  // OneTime
  amount: String(oneTime?.amount ?? ''),
  taxable: oneTime?.taxable ?? false,
})

// Define the reducer function
function reducer(state: OneTimeState, action: OneTimeAction): OneTimeState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    default:
      throw Error('Unknown action.')
  }
}

export default function useIncomeOneTimeEvent(
  userId: string,
  scenario: string,
  intialEvent?: EventEntries,
) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(getOneTimeFromEvent(intialEvent)),
  )
  const houseEntryInput: OneTimeEventInput = {
    userId,
    scenario,
    name: state.name,
    year: Number(state.year),
    amount: Number(state.amount),
    taxable: state.taxable,
  }
  return [state, dispatch, houseEntryInput] as const
}
