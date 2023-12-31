import { CUMPRINC, PMT } from '@/lib/financial'
import { Entry } from '@/lib/types'

const currentYear = new Date().getFullYear()

type YearTotals = {
  cash: number
  property: number
  investments: number
  loans: number
}

type YearData = YearTotals & { year: number }

export function getTimeline(entries: Entry[]) {
  const { minYear, maxYear } = entries.reduce<{ minYear: number; maxYear: number }>(
    (acc, entry) => {
      if ((entry.start_year || currentYear) < acc.minYear) {
        acc.minYear = entry.start_year || currentYear
      }
      if ((entry.end_year || currentYear) > acc.maxYear) {
        acc.maxYear = entry.end_year || currentYear
      }
      return acc
    },
    { minYear: 9999, maxYear: 0 },
  )
  const years = [...Array(maxYear - minYear + 1)]
  const totals: Record<number, YearTotals[]> = {}

  entries.forEach((entry) => {
    const startYear = entry.start_year
    const endYear = entry.end_year
    if (!startYear || !endYear) return
    const years = endYear - startYear + 1

    ;[...Array(years)].forEach((_, ind, arr) => {
      const year = startYear + ind
      const lastIndex = arr.length - 1

      let yearTotals = { cash: 0, property: 0, investments: 0, loans: 0 }
      yearTotals = getCashTotals(yearTotals, entry, ind, lastIndex)
      yearTotals = getPropertyTotals(yearTotals, entry, ind, lastIndex)
      yearTotals = getInvestmentTotals(yearTotals, entry, ind, lastIndex)
      yearTotals = getLoanTotals(yearTotals, entry, ind, lastIndex)
      ;(totals[year] = totals[year] || []).push(yearTotals)
    })
  })

  return years.reduce<YearData[]>((acc, _, index) => {
    const year = minYear + index
    const previous: Record<string, number> = index < 1 ? {} : acc[index - 1]
    const current = {
      year,
      cash: (previous.cash || 0) + sumBy(totals[year], 'cash'),
      property: (previous.property || 0) + sumBy(totals[year], 'property'),
      investments: (previous.investments || 0) + sumBy(totals[year], 'investments'),
      loans: (previous.loans || 0) + sumBy(totals[year], 'loans'),
    }
    acc.push(current)
    return acc
  }, [])
}

function getCashTotals(
  yearTotals: YearTotals,
  entry: Entry,
  index: number,
  lastIndex: number,
): YearTotals {
  const { cash_start, cash_rate, cash_recurring, cash_recurring_rate } = entry
  let totals = { ...yearTotals }

  // Every year
  const amountRecurring =
    cash_recurring && cash_recurring_rate ? getFV(cash_recurring, cash_recurring_rate, index) : 0
  totals.cash += amountRecurring

  // First year
  if (index === 0) {
    totals.cash += cash_start || 0
  }

  return totals
}

function getPropertyTotals(
  yearTotals: YearTotals,
  entry: Entry,
  index: number,
  lastIndex: number,
): YearTotals {
  const { property_start, property_rate } = entry
  let totals = { ...yearTotals }
  if (!property_start || !property_rate) return totals

  // Every year
  const endOfYearValue = getFV(property_start, property_rate, index + 1)
  const startOfYearValue = getFV(property_start, property_rate, index)
  totals.property += endOfYearValue - startOfYearValue

  // First year
  if (index === 0) {
    totals.cash -= property_start || 0
    totals.property += property_start || 0
  }

  // Last year
  if (index === lastIndex) {
    totals.cash += endOfYearValue
    totals.property -= endOfYearValue
  }

  return totals
}

function getInvestmentTotals(
  yearTotals: YearTotals,
  entry: Entry,
  index: number,
  lastIndex: number,
): YearTotals {
  const { investments_start, investments_rate, investments_recurring, investments_recurring_rate } =
    entry
  let totals = { ...yearTotals }
  if (!investments_start || !investments_rate) return totals

  const period = index + 1

  // Every year
  const endOfYearValue = getFV(investments_start, investments_rate, period)
  const startOfYearValue = getFV(investments_start, investments_rate, period - 1)
  totals.investments += endOfYearValue - startOfYearValue

  // growing annuity
  if (investments_rate && investments_recurring) {
    const yearGrowingAnnuity =
      FVGrowingAnnuity(
        investments_recurring,
        investments_rate,
        Number(investments_recurring_rate),
        period,
      ) -
      FVGrowingAnnuity(
        investments_recurring,
        investments_rate,
        Number(investments_recurring_rate),
        period - 1,
      )
    totals.investments += yearGrowingAnnuity
    totals.cash -= getFV(investments_recurring, Number(investments_recurring_rate), period - 1)
  }

  // First year
  if (index === 0) {
    totals.cash -= investments_start || 0
    totals.investments += investments_start || 0
  }

  // Last year
  if (index === lastIndex) {
    const growingAnnuity =
      investments_rate && investments_recurring && investments_recurring_rate
        ? FVGrowingAnnuity(
            investments_recurring,
            investments_rate,
            investments_recurring_rate,
            period,
          )
        : 0
    totals.cash += endOfYearValue + growingAnnuity
    totals.investments -= endOfYearValue + growingAnnuity
  }

  return totals
}

function getLoanTotals(
  yearTotals: YearTotals,
  entry: Entry,
  index: number,
  lastIndex: number,
): YearTotals {
  const { loans_start, loans_rate, loans_periods } = entry
  let totals = { ...yearTotals }
  if (!loans_start || !loans_rate || !loans_periods) return totals

  // Every year
  const period = index + 1
  const pmt = PMT(loans_rate, loans_periods, loans_start)
  const principal = CUMPRINC(loans_rate, loans_periods, loans_start, period, period)
  totals.cash += +pmt
  totals.loans += -principal

  // First year
  if (index === 0) {
    totals.cash += loans_start
    totals.loans -= loans_start
  }

  // Last year
  if (index === lastIndex) {
    const principalBalance =
      loans_start + +CUMPRINC(loans_rate, loans_periods, loans_start, 1, period)
    totals.cash -= principalBalance
    totals.loans += principalBalance
  }

  return totals
}

function sumBy(arr: YearTotals[], key: keyof YearTotals) {
  return arr?.reduce((acc, val) => ((acc += val[key] || 0), acc), 0) || 0
}

function getFV(PV: number, rate: number, index: number) {
  const period = index
  return PV * Math.pow(1 + rate, period)
}

function FVGrowingAnnuity(firstPMT: number, rate: number, growthRate: number, periods: number) {
  const firstYear = firstPMT * (1 + rate)
  const growingAnnuity =
    (Math.pow(1 + rate, periods) - Math.pow(1 + growthRate, periods)) / (rate - growthRate)
  return firstYear * growingAnnuity
}
