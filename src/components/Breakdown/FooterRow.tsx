import { cn } from '@/lib/cn'
import { TableCell, TableHead, TableRow } from '../ui/table'
import { YearData } from '@/lib/charts/getNetWorthTimeline'
import { formatCurrency } from '@/lib/currency'

type FooterRowProps = {
  title: string
  data: YearData[]
  calcData: (yearData: YearData) => number
}

export default function FooterRow({ title, data, calcData }: FooterRowProps) {
  return (
    <TableRow>
      <TableHead className="sticky left-0 h-8 bg-gray-100 font-semibold text-gray-600">
        <span className="whitespace-nowrap">{title}</span>
      </TableHead>
      {data.map((yearData) => (
        <TableCell key={yearData.year} className="h-8 bg-gray-100 text-right font-semibold">
          {formatCurrency(calcData(yearData))}
        </TableCell>
      ))}
    </TableRow>
  )
}
