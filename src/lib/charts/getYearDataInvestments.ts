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
  const {
    existing,
    investments_start,
    investments_rate,
    investments_recurring,
    investments_recurring_rate,
  } = entry
  const yearData = emptyYearData()

  // Every year - initial value (investments_start)
  const endOfYearValue = investments_start
    ? fv(investments_start, investments_rate ?? 0, index + 1)
    : 0
  const startOfYearValue = investments_start
    ? fv(investments_start, investments_rate ?? 0, index)
    : 0
  const change = endOfYearValue - startOfYearValue
  yearData.assets.investments += change
  yearData.netWorth += change

  // Every year - Growing annuity (investments_recurring)
  let endOfYearGrowingAnnuity = 0
  let startOfYearGrowingAnnuity = 0
  if (investments_rate && investments_recurring) {
    endOfYearGrowingAnnuity = fvGrowingAnnuity(
      investments_recurring,
      investments_rate,
      investments_recurring_rate ?? 0,
      index + 1,
    )
    startOfYearGrowingAnnuity = fvGrowingAnnuity(
      investments_recurring,
      investments_rate,
      investments_recurring_rate ?? 0,
      index,
    )
    const growingAnnuityChange = endOfYearGrowingAnnuity - startOfYearGrowingAnnuity
    const payment = fv(investments_recurring, investments_recurring_rate ?? 0, index)
    yearData.investing.investments -= payment

    yearData.assets.cash -= payment
    yearData.assets.investments += growingAnnuityChange
    yearData.netWorth += growingAnnuityChange - payment
  }

  // First year - initial value (investments_start)
  if (index === 0) {
    if (existing) {
      yearData.netWorth += investments_start ?? 0
    } else {
      yearData.investing.investments -= investments_start ?? 0
      yearData.assets.cash -= investments_start ?? 0
    }
    yearData.assets.investments += investments_start ?? 0
  }

  // Last year
  if (index === lastIndex) {
    // convert all investments to cash (start + recurring)
    const endAmount = endOfYearValue + endOfYearGrowingAnnuity
    yearData.investing.investments += endAmount

    yearData.assets.cash += endAmount
    yearData.assets.investments -= endAmount
  }

  const roundedYearData = roundDataToDecimals(yearData, 4)

  checkYearData(roundedYearData)

  return roundedYearData
}
