import { Entry } from '@/services/entries'
import { emptyYearData, YearData } from './types'
import { fv, fvGrowingAnnuity } from '../financial'
import checkYearData from './checkYearData'
import { roundDataToDecimals } from '../number'

export default function getYearDataInvestments(
  entry: Entry,
  index: number,
  lastIndex: number,
): YearData {
  const { investments_start, investments_rate, investments_recurring, investments_recurring_rate } =
    entry
  const yearData = emptyYearData()

  // Every year
  const endOfYearValue = investments_start
    ? fv(investments_start, investments_rate ?? 0, index + 1)
    : 0
  const startOfYearValue = investments_start
    ? fv(investments_start, investments_rate ?? 0, index)
    : 0
  const change = endOfYearValue - startOfYearValue
  yearData.assets.investments += change
  yearData.netWorth += change

  // Growing annuity
  let yearGrowingAnnuity = 0
  if (investments_rate && investments_recurring) {
    yearGrowingAnnuity =
      fvGrowingAnnuity(
        investments_recurring,
        investments_rate,
        investments_recurring_rate ?? 0,
        index + 1,
      ) -
      fvGrowingAnnuity(
        investments_recurring,
        investments_rate,
        investments_recurring_rate ?? 0,
        index,
      )
    const payment = fv(investments_recurring, investments_recurring_rate ?? 0, index)
    yearData.investing.investments -= payment

    yearData.assets.cash -= payment
    yearData.assets.investments += yearGrowingAnnuity
    yearData.netWorth += yearGrowingAnnuity - payment
  }

  // First year
  if (index === 0) {
    yearData.investing.investments -= investments_start ?? 0

    yearData.assets.cash -= investments_start ?? 0
    yearData.assets.investments += investments_start ?? 0
  }

  // Last year
  if (index === lastIndex) {
    const change = endOfYearValue + yearGrowingAnnuity
    yearData.investing.investments += change

    yearData.assets.cash += change
    yearData.assets.investments -= change
  }

  const roundedYearData = roundDataToDecimals(yearData, 4)

  checkYearData(roundedYearData)

  return roundedYearData
}
