import { roundToDec } from '../number'
import { YearData } from './types'

export default function checkYearData(yearData: YearData): void {
  const { operating, investing, financing, assets, liabilities } = yearData
  const { income, expenses } = operating
  const { property: investingProperty, investments: investingInvestments } = investing
  const { loans: financingLoans } = financing
  const { cash, property, investments } = assets
  const { loans } = liabilities
  const { netWorth } = yearData

  const expectedCash = roundToDec(
    income + expenses + investingProperty + investingInvestments + financingLoans,
  )
  if (roundToDec(cash) !== expectedCash) {
    throw new Error(
      `Cash ${cash} does not match income ${income} - expenses ${expenses} + property ${investingProperty} + investments ${investingInvestments} - loans ${financingLoans}`,
    )
  }

  const expectedNetWorth = roundToDec(cash + property + investments - loans)
  if (roundToDec(netWorth) !== expectedNetWorth) {
    throw new Error(`Net worth ${netWorth} does not match assets ${expectedNetWorth}`)
  }
}
