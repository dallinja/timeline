import getYearDataInvestments from '@/lib/charts/getYearDataInvestments'
import { expect, test, describe } from 'vitest'
import { blankEntry } from './blankEntry'
import { Entry } from '@/services/entries'
import { fv, fvGrowingAnnuity } from '@/lib/financial'

describe('investments', () => {
  test('Investments first year, only one year', () => {
    const entry: Entry = {
      ...blankEntry,
      investments_start: 100000,
      investments_rate: 0.1,
      investments_recurring: 3000,
      investments_recurring_rate: 0.03,
    }
    const yearData = getYearDataInvestments(entry, 0, 0)
    expect(yearData.investing.investments).toBe(-100000 - 3000 + 110000 + 3000)
    expect(yearData.assets.cash).toBe(-100000 - 3000 + 110000 + 3000)
    expect(yearData.assets.investments).toBe(0)
    expect(yearData.netWorth).toBe(10000)
  })

  test('Investments first year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      investments_start: 100000,
      investments_rate: 0.1,
      investments_recurring: 3000,
      investments_recurring_rate: 0.03,
    }
    const yearData = getYearDataInvestments(entry, 0, 4)
    expect(yearData.investing.investments).toBe(-100000 - 3000)
    expect(yearData.assets.cash).toBe(-100000 - 3000)
    expect(yearData.assets.investments).toBe(110000 + 3000)
    expect(yearData.netWorth).toBe(10000)
  })

  test('Investments second year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      investments_start: 100000,
      investments_rate: 0.1,
      investments_recurring: 3000,
      investments_recurring_rate: 0.03,
    }
    const yearData = getYearDataInvestments(entry, 1, 4)
    expect(yearData.investing.investments).toBe(-3090)
    expect(yearData.assets.cash).toBe(-3090)
    expect(yearData.assets.investments).toBe(11000 + 300 + 3090)
    expect(yearData.netWorth).toBe(11000 + 300)
  })

  test('Investments fifth year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      investments_start: 100000,
      investments_rate: 0.1,
      investments_recurring: 3000,
      investments_recurring_rate: 0.03,
    }
    const yearData = getYearDataInvestments(entry, 4, 5)
    expect(yearData.investing.investments).toBeCloseTo(-3376.53, 2)
    expect(yearData.assets.cash).toBeCloseTo(-3376.53, 2)

    const finalValueOfStart = fv(100000, 0.1, 5)
    const changeOfStart = finalValueOfStart - fv(100000, 0.1, 4)
    const finalValueOfPayments = fvGrowingAnnuity(3000, 0.1, 0.03, 5)
    const changeOfPayments = finalValueOfPayments - fvGrowingAnnuity(3000, 0.1, 0.03, 4)
    expect(yearData.assets.investments).toBeCloseTo(changeOfStart + changeOfPayments, 2)
    expect(yearData.netWorth).toBeCloseTo(changeOfStart + changeOfPayments - 3376.53, 2)
  })
})