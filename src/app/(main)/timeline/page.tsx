'use client'

import NetWorthChartLine from '@/components/NetWorthChart'
import { getTimeline } from './getTimeline'
import EventTypeSummary from '@/components/EventTypeSummary'
import { Entry, EntryType } from '@/lib/types'
import InitialDataDialog from '@/components/InitialDataDialog'
import { useState } from 'react'
import { useEntries, useEntriesAndSubEntries } from '@/queries/entries'

type AssetType = 'cash' | 'property' | 'loans' | 'investments' | '_'

const assetTypeColors: Record<AssetType, string> = {
  loans: '#E03C32',
  _: '#aaaaaa',
  investments: '#006B3D',
  property: '#639754',
  cash: '#7BB662',
}

export default function Timeline() {
  const [scenario, setScenario] = useState('default')
  const { data: entries } = useEntriesAndSubEntries({ scenario: 'default' })

  if (!entries) return <InitialDataDialog />
  const events = entries.reduce<Record<EntryType, Entry[]>>(
    (acc, entry) => {
      if (!entry.type) return acc

      acc[entry.type].push(entry)
      return acc
    },
    { income: [], expense: [], property: [], investment: [], loan: [] },
  )
  return (
    <>
      {/* <Header title="Planning" /> */}
      <div className="w-full p-8">
        <NetWorthChart scenario={scenario} />
        <div className="mt-8 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <EventTypeSummary eventType="income" title="Income" events={events.income} />
          </div>
          <div className="col-span-3">
            <EventTypeSummary eventType="expense" title="Expenses" events={events.expense} />
          </div>
          <div className="col-span-3">
            <EventTypeSummary eventType="property" title="Property" events={events.property} />
          </div>
          <div className="col-span-3">
            <EventTypeSummary title="Investments" events={events.investment} />
          </div>
        </div>
      </div>
      <InitialDataDialog />
    </>
  )
}

function NetWorthChart({ scenario }: { scenario: string }) {
  const { data: entries } = useEntries({ scenario })
  console.log('new entries', entries?.[0]?.cash_start)
  if (!entries) return null

  const planChart = getTimeline(entries)
  const netWorthChartData = (Object.entries(assetTypeColors) as Array<[AssetType, string]>).map(
    ([type, color]) => ({
      id: type,
      color,
      data:
        type === '_'
          ? planChart.map((row) => ({ x: row.year, y: -row.loans }))
          : planChart.map((row) => ({ x: row.year, y: row[type] })),
    }),
  )

  return <NetWorthChartLine data={netWorthChartData} />
}
