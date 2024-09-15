import { Entry, EntryType } from '@/services/entries'
import { emptyYearData, YearData } from './types'
import getYearDataCash from './getYearDataCash'
import getYearDataProperty from './getYearDataProperty'
import getYearDataInvestments from './getYearDataInvestments'
import getYearDataLoans from './getYearDataLoans'

const currentYear = new Date().getFullYear()

export default function getYearsData(entries: Entry[], maxYearProp: number): YearData[] {
  const { minYear, maxYear } = getMinMaxYear(entries, maxYearProp)

  const yearsDataPerYear = getYearsDataPerYear(entries, maxYear)

  return cumulativeYearBSData(yearsDataPerYear, minYear, maxYear)
}

function cumulativeYearBSData(
  yearDataPerYear: Record<number, YearData>,
  minYear: number,
  maxYear: number,
): YearData[] {
  const years = [...Array(maxYear - minYear + 1)]
  return years.reduce<YearData[]>((acc, _, index) => {
    const year = minYear + index
    const previous: YearData = index < 1 ? emptyYearData() : (acc[index - 1] ?? emptyYearData())
    const current = {
      year,
      operating: {
        income: yearDataPerYear[year]?.operating.income ?? 0,
        expenses: yearDataPerYear[year]?.operating.expenses ?? 0,
        total: 0,
      },
      investing: {
        property: yearDataPerYear[year]?.investing.property ?? 0,
        investments: yearDataPerYear[year]?.investing.investments ?? 0,
        total: 0,
      },
      financing: {
        loans: yearDataPerYear[year]?.financing.loans ?? 0,
        total: 0,
      },
      assets: {
        cash: previous.assets.cash + (yearDataPerYear[year]?.assets.cash ?? 0),
        property: previous.assets.property + (yearDataPerYear[year]?.assets.property ?? 0),
        investments: previous.assets.investments + (yearDataPerYear[year]?.assets.investments ?? 0),
        total: 0,
      },
      liabilities: {
        loans: previous.liabilities.loans + (yearDataPerYear[year]?.liabilities.loans ?? 0),
        total: 0,
      },
      netWorth: previous.netWorth + (yearDataPerYear[year]?.netWorth ?? 0),
    }
    acc.push({
      ...current,
      operating: {
        ...current.operating,
        total: current.operating.income - current.operating.expenses,
      },
      investing: {
        ...current.investing,
        total: current.investing.property + current.investing.investments,
      },
      financing: {
        ...current.financing,
        total: current.financing.loans,
      },
      assets: {
        ...current.assets,
        total: current.assets.cash + current.assets.property + current.assets.investments,
      },
      liabilities: {
        ...current.liabilities,
        total: current.liabilities.loans,
      },
    })
    return acc
  }, [])
}

function getYearsDataPerYear(entries: Entry[], maxYear: number): Record<number, YearData> {
  const yearTotalsPerYear: Record<number, YearData> = {}
  entries.forEach((entry) => {
    const entryStartYear = entry.start_year
    const entryEndYear = entry.end_year
    if (!entryStartYear) return

    const entryYears = (entryEndYear ?? maxYear) - entryStartYear + 1

    ;[...Array(entryYears)].forEach((_, index, arr) => {
      const lastIndex = arr.length - 1
      let yearTotals: YearData = emptyYearData()

      if (['income', 'expense'].includes(entry.type as EntryType)) {
        yearTotals = getYearDataCash(entry, index, lastIndex)
      } else if (entry.type === 'property') {
        yearTotals = getYearDataProperty(entry, index, lastIndex)
      } else if (entry.type === 'investment') {
        yearTotals = getYearDataInvestments(entry, index, lastIndex)
      } else if (entry.type === 'loan') {
        yearTotals = getYearDataLoans(entry, index, lastIndex)
      }

      const entryYear = entryStartYear + index
      yearTotalsPerYear[entryYear] = yearTotals
    })
  })
  return yearTotalsPerYear
}

function getMinMaxYear(entries: Entry[], maxYearProp: number) {
  return entries.reduce<{ minYear: number; maxYear: number }>(
    (acc, entry) => {
      if ((entry.start_year || currentYear) < acc.minYear) {
        acc.minYear = entry.start_year || currentYear
      }
      if ((entry.end_year || currentYear) > acc.maxYear) {
        acc.maxYear = entry.end_year || currentYear
      }
      return acc
    },
    { minYear: 9999, maxYear: maxYearProp },
  )
}
