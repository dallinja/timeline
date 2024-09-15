import { cn } from '@/lib/cn'
import { TableCell, TableHead, TableRow } from '../ui/table'
import { buttonBaseClass } from '../ui/button'
import { ChevronDown } from 'lucide-react'
import { YearData } from '@/lib/charts/getNetWorthTimeline'
import { formatCurrency } from '@/lib/currency'

type HeaderRowProps = {
  title: string
  showDetails: boolean
  setShowDetails: (value: boolean) => void
  data: YearData[]
  calcData: (yearData: YearData) => number
}

export default function HeaderRow({
  title,
  showDetails,
  setShowDetails,
  data,
  calcData,
}: HeaderRowProps) {
  return (
    <TableRow>
      <TableHead
        className={cn(
          'sticky left-0 h-8 font-medium text-gray-600',
          showDetails ? 'bg-gray-100' : 'bg-white',
        )}
      >
        <CollapseButton title={title} open={showDetails} setOpen={setShowDetails} />
      </TableHead>
      {showDetails ? (
        <TableCell className="h-8 bg-gray-100" colSpan={data.length} />
      ) : (
        <>
          {data.map((yearData) => (
            <TableCell key={yearData.year} className="h-8 text-right font-medium">
              {formatCurrency(calcData(yearData))}
            </TableCell>
          ))}
        </>
      )}
    </TableRow>
  )
}

type CollapseButtonProps = {
  title: string
  open: boolean
  setOpen: (value: boolean) => void
}
export function CollapseButton({ title, open, setOpen }: CollapseButtonProps) {
  return (
    <button
      className={cn(buttonBaseClass, 'flex items-center gap-3 hover:text-black')}
      onClick={() => setOpen(!open)}
    >
      <span className="whitespace-nowrap">{title}</span>
      <span className={open ? 'rotate-180 transition-transform' : 'transition-transform'}>
        <ChevronDown className="h-4 w-4" />
      </span>
    </button>
  )
}
