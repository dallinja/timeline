'use client'

import * as React from 'react'
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Entry } from '@/services/entries'
import { getBalanceSheetTimeline } from '@/lib/charts/getBalanceSheetTimeline'
import { getNetWorthTimeline } from '@/lib/charts/getNetWorthTimeline'

export const description = 'An interactive bar chart'

const currencyFormatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

type YearTotals = {
  year: number
  cash: number
  property: number
  investments: number
  loans: number
  netWorth: number
}

const chartConfig = {
  balances: {
    label: 'Balances',
  },
  cash: {
    label: 'Cash',
    color: '#2a9d8f',
  },
  property: {
    label: 'Property',
    color: '#257697',
  },
  investments: {
    label: 'Investments',
    color: '#6a4c93',
  },
  loans: {
    label: 'Loans',
    color: '#e76f51',
  },
  netWorth: {
    label: 'Net worth',
    color: '#000000',
  },
} satisfies ChartConfig

export default function NetWorthChart({ entries, maxYear }: { entries: Entry[]; maxYear: number }) {
  // const data = getBalanceSheetTimeline(entries, maxYear)
  const data = getNetWorthTimeline(entries, maxYear)
  console.log('data: ', data[0])
  // const total = React.useMemo(
  //   () => ({
  //     desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
  //     mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
  //   }),
  //   [],
  // )

  return (
    <Card>
      {/* <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>Showing total visitors for the last 3 months</CardDescription>
        </div>
        <div className="flex">
          {['desktop', 'mobile'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader> */}
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <ComposedChart
            accessibilityLayer
            data={data}
            stackOffset="sign"
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              // tickFormatter={(value) => {
              //   const date = new Date(value)
              //   return date.toLocaleDateString('en-US', {
              //     month: 'short',
              //     day: 'numeric',
              //   })
              // }}
            />
            <YAxis
              tickMargin={8}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => currencyFormatter.format(value)}
            />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[200px]" labelKey="balances" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="cash" stackId="a" fill={`var(--color-cash)`} />
            <Bar dataKey="property" stackId="a" fill={`var(--color-property)`} />
            <Bar dataKey="investments" stackId="a" fill={`var(--color-investments)`} />
            <Bar dataKey="loans" stackId="a" fill={`var(--color-loans)`} />
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="var(--color-netWorth)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
