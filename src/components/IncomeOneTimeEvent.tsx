import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { Divider } from '@/components/ui/divider'
import { createOneTimeEntries, updateOneTimeEntries } from '@/lib/entries/income/oneTime/oneTime'
import useIncomeOneTimeEvent from '@/lib/entries/income/oneTime/useIncomeOneTimeEvent'
import {
  useCreateEventEntries,
  useDeleteEventEntries,
  useUpdateEventEntries,
} from '@/lib/entries/useEntries'
import { Switch } from './ui/switch'
import { EventEntries } from '@/services/entries.client'

export interface IncomeOneTimeEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function IncomeOneTimeEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: IncomeOneTimeEventProps) {
  const [state, dispatch, oneTimeEntryInput] = useIncomeOneTimeEvent(
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
        label="Income name"
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
      {/* <Divider className="my-6" />
      <Input
        className="mb-2"
        label="Donation percentage"
        value={state.donationRate}
        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'donationRate', value: e.target.value })}
      /> */}
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
