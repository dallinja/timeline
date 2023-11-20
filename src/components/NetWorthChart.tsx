'use client'

import { Input } from '@/components/ui/input'
import { ResponsiveLine, Serie } from '@nivo/line'
// import { line, curveCatmullRom } from 'd3-shape'
import { useState } from 'react'

export interface NetWorthChartProps {
  data: Serie[]
}

export default function NetWorthChart({ data }: NetWorthChartProps) {
  const [range, setRange] = useState(100)
  return (
    <>
      <Input type="number" value={range} onChange={(e) => setRange(+e.target.value)} />
      <div className="h-[400px] w-full rounded-xl border">
        <Chart data={data} range={range} />
      </div>
    </>
  )
}

function Chart({ data, range }: { data: Serie[]; range: number }) {
  const filteredData = data.map((serie) => ({
    ...serie,
    data: serie.data.filter((_, i) => i < range),
  }))
  return (
    <ResponsiveLine
      data={filteredData}
      margin={{ top: 50, right: 110, bottom: 50, left: 80 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
        // nice: true,
      }}
      yFormat=" >-$,.0f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        // orient: 'bottom',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        // legend: 'Year',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        // orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: 8,
        // legend: 'count',
        legendOffset: -40,
        legendPosition: 'middle',
        format: ' >-$,.0f',
      }}
      colors={{ datum: 'color' }}
      // colors={{ scheme }}
      enableArea
      enablePoints={false}
      enableGridX={false}
      enableSlices="x"
      lineWidth={1}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      layers={[
        'grid',
        'axes',
        'areas',
        'lines',
        // Line,
        'points',
        'slices',
        'markers',
        'mesh',
        'legends',
        'crosshair',
      ]}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  )
}
