import { cn } from '@/lib/cn'
import { TableRow, TableHead, TableCell } from '../ui/table'

type Data = {
  year: number
  income: number
  expenses: number
  cash: number
  property: number
  investments: number
}

export default function DataRow({
  title,
  data,
  calcData,
  hidden,
  bold,
}: {
  title: string
  data: Data[]
  calcData: (yearData: Data) => number
  hidden: boolean
  bold?: boolean
}) {
  return (
    <TableRow className={cn(hidden && 'hidden')}>
      <TableHead
        className={cn(
          'sticky left-0 bg-white',
          bold ? 'font-semibold text-gray-600' : 'font-medium',
        )}
      >
        {title}
      </TableHead>
      {data.map((yearData) => (
        <TableCell key={yearData.year} className={cn('text-right', bold && 'font-semibold')}>
          ${calcData(yearData)}
        </TableCell>
      ))}
    </TableRow>
  )
}
