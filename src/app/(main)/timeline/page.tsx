import NetWorthChart from '@/components/NetWorthChart'
import { createClient } from '@/utils/supabase/server'
import { getEntries, getEntriesAndSubEntries } from '@/services/entries.server'
import Events from './Events'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Breakdown from '@/components/Breakdown/Breakdown'

export default async function Timeline({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const scenario = (searchParams.scenario as string) ?? 'default'
  const supabase = createClient()
  const userId = (await supabase.auth.getUser()).data.user?.id
  if (!userId) return null

  const entries = await getEntries({ userId, scenario })
  const entriesAndSubEntries = await getEntriesAndSubEntries({ userId, scenario: scenario })

  // if (!entries) return <InitialDataDialog />

  return (
    <>
      <div className="w-full p-8">
        <NetWorthChart entries={entries} maxYear={2086} />
        <TabGroup
          Events={<Events entries={entriesAndSubEntries} userId={userId} scenario={scenario} />}
          Breakdown={<Breakdown entries={entries} />}
        />
      </div>
    </>
  )
}

function TabGroup({ Events, Breakdown }: { Events: React.ReactNode; Breakdown: React.ReactNode }) {
  return (
    <Tabs defaultValue="events" className="my-4 w-full">
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
