import { useReducer } from 'react'
import { getJobFromEvent, JobEventInput } from './job'
import { EventEntries } from '@/services/entries.client'
import { roundToDec } from '@/lib/number'

const DEFAULT_APPRECIATION_RATE = 0.03

type JobState = {
  // General
  name: string
  startYear: string
  endYear: string
  // Income
  annualSalary: string
  annualRaiseRate: string
  taxable: boolean
  startingBonus: string
  // Related investment
  hasAnnualInvestment: boolean
  annualInvestmentRate: string
  // Related donation
  hasAnnualDonation: boolean
  annualDonationRate: string
}

type JobAction = {
  type: 'UPDATE_FIELD'
  field: keyof JobState
  value: string | boolean
}

// Define the initial state
const initialState = (job?: JobEventInput): JobState => ({
  // General
  name: job?.name ?? '',
  startYear: String(job?.startYear ?? ''),
  endYear: String(job?.endYear ?? ''),
  // Job
  annualSalary: String(job?.annualSalary ?? ''),
  annualRaiseRate: job?.annualRaiseRate
    ? String((job.annualRaiseRate ?? 0) * 100)
    : String(DEFAULT_APPRECIATION_RATE * 100),
  taxable: job?.taxable ?? false,
  startingBonus: String(job?.startingBonus ?? ''),
  // Other
  hasAnnualInvestment: !!job?.annualInvestmentRate,
  annualInvestmentRate: job?.annualInvestmentRate
    ? String((job.annualInvestmentRate ?? 0) * 100)
    : '',
  hasAnnualDonation: !!job?.annualDonationRate,
  annualDonationRate: job?.annualDonationRate ? String((job.annualDonationRate ?? 0) * 100) : '',
})

// Define the reducer function
function reducer(state: JobState, action: JobAction): JobState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    default:
      throw Error('Unknown action.')
  }
}

export default function useIncomeJobEvent(
  userId: string,
  scenario: string,
  intialEvent?: EventEntries,
) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialState(getJobFromEvent(intialEvent)),
  )
  const houseEntryInput: JobEventInput = {
    userId,
    scenario,
    name: state.name,
    startYear: Number(state.startYear),
    endYear: Number(state.endYear),
    annualSalary: Number(state.annualSalary),
    annualRaiseRate: roundToDec(Number(state.annualRaiseRate) / 100, 4),
    startingBonus: Number(state.startingBonus),
    taxable: state.taxable,
    annualInvestmentRate: state.hasAnnualInvestment
      ? roundToDec(Number(state.annualInvestmentRate) / 100, 4)
      : 0,
    annualDonationRate: state.hasAnnualDonation
      ? roundToDec(Number(state.annualDonationRate) / 100, 4)
      : 0,
  }
  return [state, dispatch, houseEntryInput] as const
}
