import { Entry } from '@/lib/types'
import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Text } from './ui/text'
import { Divider } from './ui/divider'
import { useCreateEntries, useDeleteEntries, useUpdateEntries } from '@/queries/entries'
import {
  createOneTimeEntries,
  getOneTimeFromEntry,
  updateOneTimeEntries,
} from '@/lib/entries/expense/oneTime'
import { Switch } from './ui/switch'

export interface ExpenseOneTimeEventProps {
  selectedEvent?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}

export default function ExpenseOneTimeEvent({ selectedEvent, onClose }: ExpenseOneTimeEventProps) {
  const oneTime = getOneTimeFromEntry(selectedEvent)
  const [name, setName] = useState(oneTime?.name ?? '')
  const [year, setYear] = useState(oneTime?.year ?? '')
  const [amount, setAmount] = useState(oneTime?.amount ?? '')
  const [includeTaxes, setIncludeTaxes] = useState(oneTime?.taxable ?? false)

  const { mutate: createEntry } = useCreateEntries()
  const { mutate: updateEntries } = useUpdateEntries()
  const { mutate: deleteEntries } = useDeleteEntries()

  const handleSave = () => {
    if (!year) return
    const entries = createOneTimeEntries({
      scenario: 'default',
      name,
      year: Number(year),
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
    if (!year || !selectedEvent) return
    const entries = updateOneTimeEntries(
      {
        scenario: 'default',
        name,
        year: Number(year),
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
        One-time amount
      </Text>
      <Divider className="mb-2" />
      <div className="flex gap-4">
        <Input
          className="mb-2"
          label="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <Input
          className="mb-2"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
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
