'use client'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { createJobEntries, updateJobEntries } from '@/lib/entries/income/job/job'
import useIncomeJobEvent from '@/lib/entries/income/job/useIncomeJobEvent'
import {
  useCreateEventEntries,
  useDeleteEventEntries,
  useUpdateEventEntries,
} from '@/lib/entries/useEntries'
import { EventEntries } from '@/services/entries.client'
import { YearDropdown } from '../YearDropdown'

export interface IncomeJobEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function IncomeJobEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: IncomeJobEventProps) {
  const [state, dispatch, jobEventInput] = useIncomeJobEvent(userId, scenario, selectedEvent)

  const { mutate: createJobEvent } = useCreateEventEntries(createJobEntries)
  const { mutate: updateJobEvent } = useUpdateEventEntries(updateJobEntries)
  const { mutate: deleteJobEvent } = useDeleteEventEntries()

  const handleSave = () => {
    if (!state.startYear || !state.endYear) return
    createJobEvent(jobEventInput, {
      onError: (err) => {
        console.log('err: ', err)
      },
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const handleUpdate = () => {
    if (!state.startYear || !state.endYear || !selectedEvent) return
    updateJobEvent(
      { input: jobEventInput, selectedEvent },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteJobEvent(selectedEvent, {
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
        value={state.name}
        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
      />
      <Text className="mt-6" bold>
        Job details
      </Text>
      <Divider className="mb-2" />
      <div className="mb-4 flex gap-5">
        <YearDropdown
          birthYear={1986}
          maxYear={2086}
          start
          fullWidth
          label="Start year"
          value={state.startYear}
          onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'startYear', value })}
        />
        <YearDropdown
          birthYear={1986}
          maxYear={2086}
          fullWidth
          label="End year"
          value={state.endYear}
          onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'endYear', value })}
        />
      </div>
      <Input
        className="mb-2"
        label="Starting annual salary"
        value={state.annualSalary}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'annualSalary', value: e.target.value })
        }
      />
      <Text fontSize="sm" className="flex items-center justify-between font-semibold">
        Is this taxable?
        <Switch
          checked={state.taxable}
          onCheckedChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'taxable', value })}
        />
      </Text>
      <Text className="mt-6" bold>
        Other details
      </Text>
      <Divider className="mb-2" />
      <Input
        className="mb-2"
        label="Annual raise rate (%)"
        value={state.annualRaiseRate}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'annualRaiseRate', value: e.target.value })
        }
      />
      <Input
        className="mb-2"
        label="Signing bonus"
        value={state.startingBonus}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'startingBonus', value: e.target.value })
        }
      />
      <Text className="mt-6" bold>
        Related expenses
      </Text>
      <Divider className="mb-2" />
      <Input
        className="mb-2"
        label="Annual donation percentage (%)"
        value={state.annualDonationRate}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'annualDonationRate', value: e.target.value })
        }
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
