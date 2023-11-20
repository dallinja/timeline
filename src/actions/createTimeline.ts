import { FV } from '@/lib/financial'
import { CreateEntryInput, EntryType, SubType } from '@/lib/types'

export function createTimeline(formData: FormData) {
  const currentYear = new Date().getFullYear()

  const entries: CreateEntryInput[] = [
    buildIncomeEntry({
      type: 'income',
      subType: 'one-time',
      name: 'Initial cash',
      startYear: currentYear,
      endYear: currentYear,
      cashStart: num(formData.get('initialCash')),
    }),
    buildIncomeEntry({
      type: 'income',
      subType: 'job',
      name: 'Annual income',
      startYear: currentYear,
      endYear: currentYear + (63 - num(formData.get('age'))),
      cashRecurring: num(formData.get('income')) * 0.8,
      cashRecurringRate: 0.03,
    }),
    buildIncomeEntry({
      type: 'expense',
      name: 'Annual expenses',
      startYear: currentYear,
      endYear: currentYear + (100 - num(formData.get('age'))),
      cashRecurring: -num(formData.get('expenses')),
      cashRecurringRate: 0.02,
    }),
    // ...(home === 'mortgage'
    ...(true
      ? [
          buildPropertyEntry({
            type: 'property',
            name: 'Home',
            startYear: currentYear,
            endYear: currentYear + (100 - num(formData.get('age'))),
            propertyStart: num(formData.get('homeValue')),
            propertyRate: 0.025,
          }),
        ]
      : []),
    // ...(home === 'mortgage' && haveMortgage === 'yes'
    ...(true
      ? [
          buildLoanEntry({
            type: 'loan',
            name: 'Mortgage',
            parentId: 3,
            startYear: currentYear,
            endYear: currentYear + num(formData.get('mortgageYears')),
            propertyValue: num(formData.get('homeValue')),
            loanStart: num(formData.get('mortgageAmount')),
            loanRate: num(formData.get('mortgageRate')),
            loanPeriods: num(formData.get('mortgageYears')),
          }),
        ]
      : []),
    buildInvestmentEntry({
      type: 'investment',
      name: 'Trad Existing Investment',
      startYear: currentYear,
      endYear: currentYear + (63 - num(formData.get('age'))),
      cashStart: num(formData.get('tradInvestments')),
      investmentStart: num(formData.get('tradInvestments')),
      investmentRate: 0.08,
      investmentRecurring: num(formData.get('income')) * 0.1,
      investmentRecurringRate: 0.03,
    }),
    buildInvestmentEntry({
      parentId: 5,
      type: 'investment',
      name: 'Trad Investment Annuity',
      startYear: currentYear + (63 - num(formData.get('age'))),
      endYear: currentYear + (100 - num(formData.get('age'))),
      investmentStart:
        FVGrowingAnnuity(
          num(formData.get('income')) * 0.1,
          0.08,
          0.03,
          63 - num(formData.get('age')),
        ) +
        (FV(
          0.08,
          63 - num(formData.get('age')),
          0,
          -num(formData.get('tradInvestments')),
        ) as number),
      investmentRate: 0.04,
      investmentRecurring: -FV(
        0.02,
        63 - num(formData.get('age')),
        0,
        -num(formData.get('expenses')),
      ) as number,
      investmentRecurringRate: 0.02,
    }),
    // buildPropertyEntry({
    //   type: 'property',
    //   name: 'Home',
    //   startYear: 2040,
    //   endYear: currentYear + (100 - num(formData.get('age'))),
    //   propertyStart: 1000000,
    //   propertyRate: 0.025,
    // }),
  ]
  console.log('entries', entries)
  return entries
}

function num(formValue: FormDataEntryValue | null) {
  return Number(formValue || 0)
}

function FVGrowingAnnuity(firstPMT: number, rate: number, growthRate: number, periods: number) {
  const firstYear = firstPMT * (1 + rate)
  const growingAnnuity =
    (Math.pow(1 + rate, periods) - Math.pow(1 + growthRate, periods)) / (rate - growthRate)
  return firstYear * growingAnnuity
}

const entryBase: CreateEntryInput = {
  name: '',
  parent_id: null,
  type: 'income',
  sub_type: 'job',
  user_id: '1',
  scenario: 'default',

  start_year: 0,
  end_year: 0,

  cash_start: 0,
  cash_rate: 0,
  cash_recurring: 0,
  cash_recurring_rate: 0,

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

type BuildBase = {
  type: EntryType
  subType?: SubType
  startYear: number
  endYear: number
  name?: string
}

function buildIncomeEntry({
  type,
  subType,
  startYear,
  endYear,
  name = '',
  cashStart = 0,
  cashStartRate = 0,
  cashRecurring = 0,
  cashRecurringRate = 0,
}: BuildBase & {
  cashStart?: number
  cashStartRate?: number
  cashRecurring?: number
  cashRecurringRate?: number
}): CreateEntryInput {
  return {
    ...entryBase,
    type,
    sub_type: subType,
    start_year: startYear,
    end_year: endYear,
    name,
    cash_start: cashStart,
    cash_rate: cashStartRate,
    cash_recurring: cashRecurring,
    cash_recurring_rate: cashRecurringRate,
  }
}
function buildPropertyEntry({
  type,
  startYear,
  endYear,
  name = '',
  propertyStart = 0,
  propertyRate = 0,
}: BuildBase & {
  propertyStart?: number
  propertyRate?: number
}): CreateEntryInput {
  return {
    ...entryBase,
    type,
    start_year: startYear,
    end_year: endYear,
    name,
    property_start: propertyStart,
    property_rate: propertyRate,
    cash_recurring: -propertyStart * 0.01,
    cash_recurring_rate: 0.02,
  }
}
function buildLoanEntry({
  parentId,
  type,
  startYear,
  endYear,
  name = '',
  propertyValue = 0,
  loanStart = 0,
  loanRate = 0,
  loanPeriods = 0,
}: BuildBase & {
  parentId: number
  propertyValue?: number
  loanStart?: number
  loanRate?: number
  loanPeriods?: number
}): CreateEntryInput {
  return {
    ...entryBase,
    parent_id: parentId,
    type,
    start_year: startYear,
    end_year: endYear,
    name,
    cash_start: propertyValue - loanStart,
    loans_start: loanStart,
    loans_rate: loanRate,
    loans_periods: loanPeriods,
  }
}
function buildInvestmentEntry({
  type,
  startYear,
  endYear,
  name = '',
  cashStart = 0,
  investmentStart = 0,
  investmentRate = 0,
  investmentRecurring = 0,
  investmentRecurringRate = 0,
}: BuildBase & {
  parentId?: number
  cashStart?: number
  investmentStart?: number
  investmentRate?: number
  investmentRecurring?: number
  investmentRecurringRate?: number
}): CreateEntryInput {
  return {
    ...entryBase,
    type,
    start_year: startYear,
    end_year: endYear,
    name,
    cash_start: cashStart,
    investments_start: investmentStart,
    investments_rate: investmentRate,
    investments_recurring: investmentRecurring,
    investments_recurring_rate: investmentRecurringRate,
  }
}
