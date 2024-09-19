import { SheetHeader } from './ui/sheet'
import { SelectField, SelectItem } from './ui/select'
import { useState } from 'react'
import IncomeJobEvent from './IncomeJobEvent'
import IncomeOneTimeEvent from './IncomeOneTimeEvent'
import { Entry } from '@/lib/types'

export interface IncomeEventProps {
  selectedEvent?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}

export default function IncomeEvent({ selectedEvent, onClose }: IncomeEventProps) {
  const [incomeType, setIncomeType] = useState(selectedEvent?.sub_type ?? '')
  return (
    <>
      <SheetHeader>{selectedEvent ? 'Edit' : 'Add'} Income</SheetHeader>
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
        <SelectItem value="one-time">One-time amount</SelectItem>
      </SelectField>
      {incomeType === 'job' && <IncomeJobEvent selectedEvent={selectedEvent} onClose={onClose} />}
      {incomeType === 'one-time' && (
        <IncomeOneTimeEvent selectedEvent={selectedEvent} onClose={onClose} />
      )}
    </>
  )
}
