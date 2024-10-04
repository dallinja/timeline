import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import CashFlows from './CashFlows'
import BalanceSheet from './BalanceSheet'
import { Entry } from '@/services/entries.server'
import getYearsData from '@/lib/charts/getYearsData'
// 40 years of data
type Data = {
  year: number
  income: number
  expenses: number
  cash: number
  property: number
  investments: number
}[]

export default function Breakdown({ entries }: { entries: Entry[] }) {
  const yearsData = getYearsData(entries, 2076)
  return (
    <div>
      <Table>
        <CashFlows data={yearsData} />

        {/* SPACER */}
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell className="h-16" colSpan={yearsData.length + 1} />
          </TableRow>
        </TableBody>

        <BalanceSheet data={yearsData} />
      </Table>
    </div>
  )
}
