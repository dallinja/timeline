'use client'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { EventEntries } from '@/services/entries.client'
import usePropertyHouseEvent from '@/lib/entries/property/house/usePropertyHouseEvent'
import Collapse from '../ui/collapse'
import {
  useCreateEventEntries,
  useUpdateEventEntries,
  useDeleteEventEntries,
} from '@/lib/entries/useEntries'
import { createHouseEntries, updateHouseEntries } from '@/lib/entries/property/house/house'
import { YearDropdown } from '../YearDropdown'

export interface PropertyHouseEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function PropertyHouseEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: PropertyHouseEventProps) {
  const [state, dispatch, houseEntryInput] = usePropertyHouseEvent(userId, scenario, selectedEvent)

  const { mutate: createHouseEvent } = useCreateEventEntries(createHouseEntries)
  const { mutate: updateHouseEvent } = useUpdateEventEntries(updateHouseEntries)
  const { mutate: deleteHouseEvent } = useDeleteEventEntries()

  const handleSave = () => {
    if (!state.startYear) return
    createHouseEvent(houseEntryInput, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const handleUpdate = () => {
    if (!state.startYear || !selectedEvent) return
    updateHouseEvent(
      { input: houseEntryInput, selectedEvent },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteHouseEvent(selectedEvent, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const existing = state.startYear === 'existing'

  return (
    <>
      <Input
        className="mb-2"
        label="House name"
        fullWidth
        value={state.name}
        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
      />
      <Text className="mt-6" bold>
        House details
      </Text>
      <Divider className="mb-2" />
      <div className="mb-2 flex gap-5">
        <YearDropdown
          birthYear={1986}
          maxYear={2086}
          start
          fullWidth
          label="Purchase year"
          value={state.startYear}
          onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'startYear', value })}
        />
        <YearDropdown
          birthYear={1986}
          maxYear={2086}
          fullWidth
          label="Planned sale year"
          value={state.endYear}
          onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'endYear', value })}
        />
      </div>
      <Input
        className="mb-2"
        label={existing ? 'Current home value' : 'Puchase amount'}
        fullWidth
        value={state.houseValue}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'houseValue', value: e.target.value })
        }
      />
      <Text className="mt-6" bold>
        Mortgage
      </Text>
      <Divider className="mb-2" />
      <Text fontSize="sm" className="mt-4 flex items-center justify-between font-semibold">
        Using a mortgage?
        <Switch
          checked={state.includeMortgage}
          onCheckedChange={(value) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'includeMortgage', value })
          }
        />
      </Text>
      <Collapse open={state.includeMortgage} padding={6}>
        <div className="mt-4">
          {existing ? (
            <Input
              name="mortgageAmount"
              label="Remaining amount"
              fullWidth
              value={state.mortgageAmount}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_FIELD', field: 'mortgageAmount', value: e.target.value })
              }
            />
          ) : (
            <Input
              name="downPayment"
              label="Down Payment"
              fullWidth
              value={state.downPayment}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_FIELD', field: 'downPayment', value: e.target.value })
              }
            />
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5">
          <Input
            name="mortgageYears"
            label={existing ? 'Remaining years' : 'Num of years'}
            fullWidth
            value={state.mortgageYears}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_FIELD', field: 'mortgageYears', value: e.target.value })
            }
          />
          <Input
            name="mortgageRate"
            label="Loan rate"
            fullWidth
            value={state.mortgageRate}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_FIELD', field: 'mortgageRate', value: e.target.value })
            }
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
        value={state.appreciationRate}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'appreciationRate', value: e.target.value })
        }
      />
      <Input
        className="mb-2"
        label="Annual home related expenses"
        fullWidth
        value={state.annualExpenses}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'annualExpenses', value: e.target.value })
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
