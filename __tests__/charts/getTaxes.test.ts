// import { expect, test } from 'vitest'
// import { getIncomeTax, TaxBracket } from '@/lib/charts/getTaxes'

// test('Yearly first year, only one year', () => {
//   const brackets: TaxBracket[] = [
//     { min: 0, max: 10000, rate: 0.1 },
//     { min: 10000, max: 20000, rate: 0.15 },
//     { min: 20000, max: null, rate: 0.2 },
//   ]
//   const tests = [
//     { income: 5000, expected: 500 }, // 5000 * 10%
//     { income: 15000, expected: 1000 + 750 }, // (10000 * 10%) + (5000 * 15%)
//     { income: 25000, expected: 1000 + 1500 + 1000 }, // (10000 * 10%) + (10000 * 15%) + (5000 * 20%)
//     { income: 0, expected: 0 },
//     { income: -5000, expected: 0 },
//   ]
//   tests.forEach((test, index) => {
//     expect(getIncomeTax(test.income, brackets)).toBe(test.expected)
//   })
// })
