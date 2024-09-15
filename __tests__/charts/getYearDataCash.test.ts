import getYearDataCash from '@/lib/charts/getYearDataCash'
import { expect, test, describe } from 'vitest'
import { blankEntry } from './blankEntry'

describe('income job', () => {
  test('Job first year, only one year', () => {
    const entry = {
      ...blankEntry,
      cash_start: 3000,
      cash_recurring: 50000,
      cash_recurring_rate: 0.1,
    }
    const yearData = getYearDataCash(entry, 0, 0)
    expect(yearData.operating.income).toBe(53000)
    expect(yearData.assets.cash).toBe(53000)
    expect(yearData.netWorth).toBe(53000)
  })

  test('Job first year of 5', () => {
    const entry = {
      ...blankEntry,
      cash_start: 3000,
      cash_recurring: 50000,
      cash_recurring_rate: 0.1,
    }
    const yearData = getYearDataCash(entry, 0, 4)
    expect(yearData.operating.income).toBe(53000)
    expect(yearData.assets.cash).toBe(53000)
    expect(yearData.netWorth).toBe(53000)
  })

  test('Job second year of 5', () => {
    const entry = {
      ...blankEntry,
      cash_start: 3000,
      cash_recurring: 50000,
      cash_recurring_rate: 0.1,
    }
    const yearData = getYearDataCash(entry, 1, 4)
    expect(yearData.operating.income).toBe(55000)
    expect(yearData.assets.cash).toBe(55000)
    expect(yearData.netWorth).toBe(55000)
  })
})
