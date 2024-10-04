'use client'

import * as React from 'react'
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Entry } from '@/services/entries.server'
import getYearsData from '@/lib/charts/getYearsData'

export const description = 'An interactive bar chart'

const currencyFormatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const chartConfig = {
  cashFlow: {
    label: 'Cash flow',
  },
  income: {
    label: 'Income',
    color: '#2a9d8f',
  },
  socialSecurity: {
    label: 'Social security',
    color: '#257697',
  },
  rmds: {
    label: 'RMDs',
    color: '#6a4c93',
  },
  expenses: {
    label: 'Expenses',
    color: '#e76f51',
  },
  newIncome: {
    label: 'Net income',
    color: '#000000',
  },
} satisfies ChartConfig

export default function CashFlowChart({ entries, maxYear }: { entries: Entry[]; maxYear: number }) {
  const yearsData = getYearsData(entries, maxYear)
  const data = yearsData.map((yearData) => ({
    year: yearData.year,
    income: yearData.operating.income,
    // socialSecurity: yearData.operating.socialSecurity,
    // rmds: yearData.investing.rmds,
    // expenses: yearData.operating.expenses,
    newIncome: -yearData.operating.expenses,
    // newIncome: yearData.newIncome,
  }))

  return (
    <Card>
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
            />
            <YAxis
              tickMargin={8}
              tickLine={false}
              axisLine={false}
              width={100}
              tickFormatter={(value) => currencyFormatter.format(value)}
            />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[200px]" labelKey="balances" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" stackId="a" fill={`var(--color-income)`} />
            {/* <Bar dataKey="socialSecurity" stackId="a" fill={`var(--color-socialSecurity)`} />
            <Bar dataKey="rmds" stackId="a" fill={`var(--color-rmds)`} /> */}
            {/* <Bar dataKey="expenses" stackId="a" fill={`var(--color-expenses)`} /> */}
            <Line
              type="monotone"
              dataKey="newIncome"
              stroke="var(--color-newIncome)"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
