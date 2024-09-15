import { Entry } from '@/services/entries'
import { emptyYearData, YearData } from './types'
import { cumprinc, fv, fvGrowingAnnuity, pmt } from '../financial'
import checkYearData from './checkYearData'
import { roundDataToDecimals } from '../number'

export default function getYearDataLoans(entry: Entry, index: number, lastIndex: number): YearData {
  const { loans_start, loans_rate, loans_periods } = entry
  const yearData = emptyYearData()

  if (!loans_start || !loans_rate || !loans_periods) return yearData
  if (index + 1 > loans_periods) return yearData

  // Every year
  const yearStartMonthPeriod = index * 12 + 1
  const yearEndMonthPeriod = yearStartMonthPeriod + 11
  const yearPayments = pmt(loans_start, loans_rate / 12, loans_periods * 12) * 12
  const yearPrincipalChange = cumprinc(
    loans_start,
    loans_rate / 12,
    loans_periods * 12,
    yearStartMonthPeriod,
    yearEndMonthPeriod,
  )
  const yearInterestChange = yearPayments - yearPrincipalChange

  yearData.operating.expenses -= yearInterestChange // interest expense
  yearData.financing.loans -= yearPrincipalChange

  yearData.assets.cash -= yearPayments
  yearData.liabilities.loans -= yearPrincipalChange
  yearData.netWorth -= yearInterestChange

  // First year
  if (index === 0) {
    yearData.financing.loans += loans_start

    yearData.assets.cash += loans_start
    yearData.liabilities.loans += loans_start
  }

  // Last year, ending early
  if (index === lastIndex && index + 1 < loans_periods) {
    const remainingPrincipal =
      loans_start -
      cumprinc(loans_start, loans_rate / 12, loans_periods * 12, 1, yearEndMonthPeriod)

    yearData.financing.loans -= remainingPrincipal

    yearData.assets.cash -= remainingPrincipal
    yearData.liabilities.loans -= remainingPrincipal
  }

  const roundedYearData = roundDataToDecimals(yearData, 4)

  checkYearData(roundedYearData)

  return roundedYearData
}
