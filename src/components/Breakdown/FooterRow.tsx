import { cn } from '@/lib/cn'
import { TableCell, TableHead, TableRow } from '../ui/table'

type Data = {
  year: number
  income: number
  expenses: number
  cash: number
  property: number
  investments: number
}

type FooterRowProps = {
  title: string
  data: Data[]
  calcData: (yearData: Data) => number
}

export default function FooterRow({ title, data, calcData }: FooterRowProps) {
  return (
    <TableRow>
      <TableHead className="sticky left-0 h-8 bg-gray-100 font-semibold text-gray-600">
        <span className="whitespace-nowrap">{title}</span>
      </TableHead>
      {data.map((yearData) => (
        <TableCell key={yearData.year} className="h-8 bg-gray-100 text-right font-semibold">
          ${calcData(yearData)}
        </TableCell>
      ))}
    </TableRow>
  )
}
