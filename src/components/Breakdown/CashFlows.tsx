'use client'

import { TableHeader, TableRow, TableHead, TableBody } from '../ui/table'
import HeaderRow, { CollapseButton } from './HeaderRow'
import { useState } from 'react'
import FooterRow from './FooterRow'
import DataRow from './DataRow'

type Data = {
  year: number
  income: number
  expenses: number
  cash: number
  property: number
  investments: number
}

type CashFlowsProps = {
  data: Data[]
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
            yearData.income + yearData.property + yearData.investments - yearData.expenses
          }
        />
      </TableBody>
    </>
  )
}

type OperatingProps = {
  data: Data[]
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
        calcData={(yearData) => yearData.income - yearData.expenses}
      />
      <DataRow
        title="Income"
        data={data}
        calcData={(yearData) => yearData.income}
        hidden={!expanded}
      />
      <DataRow
        title="Expenses"
        data={data}
        calcData={(yearData) => yearData.expenses}
        hidden={!expanded}
      />
      <DataRow
        title="Total"
        data={data}
        calcData={(yearData) => yearData.income - yearData.expenses}
        hidden={!expanded}
        bold
      />
    </>
  )
}

type InvestingProps = {
  data: Data[]
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
        calcData={(yearData) => yearData.property + yearData.investments}
      />
      <DataRow
        title="Property"
        data={data}
        calcData={(yearData) => yearData.property}
        hidden={!expanded}
      />
      <DataRow
        title="Investments"
        data={data}
        calcData={(yearData) => yearData.investments}
        hidden={!expanded}
      />
      <DataRow
        title="Total"
        data={data}
        calcData={(yearData) => yearData.property + yearData.investments}
        hidden={!expanded}
        bold
      />
    </>
  )
}

type FinancingProps = {
  data: Data[]
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
        calcData={(yearData) => yearData.cash}
      />
      <DataRow
        title="Mortgage"
        data={data}
        calcData={(yearData) => yearData.cash}
        hidden={!expanded}
      />
      <DataRow
        title="Total"
        data={data}
        calcData={(yearData) => yearData.cash}
        hidden={!expanded}
        bold
      />
    </>
  )
}
