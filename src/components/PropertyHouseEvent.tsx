'use client'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { useCreateEntries, useDeleteEntries, useUpdateEntries } from '@/queries/entries'
import {
  HouseEntryInput,
  createHouseEntries,
  getHouseFromEvent,
  updateHouseEntries,
} from '@/lib/entries/property/house'
import { Entry, EventEntries } from '@/services/entries.server'
import { roundToDec } from '@/lib/number'
import { useCreateHouse } from '@/lib/entries/property/useCreateHouse'
import { useUpdateHouse } from '@/lib/entries/property/useUpdateHouse'
import usePropertyHouseEvent from '@/lib/entries/property/usePropertyHouseEvent'

const DEFAULT_APPRECIATION_RATE = 0.03

function getIncludeMortgage(entry?: HouseEntryInput) {
  return !!entry?.mortgageAmount
}

export interface PropertyHouseEventProps {
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function PropertyHouseEvent({ selectedEvent, onClose }: PropertyHouseEventProps) {
  const house = getHouseFromEvent(selectedEvent)
  const [currentHome, setCurrentHome] = useState(house?.existing ?? false)
  const [includeMortgage, setIncludeMortgage] = useState(() => getIncludeMortgage(house))

  const [name, setName] = useState(house?.name ?? '')
  const [startYear, setStartYear] = useState(house?.startYear ?? '')
  const [endYear, setEndYear] = useState(house?.endYear ?? '')
  const [houseValue, setHouseValue] = useState(house?.houseValue ?? '')
  const [appreciationRate, setAppreciationRate] = useState(
    house?.annualAppreciationRate
      ? house.annualAppreciationRate * 100
      : String(DEFAULT_APPRECIATION_RATE * 100),
  )
  const [annualExpenses, setAnnualExpenses] = useState(house?.annualExpenses ?? '')
  const [annualExpensesRate, setAnnualExpensesRate] = useState(house?.annualExpensesRate ?? '')
  const [downPayment, setDownPayment] = useState(
    house?.existing ? '' : (house?.houseValue ?? 0) - (house?.mortgageAmount ?? 0) || '',
  )
  const [mortgageAmount, setMortgageAmount] = useState(house?.mortgageAmount ?? '')
  const [mortgageYears, setMortgageYears] = useState(house?.mortgageYears ?? '')
  const [mortgageRate, setMortgageRate] = useState(house?.mortgageRate ?? '')

  const { mutate: createHouseEvent } = useCreateHouse()
  const { mutate: updateHouseEvent } = useUpdateHouse()
  const { mutate: deleteEntries } = useDeleteEntries()

  const handleSave = () => {
    if (!startYear || !endYear) return
    createHouseEvent(
      {
        userId: '1',
        scenario: 'default',
        name,
        startYear: Number(startYear),
        endYear: Number(endYear),
        existing: currentHome,
        houseValue: Number(houseValue),
        annualAppreciationRate: roundToDec(Number(appreciationRate) / 100, 4),
        annualExpenses: Number(annualExpenses),
        annualExpensesRate: roundToDec(Number(annualExpensesRate) / 100, 4),
        mortgageAmount: currentHome
          ? Number(mortgageAmount)
          : Number(houseValue) - Number(downPayment),
        mortgageYears: Number(mortgageYears),
        mortgageRate: Number(mortgageRate),
      },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  const handleUpdate = () => {
    if (!startYear || !endYear || !selectedEvent) return
    updateHouseEvent(
      {
        input: {
          userId: '1',
          scenario: 'default',
          name,
          startYear: Number(startYear),
          endYear: Number(endYear),
          existing: currentHome,
          houseValue: Number(houseValue),
          annualAppreciationRate: roundToDec(Number(appreciationRate) / 100, 4),
          annualExpenses: Number(annualExpenses),
          annualExpensesRate: roundToDec(Number(annualExpensesRate) / 100, 4),
          mortgageAmount: Number(mortgageAmount),
          mortgageYears: Number(mortgageYears),
          mortgageRate: Number(mortgageRate),
        },
        selectedEvent,
      },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteEntries(
      { ids: [selectedEvent.id] },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  return (
    <>
      <Input
        className="mb-2"
        label="House name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Text fontSize="sm" className="mt-4 flex items-center justify-between font-semibold">
        Do you currently own this house?
        <Switch checked={currentHome} onCheckedChange={setCurrentHome} />
      </Text>
      <Text className="mt-6" bold>
        House details
      </Text>
      <Divider className="mb-2" />
      <Input
        className="mb-2"
        label={currentHome ? 'Current home value' : 'Puchase amount'}
        fullWidth
        value={houseValue}
        onChange={(e) => setHouseValue(e.target.value)}
      />
      <div className="mb-2 flex gap-5">
        {!currentHome && (
          <Input
            className="mb-2"
            label="Purchase year"
            fullWidth
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
        )}
        <Input
          className="mb-2"
          label={`${currentHome ? 'Planned ' : ''}Sale year`}
          fullWidth
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
        />
      </div>
      <Text className="mt-6" bold>
        Mortgage
      </Text>
      <Divider className="mb-2" />
      <Text fontSize="sm" className="mt-4 flex items-center justify-between font-semibold">
        Using a mortgage?
        <Switch checked={includeMortgage} onCheckedChange={setIncludeMortgage} />
      </Text>
      <Collapse open={includeMortgage} padding={6}>
        <div className="mt-4">
          {currentHome ? (
            <Input
              name="mortgageAmount"
              label="Remaining amount"
              fullWidth
              value={mortgageAmount}
              onChange={(e) => setMortgageAmount(e.target.value)}
            />
          ) : (
            <Input
              name="downPayment"
              label="Down Payment"
              fullWidth
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
            />
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5">
          <Input
            name="mortgageYears"
            label={currentHome ? 'Remaining years' : 'Num of years'}
            fullWidth
            value={mortgageYears}
            onChange={(e) => setMortgageYears(e.target.value)}
          />
          <Input
            name="mortgageRate"
            label="Loan rate"
            fullWidth
            value={mortgageRate}
            onChange={(e) => setMortgageRate(e.target.value)}
          />
        </div>
      </Collapse>
      <Text className="mt-6" bold>
        Other details
      </Text>
      <Divider className="mb-2" />
      <Input
        className="mb-2"
        label="Annual appreciation rate (%)"
        fullWidth
        value={appreciationRate}
        onChange={(e) => setAppreciationRate(e.target.value)}
      />
      <Input
        className="mb-2"
        label="Annual home related expenses"
        fullWidth
        value={annualExpenses}
        onChange={(e) => setAnnualExpenses(e.target.value)}
      />
      <div className="flex justify-end gap-4 py-4">
        {selectedEvent && (
          <Button variant="error" onClick={handleDelete}>
            Delete Event
          </Button>
        )}
        <Button onClick={selectedEvent ? handleUpdate : handleSave}>
          {selectedEvent ? 'Update' : 'Save'}
        </Button>
      </div>
    </>
  )
}

function Collapse({
  open,
  children,
  padding,
}: {
  open?: boolean
  children?: React.ReactNode
  padding?: number
}) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 500ms',
        ...(padding ? { padding, margin: -padding } : {}),
      }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}
