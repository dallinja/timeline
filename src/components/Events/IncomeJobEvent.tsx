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
import { Plus, Trash2 } from 'lucide-react'

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
        label="Starting annual salary"
        value={state.annualSalary}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'annualSalary', value: e.target.value })
        }
      />
      {/* <Text className="mt-6" bold>
        Other details
      </Text>
      <Divider className="mb-2" /> */}
      <div className="mb-4 flex gap-5">
        <Input
          label="Annual raise rate (%)"
          value={state.annualRaiseRate}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'annualRaiseRate', value: e.target.value })
          }
        />
        <Input
          label="Signing bonus"
          value={state.startingBonus}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'startingBonus', value: e.target.value })
          }
        />
      </div>
      {state.hasAnnualInvestment && (
        <>
          <div className="mt-6 flex items-end justify-between">
            <Text bold>Annual Retirement Investment</Text>
            <Button
              className="h-6"
              variant="ghost"
              size="sm"
              onClick={() =>
                dispatch({ type: 'UPDATE_FIELD', field: 'hasAnnualInvestment', value: false })
              }
            >
              <Trash2 className="mr-1" size={16} />
              Remove
            </Button>
          </div>
          <Divider className="mb-2" />
          <Text className="text-gray-500" fontSize="xs">
            What percentage of your gross income would you like to invest into your retirement each
            year?
          </Text>
          <Input
            className="mb-2"
            label="Annual percentage (%)"
            value={state.annualInvestmentRate}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_FIELD',
                field: 'annualInvestmentRate',
                value: e.target.value,
              })
            }
          />
        </>
      )}
      {state.hasAnnualDonation && (
        <>
          <div className="mt-6 flex items-end justify-between">
            <Text bold>Annual Charity Donation</Text>
            <Button
              className="h-6"
              variant="ghost"
              size="sm"
              onClick={() =>
                dispatch({ type: 'UPDATE_FIELD', field: 'hasAnnualDonation', value: false })
              }
            >
              <Trash2 className="mr-1" size={16} />
              Remove
            </Button>
          </div>
          <Divider className="mb-2" />
          <Text className="text-gray-500" fontSize="xs">
            What percentage of your gross income would you like to donate to charity each year?
          </Text>
          <Input
            className="mb-2"
            label="Annual percentage (%)"
            value={state.annualDonationRate}
            onChange={(e) =>
              dispatch({ type: 'UPDATE_FIELD', field: 'annualDonationRate', value: e.target.value })
            }
          />
        </>
      )}
      {(!state.hasAnnualDonation || !state.hasAnnualInvestment) && (
        <>
          <Text className="mt-6" bold>
            Related options
          </Text>
          <Divider className="mb-2" />
        </>
      )}
      {/* <Text fontSize="sm" className="my-4 flex items-center justify-between font-semibold">
        Add annual investment
        <Switch
          checked={false}
          onCheckedChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'taxable', value })}
        />
      </Text>
      <Text fontSize="sm" className="my-4 flex items-center justify-between font-semibold">
        Add annual donation
        <Switch
          checked={false}
          onCheckedChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'taxable', value })}
        />
      </Text> */}

      {!state.hasAnnualInvestment && (
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() =>
              dispatch({ type: 'UPDATE_FIELD', field: 'hasAnnualInvestment', value: true })
            }
          >
            <Plus className="-ml-2 mr-1" size={20} /> Add yearly investment
          </Button>
        </div>
      )}
      {!state.hasAnnualDonation && (
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() =>
              dispatch({ type: 'UPDATE_FIELD', field: 'hasAnnualDonation', value: true })
            }
          >
            <Plus className="-ml-2 mr-1" size={20} /> Add yearly donation
          </Button>
        </div>
      )}
      {/* <div className="mb-4 flex gap-5">
        <Input
          label="Annual investing percentage (%)"
          value={state.annualInvestmentRate}
          onChange={(e) =>
            dispatch({ type: 'UPDATE_FIELD', field: 'annualInvestmentRate', value: e.target.value })
          }
        />
        <Input label="Type" />
      </div>
      <Input
        className="mb-2"
        label="Annual donation percentage (%)"
        value={state.annualDonationRate}
        onChange={(e) =>
          dispatch({ type: 'UPDATE_FIELD', field: 'annualDonationRate', value: e.target.value })
        }
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
