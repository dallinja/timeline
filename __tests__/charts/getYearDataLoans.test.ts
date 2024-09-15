import getYearDataLoans from '@/lib/charts/getYearDataLoans'
import { expect, test, describe } from 'vitest'
import { blankEntry } from './blankEntry'
import { Entry } from '@/services/entries'
import { cumprinc, fv, fvGrowingAnnuity, pmt } from '@/lib/financial'

test('cumprinc', () => {
  const principalChange = cumprinc(400000, 0.05 / 12, 360, 24, 35)
  expect(principalChange).toBeCloseTo(6493.71149, 2)
})
describe('loans', () => {
  test('Loans first year, only one year', () => {
    const entry: Entry = {
      ...blankEntry,
      loans_start: 400000,
      loans_rate: 0.05,
      loans_periods: 30,
    }
    const yearData = getYearDataLoans(entry, 0, 0)

    const yearPayments = pmt(400000, 0.05 / 12, 30 * 12) * 12
    const yearPrincipalChange = cumprinc(400000, 0.05 / 12, 30 * 12, 1, 12)
    const yearInterestChange = yearPayments - yearPrincipalChange
    expect(yearData.operating.expenses).toBeCloseTo(-yearInterestChange, 2)
    expect(yearData.financing.loans).toBeCloseTo(
      400000 - yearPrincipalChange - (400000 - yearPrincipalChange),
      2,
    )

    expect(yearData.assets.cash).toBeCloseTo(
      400000 - yearPayments - (400000 - yearPrincipalChange),
      2,
    )
    expect(yearData.liabilities.loans).toBeCloseTo(
      400000 - yearPrincipalChange - (400000 - yearPrincipalChange),
      2,
    )
    expect(yearData.netWorth).toBeCloseTo(-yearInterestChange, 2)
  })

  test('Loans first year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      loans_start: 400000,
      loans_rate: 0.05,
      loans_periods: 30,
    }
    const yearData = getYearDataLoans(entry, 0, 4)

    const yearPayments = pmt(400000, 0.05 / 12, 30 * 12) * 12
    const yearPrincipalChange = cumprinc(400000, 0.05 / 12, 30 * 12, 1, 12)
    const yearInterestChange = yearPayments - yearPrincipalChange
    expect(yearData.operating.expenses).toBeCloseTo(-yearInterestChange, 2)
    expect(yearData.financing.loans).toBeCloseTo(400000 - yearPrincipalChange, 2)

    expect(yearData.assets.cash).toBeCloseTo(400000 - yearPayments, 2)
    expect(yearData.liabilities.loans).toBeCloseTo(400000 - yearPrincipalChange, 2)
    expect(yearData.netWorth).toBeCloseTo(-yearInterestChange, 2)
  })

  test('Loans second year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      loans_start: 400000,
      loans_rate: 0.05,
      loans_periods: 30,
    }
    const yearData = getYearDataLoans(entry, 1, 4)

    const yearPayments = pmt(400000, 0.05 / 12, 30 * 12) * 12
    const yearPrincipalChange = cumprinc(400000, 0.05 / 12, 30 * 12, 13, 24)
    const yearInterestChange = yearPayments - yearPrincipalChange
    expect(yearData.operating.expenses).toBeCloseTo(-yearInterestChange, 2)
    expect(yearData.financing.loans).toBeCloseTo(-yearPrincipalChange, 2)

    expect(yearData.assets.cash).toBeCloseTo(-yearPayments, 2)
    expect(yearData.liabilities.loans).toBeCloseTo(-yearPrincipalChange, 2)
    expect(yearData.netWorth).toBeCloseTo(-yearInterestChange, 2)
  })

  test('Loans fifth year of 5', () => {
    const entry: Entry = {
      ...blankEntry,
      loans_start: 400000,
      loans_rate: 0.05,
      loans_periods: 30,
    }
    const yearData = getYearDataLoans(entry, 4, 4)

    const yearPayments = pmt(400000, 0.05 / 12, 30 * 12) * 12
    const yearPrincipalChange = cumprinc(400000, 0.05 / 12, 30 * 12, 49, 60)
    const yearInterestChange = yearPayments - yearPrincipalChange
    const remainingPrincipal = 400000 - cumprinc(400000, 0.05 / 12, 30 * 12, 1, 60)
    expect(yearData.operating.expenses).toBeCloseTo(-yearInterestChange, 2)
    expect(yearData.financing.loans).toBeCloseTo(-yearPrincipalChange - remainingPrincipal, 2)

    expect(yearData.assets.cash).toBeCloseTo(-yearPayments - remainingPrincipal, 2)
    expect(yearData.liabilities.loans).toBeCloseTo(-yearPrincipalChange - remainingPrincipal, 2)
    expect(yearData.netWorth).toBeCloseTo(-yearInterestChange, 2)
  })

  test('Loans last year of loan (30)', () => {
    const entry: Entry = {
      ...blankEntry,
      loans_start: 400000,
      loans_rate: 0.05,
      loans_periods: 30,
    }
    const yearData = getYearDataLoans(entry, 29, 29)

    const yearPayments = pmt(400000, 0.05 / 12, 30 * 12) * 12
    const yearPrincipalChange = cumprinc(400000, 0.05 / 12, 30 * 12, 349, 360)
    const yearInterestChange = yearPayments - yearPrincipalChange
    expect(yearData.operating.expenses).toBeCloseTo(-yearInterestChange, 2)
    expect(yearData.financing.loans).toBeCloseTo(-yearPrincipalChange, 2)

    expect(yearData.assets.cash).toBeCloseTo(-yearPayments, 2)
    expect(yearData.liabilities.loans).toBeCloseTo(-yearPrincipalChange, 2)
    expect(yearData.netWorth).toBeCloseTo(-yearInterestChange, 2)
  })
  test('Loans after last year of loan (31)', () => {
    const entry: Entry = {
      ...blankEntry,
      loans_start: 400000,
      loans_rate: 0.05,
      loans_periods: 30,
    }
    const yearData = getYearDataLoans(entry, 30, 29)

    expect(yearData.operating.expenses).toBe(0)
    expect(yearData.financing.loans).toBe(0)

    expect(yearData.assets.cash).toBe(0)
    expect(yearData.liabilities.loans).toBe(0)
    expect(yearData.netWorth).toBe(0)
  })
})
