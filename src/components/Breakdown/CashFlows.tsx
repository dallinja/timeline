'use client'

import { TableHeader, TableRow, TableHead, TableBody } from '../ui/table'
import HeaderRow, { CollapseButton } from './HeaderRow'
import { useState } from 'react'
import FooterRow from './FooterRow'
import DataRow from './DataRow'
import { YearData } from '@/lib/charts/types'

type CashFlowsProps = {
  data: YearData[]
}
export default function CashFlows({ data }: CashFlowsProps) {
  const [expandAll, setExpandAll] = useState({
    operating: false,
    investing: false,
    financing: false,
  })

  const handleExpandAll = (expand: boolean) => {
    setExpandAll({
      operating: expand,
      investing: expand,
      financing: expand,
    })
  }

  const handleExpand = (key: 'operating' | 'investing' | 'financing') => {
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
        <Operating
          data={data}
          expanded={expandAll.operating}
          onToggleOpen={() => handleExpand('operating')}
        />
        <Investing
          data={data}
          expanded={expandAll.investing}
          onToggleOpen={() => handleExpand('investing')}
        />
        <Financing
          data={data}
          expanded={expandAll.financing}
          onToggleOpen={() => handleExpand('financing')}
        />

        {/* TOTAL */}
        <FooterRow
          title="Total Cash"
          data={data}
          calcData={(yearData) =>
            yearData.operating.total + yearData.investing.total + yearData.financing.total
          }
        />
      </TableBody>
    </>
  )
}

type OperatingProps = {
  data: YearData[]
  expanded: boolean
  onToggleOpen: () => void
}
function Operating({ data, expanded, onToggleOpen }: OperatingProps) {
  return (
    <>
      <HeaderRow
        title="Operating"
        showDetails={expanded}
        setShowDetails={onToggleOpen}
        data={data}
        calcData={(yearData) => yearData.operating.total}
      />
      <DataRow
        title="Income"
        data={data}
        calcData={(yearData) => yearData.operating.income}
        hidden={!expanded}
      />
      <DataRow
        title="Expenses"
        data={data}
        calcData={(yearData) => yearData.operating.expenses}
        hidden={!expanded}
      />
      <DataRow
        title="Total"
        data={data}
        calcData={(yearData) => yearData.operating.total}
        hidden={!expanded}
        bold
      />
    </>
  )
}

type InvestingProps = {
  data: YearData[]
  expanded: boolean
  onToggleOpen: () => void
}
function Investing({ data, expanded, onToggleOpen }: InvestingProps) {
  return (
    <>
      <HeaderRow
        title="Investing"
        showDetails={expanded}
        setShowDetails={onToggleOpen}
        data={data}
        calcData={(yearData) => yearData.investing.total}
      />
      <DataRow
        title="Property"
        data={data}
        calcData={(yearData) => yearData.investing.property}
        hidden={!expanded}
      />
      <DataRow
        title="Investments"
        data={data}
        calcData={(yearData) => yearData.investing.investments}
        hidden={!expanded}
      />
      <DataRow
        title="Total"
        data={data}
        calcData={(yearData) => yearData.investing.total}
        hidden={!expanded}
        bold
      />
    </>
  )
}

type FinancingProps = {
  data: YearData[]
  expanded: boolean
  onToggleOpen: () => void
}
function Financing({ data, expanded, onToggleOpen }: FinancingProps) {
  return (
    <>
      <HeaderRow
        title="Financing"
        showDetails={expanded}
        setShowDetails={onToggleOpen}
        data={data}
        calcData={(yearData) => yearData.financing.total}
      />
      <DataRow
        title="Mortgage"
        data={data}
        calcData={(yearData) => yearData.financing.loans}
        hidden={!expanded}
      />
      <DataRow
        title="Total"
        data={data}
        calcData={(yearData) => yearData.financing.total}
        hidden={!expanded}
        bold
      />
    </>
  )
}
