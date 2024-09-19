import { CUMPRINC, PMT } from '@/lib/financial'
import { Entry } from '@/services/entries.server'

const currentYear = new Date().getFullYear()

type YearTotals = {
  income: number
  socialSecurity: number
  savings: number
  expenses: number
}

type YearData = YearTotals & { year: number; netIncome: number }

export function getIncomeTimeline(entries: Entry[]) {
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
  if (!minYear || !maxYear) return []
  const years = [...Array(maxYear - minYear + 1)]
  const totals: Record<number, YearTotals[]> = {}

  // For each year, calculate the totals for each income type
  entries.forEach((entry) => {
    const entryStartYear = entry.start_year
    const entryEndYear = entry.end_year
    if (!entryStartYear || !entryEndYear) return
    const entryYears = entryEndYear - entryStartYear + 1

    ;[...Array(entryYears)].forEach((_, index, arr) => {
      const entryYear = entryStartYear + index
      const lastIndex = arr.length - 1

      let yearTotals = { income: 0, socialSecurity: 0, savings: 0, expenses: 0 }
      yearTotals = getIncomeTotals(yearTotals, entry, index, lastIndex)
      // yearTotals = getSocialSecurityTotals(yearTotals, entry, index, lastIndex)
      // yearTotals = getInvestmentTotals(yearTotals, entry, index, lastIndex)
      // yearTotals = getLoanTotals(yearTotals, entry, index, lastIndex)
      ;(totals[entryYear] = totals[entryYear] || []).push(yearTotals)
    })
  })

  return years.reduce<YearData[]>((acc, _, index) => {
    const year = minYear + index
    const previous: Record<string, number> = index < 1 ? {} : (acc[index - 1] ?? {})
    const current = {
      year,
      income: Math.round((previous.income || 0) + sumBy(totals[year], 'income')),
      socialSecurity: Math.round(
        (previous.socialSecurity || 0) + sumBy(totals[year], 'socialSecurity'),
      ),
      savings: Math.round((previous.savings || 0) + sumBy(totals[year], 'savings')),
      expenses: Math.round((previous.expenses || 0) + sumBy(totals[year], 'expenses')),
    }
    acc.push({
      ...current,
      netIncome: Math.round(
        current.income + current.socialSecurity + current.savings + current.expenses,
      ),
    })
    return acc
  }, [])
}

function getIncomeTotals(
  yearTotals: YearTotals,
  entry: Entry,
  index: number,
  lastIndex: number,
): YearTotals {
  const { cash_start, cash_rate, cash_recurring, cash_recurring_rate, cash_end } = entry
  let totals = { ...yearTotals }

  // Every year
  const amountRecurring =
    cash_recurring && cash_recurring_rate ? getFV(cash_recurring, cash_recurring_rate, index) : 0
  totals.income += amountRecurring

  // First year
  if (index === 0) {
    totals.income += cash_start || 0
  }

  // Last year
  if (index === lastIndex) {
    totals.income += cash_end || 0
  }

  return totals
}

function sumBy(arr: YearTotals[] | undefined, key: keyof YearTotals) {
  return arr?.reduce((acc, val) => ((acc += val[key] || 0), acc), 0) ?? 0
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
