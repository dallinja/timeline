import getYearDataCash from '@/lib/charts/getYearDataExpenses'
import { expect, test, describe } from 'vitest'
import { blankEntry } from './blankEntry'

describe('expenses yearly', () => {
  test('Yearly first year, only one year', () => {
    const entry = {
      ...blankEntry,
      cash_start: -3000,
      cash_recurring: -50000,
      cash_recurring_rate: 0.1,
    }
    const yearData = getYearDataCash(entry, 0, 0)
    expect(yearData.operating.expenses).toBe(-53000)
    expect(yearData.assets.cash).toBe(-53000)
    expect(yearData.netWorth).toBe(-53000)
  })

  test('Yearly first year of 5', () => {
    const entry = {
      ...blankEntry,
      cash_start: -3000,
      cash_recurring: -50000,
      cash_recurring_rate: 0.1,
    }
    const yearData = getYearDataCash(entry, 0, 4)
    expect(yearData.operating.expenses).toBe(-53000)
    expect(yearData.assets.cash).toBe(-53000)
    expect(yearData.netWorth).toBe(-53000)
  })

  test('Yearly second year of 5', () => {
    const entry = {
      ...blankEntry,
      cash_start: -3000,
      cash_recurring: -50000,
      cash_recurring_rate: 0.1,
    }
    const yearData = getYearDataCash(entry, 1, 4)
    expect(yearData.operating.expenses).toBe(-55000)
    expect(yearData.assets.cash).toBe(-55000)
    expect(yearData.netWorth).toBe(-55000)
  })
})
