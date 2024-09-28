const INFLATION_RATE = 0.02
const START_YEAR = 2024
function inflate(value: number, years: number, rate: number = INFLATION_RATE): number {
  return value * Math.pow(1 + INFLATION_RATE, years)
}

export function getIncomeTax(income: number, year: number, filingStatus: FilingStatus): number {
  // Get the tax bracket for the given year
  const taxBrackets = getTaxBrackets(year, filingStatus)
  if (taxBrackets === undefined) {
    throw new Error(`No tax brackets found for year ${year}`)
  }
  if (income < 0) {
    return 0
  }

  let taxesOwed = 0

  for (const bracket of taxBrackets) {
    if (income > bracket.min) {
      const upperLimit = bracket.max !== null ? bracket.max : income
      const taxableIncome = Math.min(income, upperLimit) - bracket.min
      taxesOwed += taxableIncome * bracket.rate
    } else {
      break
    }
  }

  return taxesOwed
}

const FICA_SOCIAL_SECURITY_TAX_RATE = 0.062
const FICA_MEDICARE_TAX_RATE = 0.0145
const FICA_MEDICARE_ADDITIONAL_TAX_RATE = 0.009
const FICA_MEDICARE_ADDITIONAL_TAX_CEILING: Record<FilingStatus, number> = {
  Single: 200000,
  HeadOfHousehold: 200000,
  MarriedFilingJointly: 250000,
  MarriedFilingSeparately: 125000,
}
const FICA_START_YEAR_MAX = 168600
export function getFicaTax(income: number, year: number, filingStatus: FilingStatus): number {
  const years = year - START_YEAR

  const socialSecurityTax =
    Math.min(income, inflate(FICA_START_YEAR_MAX, years)) * FICA_SOCIAL_SECURITY_TAX_RATE

  const medicareTaxCeiling = inflate(FICA_MEDICARE_ADDITIONAL_TAX_CEILING[filingStatus], years)
  const medicareTax = Math.min(income, medicareTaxCeiling) * FICA_MEDICARE_TAX_RATE
  const medicareAdditionalTax =
    Math.max(0, income - medicareTaxCeiling) *
    (FICA_MEDICARE_TAX_RATE + FICA_MEDICARE_ADDITIONAL_TAX_RATE)

  return socialSecurityTax + medicareTax + medicareAdditionalTax
}

function getTaxRateByStateRecord(state: string): number {
  return stateTaxRatesRecord[state] ?? 0
}

const STANDARD_DEDUCTION = {
  Single: 14600,
  MarriedFilingJointly: 29200,
  MarriedFilingSeparately: 14600,
  HeadOfHousehold: 21900,
}

function getDeductionForYear(year: number, filingStatus: FilingStatus): number {
  const years = year - START_YEAR
  return inflate(STANDARD_DEDUCTION[filingStatus], years)
}

export function getTaxesForYear(
  income: number,
  year: number,
  filingStatus: FilingStatus,
  state: string = 'Utah',
): number {
  const deduction = getDeductionForYear(year, filingStatus)
  const taxableIncome = Math.max(0, income - deduction)
  const incomeTax = getIncomeTax(taxableIncome, year, filingStatus)
  const ficaTax = getFicaTax(taxableIncome, year, filingStatus)
  const stateIncomeTax = getTaxRateByStateRecord(state) * taxableIncome

  return incomeTax + ficaTax + stateIncomeTax
}

export type TaxBracket = {
  min: number
  max: number | null
  rate: number
}
function getTaxBrackets(year: number, filingStatus: FilingStatus): TaxBracket[] {
  const taxBrackets = taxBracketsByStatus[filingStatus]
  if (taxBrackets === undefined) {
    throw new Error(`No tax brackets found for filing status ${filingStatus}`)
  }
  if (!year || year < START_YEAR) {
    throw new Error(`Year must be ${START_YEAR} or later`)
  }
  // Add inflation adjustments based on year
  const inflationMultiplier = Math.pow(1 + INFLATION_RATE, year - START_YEAR)
  return taxBrackets.map((bracket) => ({
    min: bracket.min * inflationMultiplier,
    max: bracket.max !== null ? bracket.max * inflationMultiplier : null,
    rate: bracket.rate,
  }))
}

export enum FilingStatus {
  Single = 'Single',
  MarriedFilingJointly = 'MarriedFilingJointly',
  MarriedFilingSeparately = 'MarriedFilingSeparately',
  HeadOfHousehold = 'HeadOfHousehold',
}

