import { Text } from '@/components/ui/text'
import { formatCurrency } from '@/lib/currency'
import { cn } from '@/lib/cn'
import { Button, buttonBaseClass } from './ui/button'
import EditEventButton from './EditEventButton'
import PlusCircleIcon from './icons/PlusCircleIcon'
import { Entry, EntryType } from '@/services/entries.server'

export interface EventTypeSummaryProps {
  userId: string
  scenario: string
  eventType?: EntryType
  title?: React.ReactNode
  events?: (Entry & { relatedEntries?: Entry[] })[]
  maxYear?: number
}

export default function EventTypeSummary({
  userId,
  scenario,
  eventType,
  title,
  events,
  maxYear,
}: EventTypeSummaryProps) {
  // DOM

  return (
    <div className="rounded-xl border px-4 py-3">
      <div className="-mt-1 mb-4 flex items-center justify-between">
        <Text bold>{title}</Text>
        <EditEventButton userId={userId} scenario={scenario} eventType={eventType}>
          <Button variant="ghost" icon align="end">
            <PlusCircleIcon />
          </Button>
        </EditEventButton>
      </div>
      {events?.map((event) => (
        <EditEventButton userId={userId} scenario={scenario} key={event.name} event={event}>
          <div
            className={cn(
              buttonBaseClass,
              'mb-2 grid w-full grid-cols-[80px,1fr,auto] gap-2 rounded-sm hover:bg-gray-100',
            )}
          >
            <Text className="text-left">
              {event.start_year}
              {event.end_year !== event.start_year &&
                `-'${String(event.end_year ?? maxYear).substring(2)}`}
            </Text>
            <Text className="text-left">{event.name}</Text>
            <Text className="text-right">{getAmount(event)}</Text>
          </div>
        </EditEventButton>
      ))}
    </div>
  )
}

function getAmount(event: Entry) {
  if (event.type === 'income' || event.type === 'expense') {
    if (event.cash_recurring) {
      return formatCurrency(event.cash_recurring)
    } else if (event.cash_start) {
      return formatCurrency(event.cash_start)
    }
  }
  if (event.type === 'property') {
    if (event.property_start) {
      return formatCurrency(event.property_start)
    }
  }
  if (event.type === 'investment') {
    if (event.investments_recurring) {
      return formatCurrency(event.investments_recurring)
    } else if (event.investments_start) {
      return formatCurrency(event.investments_start)
    }
  }
  return ''
}
