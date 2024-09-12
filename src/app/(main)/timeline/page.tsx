import NetWorthChart from '@/components/NetWorthChart'
import EventTypeSummary from '@/components/EventTypeSummary'
// import { Entry, EntryType } from '@/services/entries'
import InitialDataDialog from '@/components/InitialDataDialog'
// import { useState } from 'react'
// import { useEntries, useEntriesAndSubEntries } from '@/queries/entries'
import { createClient } from '@/utils/supabase/server'
import { Entry, EntryType, getEntries } from '@/services/entries'
import Events from './Events'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Breakdown from '@/components/Breakdown/Breakdown'

type AssetType = 'cash' | 'property' | 'loans' | 'investments' | '_'

const assetTypeColors: Record<AssetType, string> = {
  loans: '#E03C32',
  _: '#aaaaaa',
  investments: '#006B3D',
  property: '#639754',
  cash: '#7BB662',
}

export default async function Timeline({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const scenario = (searchParams.scenario as string) ?? 'default'
  const supabase = createClient()
  const user = await supabase.auth.getUser()
  const entries = await getEntries({ userId: user.data.user?.id ?? '' })
  // const { data: entries } = useEntriesAndSubEntries({ scenario: 'default' })

  // if (!entries) return <InitialDataDialog />

  return (
    <>
      <div className="w-full p-8">
        <NetWorthChart entries={entries} maxYear={2086} />
        <TabGroup Events={<Events entries={entries} />} Breakdown={<Breakdown />} />
      </div>
    </>
  )
}

function TabGroup({ Events, Breakdown }: { Events: React.ReactNode; Breakdown: React.ReactNode }) {
  return (
    <Tabs defaultValue="breakdown" className="my-4 w-full">
      <div className="mb-3 flex w-full justify-center">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="events">{Events}</TabsContent>
      <TabsContent value="breakdown">{Breakdown}</TabsContent>
    </Tabs>
  )
}
