import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Text } from '../ui/text'
import { Divider } from '../ui/divider'
import { Switch } from '../ui/switch'
import { createOneTimeEntries, updateOneTimeEntries } from '@/lib/entries/expense/oneTime/oneTime'
import useExpenseOneTimeEvent from '@/lib/entries/expense/oneTime/useExpenseOneTimeEvent'
import {
  useCreateEventEntries,
  useDeleteEventEntries,
  useUpdateEventEntries,
} from '@/lib/entries/useEntries'
import { EventEntries } from '@/services/entries.client'

export interface ExpenseOneTimeEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function ExpenseOneTimeEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: ExpenseOneTimeEventProps) {
  const [state, dispatch, oneTimeEntryInput] = useExpenseOneTimeEvent(
    userId,
    scenario,
    selectedEvent,
  )

  const { mutate: createOneTimeEvent } = useCreateEventEntries(createOneTimeEntries)
  const { mutate: updateOneTimeEvent } = useUpdateEventEntries(updateOneTimeEntries)
  const { mutate: deleteOneTimeEvent } = useDeleteEventEntries()

  const handleSave = () => {
    if (!state.year) return
    createOneTimeEvent(oneTimeEntryInput, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const handleUpdate = () => {
    if (!state.year || !selectedEvent) return
    updateOneTimeEvent(
      { input: oneTimeEntryInput, selectedEvent },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteOneTimeEvent(selectedEvent, {
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
        value={state.name}
        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
      />
      <Text className="mt-6" bold>
        One-time amount
      </Text>
      <Divider className="mb-2" />
      <div className="flex gap-4">
        <Input
          className="mb-2"
          label="Year"
          value={state.year}
          onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
        />
        <Input
          className="mb-2"
          label="Amount"
          value={state.amount}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'amount', value: e.target.value })
          }
        />
      </div>
      <Text fontSize="sm" className="flex items-center justify-between font-semibold">
        Is this taxable?
        <Switch
          checked={state.taxable}
          onCheckedChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'taxable', value })}
        />
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
