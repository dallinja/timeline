import NetWorthChart from '@/components/NetWorthChart'
import { createClient } from '@/utils/supabase/server'
import { getEntries } from '@/services/entries'
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
  const user = await supabase.auth.getUser()
  const entries = await getEntries({ userId: user.data.user?.id ?? '', scenario })
  // const { data: entries } = useEntriesAndSubEntries({ scenario: 'default' })

  // if (!entries) return <InitialDataDialog />

  return (
    <>
      <div className="w-full p-8">
        <NetWorthChart entries={entries} maxYear={2086} />
        <TabGroup
          Events={<Events entries={entries} />}
          Breakdown={<Breakdown entries={entries} />}
        />
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
