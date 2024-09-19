import EventTypeSummary from '@/components/EventTypeSummary'
import { Entry, EntryType } from '@/services/entries.server'

export default function Events({ entries }: { entries: (Entry & { relatedEntries?: Entry[] })[] }) {
  const events = entries.reduce<Record<EntryType, Entry[]>>(
    (acc, entry) => {
      if (!entry.type) return acc
      if (!acc[entry.type as EntryType]) return acc

      acc[entry.type as EntryType].push(entry)
      return acc
    },
    { income: [], expense: [], property: [], investment: [], loan: [] },
  )
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <EventTypeSummary eventType="income" title="Income" events={events.income} maxYear={2086} />
      </div>
      <div className="col-span-3">
        <EventTypeSummary
          eventType="expense"
          title="Expenses"
          events={events.expense}
          maxYear={2086}
        />
      </div>
      <div className="col-span-3">
        <EventTypeSummary
          eventType="property"
          title="Property"
          events={events.property}
          maxYear={2086}
        />
      </div>
      <div className="col-span-3">
        <EventTypeSummary title="Investments" events={events.investment} maxYear={2086} />
      </div>
    </div>
  )
}
