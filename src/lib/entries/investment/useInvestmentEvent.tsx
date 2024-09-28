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
  startAmount: string
  annualAmount: string
  annualGrowthRate: string
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
  startYear: investment?.existing ? 'existing' : String(investment?.startYear ?? ''),
  endYear: String(investment?.endYear ?? ''),
  // Investment
  startAmount: String(investment?.startAmount ?? ''),
  annualAmount: String(investment?.annualAmount ?? ''),
  annualGrowthRate: investment?.annualGrowthRate
    ? String(roundToDec((investment.annualGrowthRate ?? 0) * 100, 2))
    : String(DEFAULT_RETURN_RATE * 100),
  annualReturnRate: investment?.annualReturnRate
    ? String(roundToDec((investment.annualReturnRate ?? 0) * 100, 2))
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
  const existing = state.startYear === 'existing'
  const houseEntryInput: InvestmentEventInput = {
    userId,
    scenario,
    name: state.name,
    startYear: existing ? currentYear : Number(state.startYear),
    endYear: Number(state.endYear),
    existing: existing,
    startAmount: Number(state.startAmount),
    annualAmount: Number(state.annualAmount),
    annualGrowthRate: roundToDec(Number(state.annualGrowthRate) / 100, 4),
    annualReturnRate: roundToDec(Number(state.annualReturnRate) / 100, 4),
    taxable: state.taxable,
  }
  return [state, dispatch, houseEntryInput] as const
}
