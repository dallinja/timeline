'use client'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { EventEntries } from '@/services/entries.client'
import usePropertyVehicleEvent from '@/lib/entries/property/vehicle/usePropertyVehicleEvent'
import Collapse from '../ui/collapse'
import {
  useCreateEventEntries,
  useUpdateEventEntries,
  useDeleteEventEntries,
} from '@/lib/entries/useEntries'
import { createVehicleEntries, updateVehicleEntries } from '@/lib/entries/property/vehicle/vehicle'

export interface PropertyVehicleEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function PropertyVehicleEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: PropertyVehicleEventProps) {
  const [state, dispatch, vehicleEntryInput] = usePropertyVehicleEvent(
    userId,
    scenario,
    selectedEvent,
  )

  const { mutate: createVehicleEvent } = useCreateEventEntries(createVehicleEntries)
  const { mutate: updateVehicleEvent } = useUpdateEventEntries(updateVehicleEntries)
  const { mutate: deleteVehicleEvent } = useDeleteEventEntries()

  const handleSave = () => {
    if (!state.startYear || !state.endYear) return
    createVehicleEvent(vehicleEntryInput, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  const handleUpdate = () => {
    if (!state.startYear || !state.endYear || !selectedEvent) return
    updateVehicleEvent(
      { input: vehicleEntryInput, selectedEvent },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteVehicleEvent(selectedEvent, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  return (
    <>
      <Input
        className="mb-2"
        label="Vehicle name"
        fullWidth
        value={state.name}
        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
      />
      <Text fontSize="sm" className="mt-4 flex items-center justify-between font-semibold">
        Do you currently own this vehicle?
        <Switch
          checked={state.currentHome}
          onCheckedChange={(value) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'currentHome', value })
          }
        />
      </Text>
      <Text className="mt-6" bold>
        Vehicle details
      </Text>
      <Divider className="mb-2" />
      <Input
        className="mb-2"
        label={state.currentHome ? 'Current home value' : 'Puchase amount'}
        fullWidth
        value={state.vehicleValue}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'vehicleValue', value: e.target.value })
        }
      />
      <div className="mb-2 flex gap-5">
        {!state.currentHome && (
          <Input
            className="mb-2"
            label="Purchase year"
            fullWidth
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={state.startYear}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_FIELD', field: 'startYear', value: e.target.value })
            }
          />
        )}
        <Input
          className="mb-2"
          label={`${state.currentHome ? 'Planned ' : ''}Sale year`}
          fullWidth
          value={state.endYear}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'endYear', value: e.target.value })
          }
        />
      </div>
      <Text className="mt-6" bold>
        Loan
      </Text>
      <Divider className="mb-2" />
      <Text fontSize="sm" className="mt-4 flex items-center justify-between font-semibold">
        Using a loan?
        <Switch
          checked={state.includeLoan}
          onCheckedChange={(value) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'includeLoan', value })
          }
        />
      </Text>
      <Collapse open={state.includeLoan} padding={6}>
        <div className="mt-4">
          {state.currentHome ? (
            <Input
              name="loanAmount"
              label="Remaining amount"
              fullWidth
              value={state.loanAmount}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_FIELD', field: 'loanAmount', value: e.target.value })
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
            name="loanYears"
            label={state.currentHome ? 'Remaining years' : 'Num of years'}
            fullWidth
            value={state.loanYears}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_FIELD', field: 'loanYears', value: e.target.value })
            }
          />
          <Input
            name="loanRate"
            label="Loan rate"
            fullWidth
            value={state.loanRate}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_FIELD', field: 'loanRate', value: e.target.value })
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
        label="Annual depreciation rate (%)"
        fullWidth
        value={state.depreciationRate}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'depreciationRate', value: e.target.value })
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
