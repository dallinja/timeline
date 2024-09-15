'use client'

import { Button, buttonBaseClass } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import PlusCircleIcon from '@/components/icons/PlusCircleIcon'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { useCreateEntries, useDeleteEntries, useUpdateEntries } from '@/queries/entries'
import { createJobEntries, getJobFromEntry, updateJobEntries } from '@/lib/entries/income/job'
import { Entry } from '@/services/entries'

const DEFAULT_ANNUAL_RAISE_RATE = 0.03

export interface IncomeJobEventProps {
  selectedEvent?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}

export default function IncomeJobEvent({ selectedEvent, onClose }: IncomeJobEventProps) {
  const job = getJobFromEntry(selectedEvent)
  const [name, setName] = useState(job?.name ?? '')
  const [startYear, setStartYear] = useState(job?.startYear ?? '')
  const [endYear, setEndYear] = useState(job?.endYear ?? '')
  const [salary, setSalary] = useState(job?.annualAmount ?? '')
  const [raiseRate, setRaiseRate] = useState(
    job?.annualRaiseRate ? job.annualRaiseRate * 100 : String(DEFAULT_ANNUAL_RAISE_RATE * 100),
  )
  const [signingBonus, setSigningBonus] = useState(job?.startingBonus ?? '')
  const [includeTaxes, setIncludeTaxes] = useState(job?.taxable ?? true)
  const [donationRate, setDonationRate] = useState(
    job?.annualDonationRate ? job.annualDonationRate * 100 : '',
  )

  const { mutate: createEntries } = useCreateEntries()
  const { mutate: updateEntries } = useUpdateEntries()
  const { mutate: deleteEntries } = useDeleteEntries()

  const handleSave = () => {
    if (!startYear || !endYear) return
    const entries = createJobEntries({
      scenario: 'default',
      name,
      startYear: Number(startYear),
      endYear: Number(endYear),
      annualAmount: Number(salary),
      taxable: includeTaxes,
      annualRaiseRate: Number(raiseRate) / 100,
      startingBonus: Number(signingBonus),
      annualDonationRate: Number(donationRate) / 100,
    })
    createEntries(entries, {
      onError: (err) => {
        console.log('err: ', err)
      },
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const handleUpdate = () => {
    if (!startYear || !endYear || !selectedEvent) return
    const entries = updateJobEntries(
      {
        scenario: 'default',
        name,
        startYear: Number(startYear),
        endYear: Number(endYear),
        annualAmount: Number(salary),
        taxable: includeTaxes,
        annualRaiseRate: Number(raiseRate) / 100,
        startingBonus: Number(signingBonus),
        annualDonationRate: Number(donationRate) / 100,
      },
      selectedEvent,
    )
    updateEntries(entries, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteEntries([{ id: selectedEvent.id }], {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  return (
    <>
      <Input
        className="mb-2"
        label="Job name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Text className="mt-6" bold>
        Job details
      </Text>
      <Divider className="mb-2" />
      <div className="mb-2 flex gap-5">
        <Input
          className="mb-2"
          label="Start year"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
        />
        <Input
          className="mb-2"
          label="End year"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
        />
      </div>
      <Input
        className="mb-2"
        label="Starting annual salary"
        value={salary}
        onChange={(e) => setSalary(e.target.value)}
      />
      <Text fontSize="sm" className="flex items-center justify-between font-semibold">
        Is this taxable?
        <Switch checked={includeTaxes} onCheckedChange={setIncludeTaxes} />
      </Text>
      {/* <Text className="mt-6" bold>
        Job promotions
      </Text>
      <Divider className="mb-2" />
      <div>
        <button className={cn(buttonBaseClass, 'flex items-center')}>
          <PlusCircleIcon color="#888" fontSize="sm" />
          <Text className="ml-1" color="#888" fontSize="xs" bold>
            Add promotion
          </Text>
        </button>
      </div> */}
      {/* {promotions.map((event) => (
            <div key={event.year} className="mb-2 grid grid-cols-[60px,1fr] gap-2">
              <Text>{event.year}</Text>
              <Text className="text-right">{formatCurrency(event.amount, true)}</Text>
            </div>
          ))} */}
      <Text className="mt-6" bold>
        Other details
      </Text>
      <Divider className="mb-2" />
      <Input
        className="mb-2"
        label="Annual raise rate (%)"
        value={raiseRate}
        onChange={(e) => setRaiseRate(e.target.value)}
      />
      <Input
        className="mb-2"
        label="Signing bonus"
        value={signingBonus}
        onChange={(e) => setSigningBonus(e.target.value)}
      />
      <Text className="mt-6" bold>
        Related expenses
      </Text>
      <Divider className="mb-2" />
      <Input
        className="mb-2"
        label="Annual donation percentage"
        value={donationRate}
        onChange={(e) => setDonationRate(e.target.value)}
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
