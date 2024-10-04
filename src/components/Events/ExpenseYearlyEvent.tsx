import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Text } from '../ui/text'
import { Divider } from '../ui/divider'
import { Switch } from '../ui/switch'
import { createYearlyEntries, updateYearlyEntries } from '@/lib/entries/expense/yearly/yearly'
import useExpenseYearlyEvent from '@/lib/entries/expense/yearly/useExpenseYearlyEvent'
import {
  useCreateEventEntries,
  useDeleteEventEntries,
  useUpdateEventEntries,
} from '@/lib/entries/useEntries'
import { EventEntries } from '@/services/entries.client'
import { YearDropdown } from '../YearDropdown'

export interface ExpenseYearlyEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function ExpenseYearlyEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: ExpenseYearlyEventProps) {
  const [state, dispatch, yearlyEventInput] = useExpenseYearlyEvent(userId, scenario, selectedEvent)

  const { mutate: createYearlyEvent } = useCreateEventEntries(createYearlyEntries)
  const { mutate: updateYearlyEvent } = useUpdateEventEntries(updateYearlyEntries)
  const { mutate: deleteYearlyEvent } = useDeleteEventEntries()

  const handleSave = () => {
    if (!state.startYear || !state.endYear) return
    createYearlyEvent(yearlyEventInput, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const handleUpdate = () => {
    if (!state.startYear || !state.endYear || !selectedEvent) return
    updateYearlyEvent(
      { input: yearlyEventInput, selectedEvent },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteYearlyEvent(selectedEvent, {
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
        Yearly expenses
      </Text>
      <Divider className="mb-2" />
      <div className="mb-4 flex gap-5">
        <YearDropdown
          birthYear={1986}
          maxYear={2076}
          start
          fullWidth
          label="Start year"
          value={state.startYear}
          onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'startYear', value })}
        />
        <YearDropdown
          birthYear={1986}
          maxYear={2076}
          fullWidth
          label="End year"
          value={state.endYear}
          onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'endYear', value })}
        />
      </div>
      <Input
        className="mb-2"
        label="Amount"
        value={state.annualAmount}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'annualAmount', value: e.target.value })
        }
      />
      <Text fontSize="sm" className="flex items-center justify-between font-semibold">
        Is this tax deductable?
        <Switch
          checked={state.taxable}
          onCheckedChange={(value) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'taxable', value: value })
          }
        />
      </Text>
      <Text className="mt-6" bold>
        Other details
      </Text>
      <Divider className="mb-2" />
      <Input
        className="mb-2"
        label="Annual increase rate (%)"
        value={state.annualIncreaseRate}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'annualIncreaseRate', value: e.target.value })
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
