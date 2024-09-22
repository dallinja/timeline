import { Entry } from '@/services/entries.server'
import { emptyYearData, YearData } from './types'
import { av } from '../financial'
import checkYearData from './checkYearData'
import { roundDataToDecimals } from '../number'

export default function getYearDataExpenses(
  entry: Entry,
  index: number,
  lastIndex: number,
): YearData {
  const { cash_start, cash_rate, cash_recurring, cash_recurring_rate, cash_end } = entry
  const yearData = emptyYearData()

  // Every year
  // periods starts at 0 so we see increases starting the second year
  const amountRecurring =
    cash_recurring && cash_recurring_rate ? av(cash_recurring, cash_recurring_rate, index) : 0
  yearData.operating.expenses += amountRecurring

  yearData.assets.cash += amountRecurring
  yearData.netWorth += amountRecurring

  // First year
  if (index === 0) {
    yearData.operating.expenses += cash_start ?? 0

    yearData.assets.cash += cash_start ?? 0
    yearData.netWorth += cash_start ?? 0
  }

  // Last year
  if (index === lastIndex) {
    yearData.operating.expenses += cash_end ?? 0

    yearData.assets.cash += cash_end ?? 0
    yearData.netWorth += cash_end ?? 0
  }

  const roundedYearData = roundDataToDecimals(yearData, 4)

  checkYearData(roundedYearData)

  return roundedYearData
}
