import { Entry } from '@/services/entries'
import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Text } from './ui/text'
import { Divider } from './ui/divider'
import { useCreateEntries, useDeleteEntries, useUpdateEntries } from '@/queries/entries'
import {
  createYearlyEntries,
  getYearlyFromEntry,
  updateYearlyEntries,
} from '@/lib/entries/expense/yearly'
import { Switch } from './ui/switch'

export interface ExpenseYearlyEventProps {
  selectedEvent?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}

export default function ExpenseYearlyEvent({ selectedEvent, onClose }: ExpenseYearlyEventProps) {
  const yearly = getYearlyFromEntry(selectedEvent)
  const [name, setName] = useState(yearly?.name ?? '')
  const [startYear, setStartYear] = useState(yearly?.startYear ?? '')
  const [endYear, setEndYear] = useState(yearly?.endYear ?? '')
  const [amount, setAmount] = useState(yearly?.amount ?? '')
  const [includeTaxes, setIncludeTaxes] = useState(yearly?.taxable ?? false)

  const { mutate: createEntry } = useCreateEntries()
  const { mutate: updateEntries } = useUpdateEntries()
  const { mutate: deleteEntries } = useDeleteEntries()

  const handleSave = () => {
    if (!startYear || !endYear) return
    const entries = createYearlyEntries({
      scenario: 'default',
      name,
      startYear: Number(startYear),
      endYear: Number(endYear),
      amount: Number(amount),
      taxable: includeTaxes,
    })
    createEntry(entries, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const handleUpdate = () => {
    if (!startYear || !endYear || !selectedEvent) return
    const entries = updateYearlyEntries(
      {
        scenario: 'default',
        name,
        startYear: Number(startYear),
        endYear: Number(endYear),
        amount: Number(amount),
        taxable: includeTaxes,
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
        label="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Text className="mt-6" bold>
        Yearly expenses
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
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Text fontSize="sm" className="flex items-center justify-between font-semibold">
        Is this tax deductable?
        <Switch checked={includeTaxes} onCheckedChange={setIncludeTaxes} />
      </Text>
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
