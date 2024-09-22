import { useReducer } from 'react'
import { getInvestmentFromEvent, InvestmentEventInput } from './investment'
import { EventEntries } from '@/services/entries.client'
import { roundToDec } from '@/lib/number'

const DEFAULT_RETURN_RATE = 0.1
const currentYear = new Date().getFullYear()

type InvestmentState = {
  // General
  name: string
  startYear: string
  endYear: string
  // Investment
  annualAmount: string
  annualReturnRate: string
  taxable: boolean
}

type InvestmentAction = {
  type: 'UPDATE_FIELD'
  field: keyof InvestmentState
  value: string | boolean
}

// Define the initial state
const initialState = (investment?: InvestmentEventInput): InvestmentState => ({
  // General
  name: investment?.name ?? '',
  startYear: String(investment?.startYear ?? ''),
  endYear: String(investment?.endYear ?? ''),
  // Investment
  annualAmount: String(investment?.annualAmount ?? ''),
  annualReturnRate: investment?.annualReturnRate
    ? String((investment.annualReturnRate ?? 0) * 100)
    : String(DEFAULT_RETURN_RATE * 100),
  taxable: investment?.taxable ?? false,
})

// Define the reducer function
function reducer(state: InvestmentState, action: InvestmentAction): InvestmentState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    default:
      throw Error('Unknown action.')
  }
}

export default function useIncomeInvestmentEvent(
  userId: string,
  scenario: string,
  intialEvent?: EventEntries,
) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(getInvestmentFromEvent(intialEvent)),
  )
  const houseEntryInput: InvestmentEventInput = {
    userId,
    scenario,
    name: state.name,
    startYear: state.startYear === 'existing' ? currentYear : Number(state.startYear),
    endYear: Number(state.endYear),
    existing: state.startYear === 'existing',
    annualAmount: Number(state.annualAmount),
    annualReturnRate: roundToDec(Number(state.annualReturnRate) / 100, 4),
    taxable: state.taxable,
  }
  return [state, dispatch, houseEntryInput] as const
}
