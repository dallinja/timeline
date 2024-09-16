'use client'

import { TableHeader, TableRow, TableHead, TableBody } from '../ui/table'
import HeaderRow, { CollapseButton } from './HeaderRow'
import { useState } from 'react'
import FooterRow from './FooterRow'
import DataRow from './DataRow'
import { YearData } from '@/lib/charts/types'

type BalanceSheetProps = {
  data: YearData[]
}
export default function BalanceSheet({ data }: BalanceSheetProps) {
  const [expandAll, setExpandAll] = useState({
    assets: false,
    liabilities: false,
  })

  const handleExpandAll = (expand: boolean) => {
    setExpandAll({
      assets: expand,
      liabilities: expand,
    })
  }

  const handleExpand = (key: 'assets' | 'liabilities') => {
    setExpandAll((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const allExpanded = Object.values(expandAll).every((value) => value)

  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 w-[100px] bg-white">
            <CollapseButton
              title={`${allExpanded ? 'Collapse' : 'Expand'} all`}
              open={allExpanded}
              setOpen={() => handleExpandAll(!allExpanded)}
            />
          </TableHead>
          {data.map((yearData) => (
            <TableHead key={yearData.year} className="text-right">
              {yearData.year}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        <Assets
          data={data}
          expanded={expandAll.assets}
          onToggleOpen={() => handleExpand('assets')}
        />
        <Liabilities
          data={data}
          expanded={expandAll.liabilities}
          onToggleOpen={() => handleExpand('liabilities')}
        />

        {/* TOTAL */}
        <FooterRow title="Net worth" data={data} calcData={(yearData) => yearData.netWorth} />
      </TableBody>
    </>
  )
}

type AssetsProps = {
  data: YearData[]
  expanded: boolean
  onToggleOpen: () => void
}
function Assets({ data, expanded, onToggleOpen }: AssetsProps) {
  return (
    <>
      <HeaderRow
        title="Assets"
        showDetails={expanded}
        setShowDetails={onToggleOpen}
        data={data}
        calcData={(yearData) => yearData.assets.total}
      />
      <DataRow
        title="Cash"
        data={data}
        calcData={(yearData) => yearData.assets.cash}
        hidden={!expanded}
      />
      <DataRow
        title="Property"
        data={data}
        calcData={(yearData) => yearData.assets.property}
        hidden={!expanded}
      />
      <DataRow
        title="Investments"
        data={data}
        calcData={(yearData) => yearData.assets.investments}
        hidden={!expanded}
      />
      <DataRow
        title="Total"
        data={data}
        calcData={(yearData) => yearData.assets.total}
        hidden={!expanded}
        bold
      />
    </>
  )
}

type LiabilitiesProps = {
  data: YearData[]
  expanded: boolean
  onToggleOpen: () => void
}
function Liabilities({ data, expanded, onToggleOpen }: LiabilitiesProps) {
  return (
    <>
      <HeaderRow
        title="Liabilities"
        showDetails={expanded}
        setShowDetails={onToggleOpen}
        data={data}
        calcData={(yearData) => yearData.liabilities.total}
      />
      <DataRow
        title="Loans"
        data={data}
        calcData={(yearData) => yearData.liabilities.loans}
        hidden={!expanded}
      />
      <DataRow
        title="Total"
        data={data}
        calcData={(yearData) => yearData.liabilities.total}
        hidden={!expanded}
        bold
      />
    </>
  )
}
