import { Entry } from '@/services/entries'
import { emptyYearData, YearData } from './types'
import { fv } from '../financial'
import checkYearData from './checkYearData'
import { roundDataToDecimals } from '../number'

export default function getYearDataProperty(
  entry: Entry,
  index: number,
  lastIndex: number,
): YearData {
  const { existing, property_start, property_rate } = entry
  const yearData = emptyYearData()

  // Every year
  const endOfYearValue = property_start ? fv(property_start, property_rate ?? 0, index + 1) : 0
  const startOfYearValue = property_start ? fv(property_start, property_rate ?? 0, index) : 0
  const change = endOfYearValue - startOfYearValue
  yearData.assets.property += change
  yearData.netWorth += change

  // First year
  if (index === 0) {
    if (existing) {
      yearData.netWorth += property_start ?? 0
    } else {
      yearData.investing.property -= property_start ?? 0
      yearData.assets.cash -= property_start ?? 0
    }
    yearData.assets.property += property_start ?? 0
  }

  // Last year
  if (index === lastIndex) {
    yearData.investing.property += endOfYearValue ?? 0

    yearData.assets.cash += endOfYearValue ?? 0
    yearData.assets.property -= endOfYearValue ?? 0
  }

  const roundedYearData = roundDataToDecimals(yearData, 4)

  checkYearData(roundedYearData)

  return roundedYearData
}
