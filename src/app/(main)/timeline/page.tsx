import NetWorthChart from '@/components/NetWorthChart'
import { createClient } from '@/utils/supabase/server'
import { getEntries, getEntriesAndSubEntries } from '@/services/entries.server'
import Events from './Events'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Breakdown from '@/components/Breakdown/Breakdown'
import CashFlowChart from '@/components/CashFlowChart'
// import InitialDataDialog from '@/components/InitialDataDialog'

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

  // if (!entries) return <InitialDataDialog scenario={scenario} />

  return (
    <>
      <div className="w-full px-8 pb-8">
        <ChartTabGroup
          CashFlow={<CashFlowChart entries={entries} maxYear={2076} />}
          NetWorth={<NetWorthChart entries={entries} maxYear={2076} />}
        />
        {/* <NetWorthChart entries={entries} maxYear={2076} /> */}
        <TabGroup
          Events={<Events entries={entriesAndSubEntries} userId={userId} scenario={scenario} />}
          Breakdown={<Breakdown entries={entries} />}
        />
      </div>
    </>
  )
}

function ChartTabGroup({
  CashFlow,
  NetWorth,
}: {
  CashFlow: React.ReactNode
  NetWorth: React.ReactNode
}) {
  return (
    <Tabs defaultValue="cashFlow" className="my-4 w-full">
      <div className="mb-3 flex w-full justify-center">
        <TabsList>
          <TabsTrigger value="cashFlow">CashFlow</TabsTrigger>
          <TabsTrigger value="netWorth">NetWorth</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="cashFlow">{CashFlow}</TabsContent>
      <TabsContent value="netWorth">{NetWorth}</TabsContent>
    </Tabs>
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
