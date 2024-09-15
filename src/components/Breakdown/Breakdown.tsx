import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import CashFlows from './CashFlows'
import BalanceSheet from './balanceSheet'
import { Entry } from '@/services/entries'
import { getNetWorthTimeline } from '@/lib/charts/getNetWorthTimeline'
// 40 years of data
type Data = {
  year: number
  income: number
  expenses: number
  cash: number
  property: number
  investments: number
}[]

// prettier-ignore
const data = [
  { year: 2020, income: 100000, expenses: 50000, cash: 100, property: 100, investments: 100 },
  { year: 2021, income: 100000, expenses: 50000, cash: 200, property: 150, investments: 180 },
  { year: 2022, income: 100000, expenses: 50000, cash: 250, property: 200, investments: 220 },
  { year: 2023, income: 100000, expenses: 50000, cash: 300, property: 250, investments: 250 },
  { year: 2024, income: 100000, expenses: 50000, cash: 350, property: 300, investments: 300 },
  { year: 2025, income: 100000, expenses: 50000, cash: 400, property: 350, investments: 350 },
  { year: 2026, income: 100000, expenses: 50000, cash: 450, property: 400, investments: 400 },
  { year: 2027, income: 100000, expenses: 50000, cash: 500, property: 450, investments: 450 },
  { year: 2028, income: 100000, expenses: 50000, cash: 550, property: 500, investments: 500 },
  { year: 2029, income: 100000, expenses: 50000, cash: 600, property: 550, investments: 550 },
  { year: 2030, income: 100000, expenses: 50000, cash: 650, property: 600, investments: 600 },
  { year: 2031, income: 100000, expenses: 50000, cash: 700, property: 650, investments: 650 },
  { year: 2032, income: 100000, expenses: 50000, cash: 750, property: 700, investments: 700 },
  { year: 2033, income: 100000, expenses: 50000, cash: 800, property: 750, investments: 750 },
  { year: 2034, income: 100000, expenses: 50000, cash: 850, property: 800, investments: 800 },
  { year: 2035, income: 100000, expenses: 50000, cash: 900, property: 850, investments: 850 },
  { year: 2036, income: 100000, expenses: 50000, cash: 950, property: 900, investments: 900 },
  { year: 2037, income: 100000, expenses: 50000, cash: 1000, property: 950, investments: 950 },
  { year: 2038, income: 100000, expenses: 50000, cash: 1050, property: 1000, investments: 1000 },
  { year: 2039, income: 100000, expenses: 50000, cash: 1100, property: 1050, investments: 1050 },
  { year: 2040, income: 100000, expenses: 50000, cash: 1150, property: 1100, investments: 1100 },
  { year: 2041, income: 100000, expenses: 50000, cash: 1200, property: 1150, investments: 1150 },
  { year: 2042, income: 100000, expenses: 50000, cash: 1250, property: 1200, investments: 1200 },
  { year: 2043, income: 100000, expenses: 50000, cash: 1300, property: 1250, investments: 1250 },
  { year: 2044, income: 100000, expenses: 50000, cash: 1350, property: 1300, investments: 1300 },
  { year: 2045, income: 100000, expenses: 50000, cash: 1400, property: 1350, investments: 1350 },
  { year: 2046, income: 100000, expenses: 50000, cash: 1450, property: 1400, investments: 1400 },
  { year: 2047, income: 100000, expenses: 50000, cash: 1500, property: 1450, investments: 1450 },
  { year: 2048, income: 100000, expenses: 50000, cash: 1550, property: 1500, investments: 1500 },
  { year: 2049, income: 100000, expenses: 50000, cash: 1600, property: 1550, investments: 1550 },
  { year: 2050, income: 100000, expenses: 50000, cash: 1650, property: 1600, investments: 1600 },
  { year: 2051, income: 100000, expenses: 50000, cash: 1700, property: 1650, investments: 1650 },
  { year: 2052, income: 100000, expenses: 50000, cash: 1750, property: 1700, investments: 1700 },
  { year: 2053, income: 100000, expenses: 50000, cash: 1800, property: 1750, investments: 1750 },
  { year: 2054, income: 100000, expenses: 50000, cash: 1850, property: 1800, investments: 1800 },
  { year: 2055, income: 100000, expenses: 50000, cash: 1900, property: 1850, investments: 1850 },
  { year: 2056, income: 100000, expenses: 50000, cash: 1950, property: 1900, investments: 1900 },
  { year: 2057, income: 100000, expenses: 50000, cash: 2000, property: 1950, investments: 1950 },
  { year: 2058, income: 100000, expenses: 50000, cash: 2050, property: 2000, investments: 2000 },
  { year: 2059, income: 100000, expenses: 50000, cash: 2100, property: 2050, investments: 2050 },
]

export default function Breakdown({ entries }: { entries: Entry[] }) {
  const data = getNetWorthTimeline(entries, 2086)
  return (
    <div>
      <Table>
        <CashFlows data={data} />

        {/* SPACER */}
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell className="h-16" colSpan={data.length + 1} />
          </TableRow>
        </TableBody>

        <BalanceSheet data={data} />
      </Table>
    </div>
  )
}
