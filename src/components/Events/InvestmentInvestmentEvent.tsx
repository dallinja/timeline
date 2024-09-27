'use client'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Switch } from '@/components/ui/switch'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import {
  createInvestmentEntries,
  updateInvestmentEntries,
} from '@/lib/entries/investment/investment'
import useInvestmentEvent from '@/lib/entries/investment/useInvestmentEvent'
import {
  useCreateEventEntries,
  useDeleteEventEntries,
  useUpdateEventEntries,
} from '@/lib/entries/useEntries'
import { EventEntries } from '@/services/entries.client'
import { YearDropdown } from '@/components/YearDropdown'

export interface InvestmentInvestmentEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function InvestmentInvestmentEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: InvestmentInvestmentEventProps) {
  const [state, dispatch, investmentEventInput] = useInvestmentEvent(
    userId,
    scenario,
    selectedEvent,
  )

  const { mutate: createInvestmentEvent } = useCreateEventEntries(createInvestmentEntries)
  const { mutate: updateInvestmentEvent } = useUpdateEventEntries(updateInvestmentEntries)
  const { mutate: deleteInvestmentEvent } = useDeleteEventEntries()

  const handleSave = () => {
    if (!state.startYear || !state.endYear) return
    createInvestmentEvent(investmentEventInput, {
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
    updateInvestmentEvent(
      { input: investmentEventInput, selectedEvent },
      {
        onSuccess: () => {
          onClose && onClose()
        },
      },
    )
  }

  const handleDelete = () => {
    if (!selectedEvent) return
    deleteInvestmentEvent(selectedEvent, {
      onSuccess: () => {
        onClose && onClose()
      },
    })
  }

  return (
    <>
      <Input
        className="mb-2"
        label="Investment name"
        value={state.name}
        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value })}
      />
      <Text className="mt-6" bold>
        Investment details
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
      <div className="mb-2 flex gap-5">
        <Input
          fullWidth
          label="Starting annual amount"
          value={state.annualAmount}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'annualAmount', value: e.target.value })
          }
        />
        <Input
          fullWidth
          label="Annual return rate (%)"
          value={state.annualReturnRate}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'annualReturnRate', value: e.target.value })
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
