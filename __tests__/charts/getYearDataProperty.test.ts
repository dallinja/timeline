import getYearDataProperty from '@/lib/charts/getYearDataProperty'
import { expect, test, describe } from 'vitest'
import { blankEntry } from './blankEntry'
import { Entry } from '@/services/entries.server'

describe('property', () => {
  test('Property first year, only one year', () => {
    const entry: Entry = {
      ...blankEntry,
      property_start: 100000,
      property_rate: 0.03,
    }
    const yearData = getYearDataProperty(entry, 0, 0)
    expect(yearData.investing.property).toBe(3000)
    expect(yearData.assets.cash).toBe(3000)
    expect(yearData.assets.property).toBe(0)
    expect(yearData.netWorth).toBe(3000)
  })

  test('Property first year of existing', () => {
    const entry: Entry = {
      ...blankEntry,
      existing: true,
      property_start: 100000,
      property_rate: 0.03,
    }
    const yearData = getYearDataProperty(entry, 0, 4)
    expect(yearData.assets.property).toBe(103000)
    expect(yearData.netWorth).toBe(103000)
  })

  test('Property first year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      property_start: 100000,
      property_rate: 0.03,
    }
    const yearData = getYearDataProperty(entry, 0, 4)
    expect(yearData.investing.property).toBe(-100000)
    expect(yearData.assets.cash).toBe(-100000)
    expect(yearData.assets.property).toBe(103000)
    expect(yearData.netWorth).toBe(3000)
  })

  test('Property second year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      property_start: 100000,
      property_rate: 0.03,
    }
    const yearData = getYearDataProperty(entry, 1, 4)
    expect(yearData.investing.property).toBe(0)
    expect(yearData.assets.cash).toBe(0)
    expect(yearData.assets.property).toBe(3090)
    expect(yearData.netWorth).toBe(3090)
  })

  test('Property fifth year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      property_start: 100000,
      property_rate: 0.03,
    }
    const yearData = getYearDataProperty(entry, 4, 4)
    expect(yearData.investing.property).toBeCloseTo(115927.41, 2)
    expect(yearData.assets.cash).toBeCloseTo(115927.41, 2)
    expect(yearData.assets.property).toBeCloseTo(-112550.88, 2)
    expect(yearData.netWorth).toBeCloseTo(115927.41 - 112550.88, 2)
  })
})