// Define the tax brackets for each filing status
export const taxBracketsByStatus: Record<FilingStatus, TaxBracket[]> = {
  [FilingStatus.Single]: [
    { min: 0, max: 11600, rate: 0.1 }, // 10%: $0 to $11,600
    { min: 11601, max: 47150, rate: 0.12 }, // 12%: $11,601 to $47,150
    { min: 47151, max: 100525, rate: 0.22 }, // 22%: $47,151 to $100,525
    { min: 100526, max: 191950, rate: 0.24 }, // 24%: $100,526 to $191,950
    { min: 191951, max: 243725, rate: 0.32 }, // 32%: $191,951 to $243,725
    { min: 243726, max: 609350, rate: 0.35 }, // 35%: $243,726 to $609,350
    { min: 609351, max: null, rate: 0.37 }, // 37%: $609,351 or more
  ],
  [FilingStatus.MarriedFilingJointly]: [
    { min: 0, max: 23200, rate: 0.1 }, // 10%: $0 to $23,200
    { min: 23201, max: 94300, rate: 0.12 }, // 12%: $23,201 to $94,300
    { min: 94301, max: 201050, rate: 0.22 }, // 22%: $94,301 to $201,050
    { min: 201051, max: 383900, rate: 0.24 }, // 24%: $201,051 to $383,900
    { min: 383901, max: 487450, rate: 0.35 }, // 35%: $383,901 to $487,450
    { min: 487451, max: 731200, rate: 0.35 }, // 35%: $487,451 to $731,200
    { min: 731201, max: null, rate: 0.37 }, // 37%: $731,201 or more
  ],
  [FilingStatus.MarriedFilingSeparately]: [
    { min: 0, max: 11600, rate: 0.1 }, // 10%: $0 to $11,600
    { min: 11601, max: 47150, rate: 0.12 }, // 12%: $11,601 to $47,150
    { min: 47151, max: 100525, rate: 0.22 }, // 22%: $47,151 to $100,525
    { min: 100526, max: 191950, rate: 0.24 }, // 24%: $100,526 to $191,950
    { min: 191951, max: 243725, rate: 0.32 }, // 32%: $191,951 to $243,725
    { min: 243726, max: 365600, rate: 0.35 }, // 35%: $243,726 to $365,600
    { min: 365601, max: null, rate: 0.37 }, // 37%: $365,601 or more
  ],
  [FilingStatus.HeadOfHousehold]: [
    { min: 0, max: 16550, rate: 0.1 }, // 10%: $0 to $16,550
    { min: 16551, max: 63100, rate: 0.12 }, // 12%: $16,551 to $63,100
    { min: 63101, max: 100500, rate: 0.22 }, // 22%: $63,101 to $100,500
    { min: 100501, max: 191950, rate: 0.24 }, // 24%: $100,501 to $191,950
    { min: 191951, max: 243700, rate: 0.32 }, // 32%: $191,951 to $243,700
    { min: 243701, max: 609350, rate: 0.35 }, // 35%: $243,701 to $609,350
    { min: 609351, max: null, rate: 0.37 }, // 37%: $609,351 or more
  ],
}

const stateTaxRatesRecord: Record<string, number> = {
  Alabama: 0.098,
  Alaska: 0.046,
  Arizona: 0.095,
  Arkansas: 0.102,
  California: 0.135,
  Colorado: 0.097,
  Connecticut: 0.154,
  Delaware: 0.124,
  'District of Columbia': 0.12,
  Florida: 0.091,
  Georgia: 0.089,
  Hawaii: 0.141,
  Idaho: 0.107,
  Illinois: 0.129,
  Indiana: 0.093,
  Iowa: 0.112,
  Kansas: 0.112,
  Kentucky: 0.096,
  Louisiana: 0.091,
  Maine: 0.124,
  Maryland: 0.113,
  Massachusetts: 0.115,
  Michigan: 0.086,
  Minnesota: 0.121,
  Mississippi: 0.098,
  Missouri: 0.093,
  Montana: 0.105,
  Nebraska: 0.115,
  Nevada: 0.096,
  'New Hampshire': 0.096,
  'New Jersey': 0.132,
  'New Mexico': 0.102,
  'New York': 0.159,
  'North Carolina': 0.099,
  'North Dakota': 0.088,
  Ohio: 0.1,
  Oklahoma: 0.09,
  Oregon: 0.108,
  Pennsylvania: 0.106,
  'Rhode Island': 0.114,
  'South Carolina': 0.089,
  'South Dakota': 0.084,
  Tennessee: 0.076,
  Texas: 0.086,
  Utah: 0.121,
  Vermont: 0.136,
  Virginia: 0.125,
  Washington: 0.107,
  'West Virginia': 0.098,
  Wisconsin: 0.109,
  Wyoming: 0.075,
}
