import { SelectField, SelectItem } from './ui/select'
import { useState } from 'react'
import IncomeJobEvent from './IncomeJobEvent'
import IncomeOneTimeEvent from './IncomeOneTimeEvent'
import { EventEntries } from '@/services/entries.client'

export interface IncomeEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function IncomeEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: IncomeEventProps) {
  const [incomeType, setIncomeType] = useState(selectedEvent?.sub_type ?? '')
  return (
    <>
      <SelectField
        id="income-type"
        className="mb-4"
        label="Income Type"
        fullWidth
        disabled={!!selectedEvent}
        value={incomeType}
        onValueChange={setIncomeType}
      >
        <SelectItem value="job">Job</SelectItem>
        <SelectItem value="one_time">One-time amount</SelectItem>
      </SelectField>
      {incomeType === 'job' && (
        <IncomeJobEvent
          userId={userId}
          scenario={scenario}
          selectedEvent={selectedEvent}
          onClose={onClose}
        />
      )}
      {incomeType === 'one_time' && (
        <IncomeOneTimeEvent
          userId={userId}
          scenario={scenario}
          selectedEvent={selectedEvent}
          onClose={onClose}
        />
      )}
    </>
  )
}
