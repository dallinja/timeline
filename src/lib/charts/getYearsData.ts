import { Entry } from '@/services/entries.server'
import { emptyYearData, YearData } from './types'
import getYearDataProperty from './getYearDataProperty'
import getYearDataInvestments from './getYearDataInvestments'
import getYearDataLoans from './getYearDataLoans'
import { roundDataToDecimals } from '../number'
import getYearDataIncome from './getYearDataIncome'
import getYearDataExpenses from './getYearDataExpenses'
import { FilingStatus, getTaxesForYear } from './getTaxes'

const currentYear = new Date().getFullYear()

export default function getYearsData(
  entries: Entry[],
  maxYearProp: number,
  filingStatus: FilingStatus = FilingStatus.MarriedFilingJointly,
): YearData[] {
  const { minYear, maxYear } = getMinMaxYear(entries, maxYearProp)

  const yearsDataPerYear = getYearsDataPerYear(entries, maxYear)

  return cumulativeYearBSData(yearsDataPerYear, minYear, maxYear, filingStatus)
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
    { minYear: currentYear, maxYear: maxYearProp },
  )
}

function getYearsDataPerYear(entries: Entry[], maxYear: number): Record<number, YearData> {
  const yearsDataPerYear: Record<number, YearData> = {}
  entries.forEach((entry) => {
    const entryStartYear = entry.start_year
    const entryEndYear = entry.end_year
    if (!entryStartYear) return

    const entryYears = (entryEndYear ?? maxYear) - entryStartYear + 1

    for (let index = 0; index < entryYears; index++) {
      const lastIndex = entryYears - 1
      let yearData: YearData = emptyYearData()

      if (entry.type === 'income') {
        yearData = getYearDataIncome(entry, index, lastIndex)
      } else if (entry.type === 'expense') {
        yearData = getYearDataExpenses(entry, index, lastIndex)
      } else if (entry.type === 'property') {
        yearData = getYearDataProperty(entry, index, lastIndex)
      } else if (entry.type === 'investment') {
        yearData = getYearDataInvestments(entry, index, lastIndex)
      } else if (entry.type === 'loan') {
        yearData = getYearDataLoans(entry, index, lastIndex)
      }

      const entryYear = entryStartYear + index
      yearsDataPerYear[entryYear] = combineData(yearData, yearsDataPerYear[entryYear])
    }
  })
  return yearsDataPerYear
}

function cumulativeYearBSData(
  yearDataPerYear: Record<number, YearData>,
  minYear: number,
  maxYear: number,
  filingStatus: FilingStatus,
): YearData[] {
  const years = [...Array(maxYear - minYear + 1)]
  return years.reduce<YearData[]>((acc, _, index) => {
    const year = minYear + index
    const previous: YearData = index < 1 ? emptyYearData() : (acc[index - 1] ?? emptyYearData())
    const income = roundDataToDecimals(yearDataPerYear[year]?.operating.income ?? 0)
    const taxes = getTaxesForYear(income, year, filingStatus)
    const current = {
      year,
      operating: {
        income,
        expenses: roundDataToDecimals((yearDataPerYear[year]?.operating.expenses ?? 0) + -taxes),
        total: 0,
      },
      investing: {
        property: roundDataToDecimals(yearDataPerYear[year]?.investing.property ?? 0),
        investments: roundDataToDecimals(yearDataPerYear[year]?.investing.investments ?? 0),
        total: 0,
      },
      financing: {
        loans: roundDataToDecimals(yearDataPerYear[year]?.financing.loans ?? 0),
        total: 0,
      },
      assets: {
        cash: roundDataToDecimals(
          previous.assets.cash + (yearDataPerYear[year]?.assets.cash ?? 0) - taxes,
        ),
        property: roundDataToDecimals(
          previous.assets.property + (yearDataPerYear[year]?.assets.property ?? 0),
        ),
        investments: roundDataToDecimals(
          previous.assets.investments + (yearDataPerYear[year]?.assets.investments ?? 0),
        ),
        total: 0,
      },
      liabilities: {
        loans: roundDataToDecimals(
          previous.liabilities.loans + (yearDataPerYear[year]?.liabilities.loans ?? 0),
        ),
        total: 0,
      },
      netWorth: roundDataToDecimals(
        previous.netWorth + (yearDataPerYear[year]?.netWorth ?? 0) - taxes,
      ),
    }
    acc.push({
      ...current,
      operating: {
        ...current.operating,
        total: current.operating.income + current.operating.expenses,
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

function combineData(data: YearData, previousData?: YearData): YearData {
  if (!previousData) return data

  return {
    year: data.year,
    operating: {
      income: data.operating.income + previousData.operating.income,
      expenses: data.operating.expenses + previousData.operating.expenses,
      total: data.operating.total + previousData.operating.total,
    },
    investing: {
      property: data.investing.property + previousData.investing.property,
      investments: data.investing.investments + previousData.investing.investments,
      total: data.investing.total + previousData.investing.total,
    },
    financing: {
      loans: data.financing.loans + previousData.financing.loans,
      total: data.financing.total + previousData.financing.total,
    },
    assets: {
      cash: data.assets.cash + previousData.assets.cash,
      property: data.assets.property + previousData.assets.property,
      investments: data.assets.investments + previousData.assets.investments,
      total: data.assets.total + previousData.assets.total,
    },
    liabilities: {
      loans: data.liabilities.loans + previousData.liabilities.loans,
      total: data.liabilities.total + previousData.liabilities.total,
    },
    netWorth: data.netWorth + previousData.netWorth,
  }
}
