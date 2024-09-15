export type YearData = {
  year: number
  operating: {
    income: number
    expenses: number
    total: number
  }
  investing: {
    property: number
    investments: number
    total: number
  }
  financing: {
    loans: number
    total: number
  }
  assets: {
    cash: number
    property: number
    investments: number
    total: number
  }
  liabilities: {
    loans: number
    total: number
  }
  netWorth: number
}
export function emptyYearData(): YearData {
  return {
    ...{
      year: 0,
      operating: { ...{ income: 0, expenses: 0, total: 0 } },
      investing: { ...{ property: 0, investments: 0, total: 0 } },
      financing: { ...{ loans: 0, total: 0 } },
      assets: { ...{ cash: 0, property: 0, investments: 0, total: 0 } },
      liabilities: { ...{ loans: 0, total: 0 } },
      netWorth: 0,
    },
  }
}
