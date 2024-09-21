import { SheetHeader } from '../ui/sheet'
import { SelectField, SelectItem } from '../ui/select'
import { useState } from 'react'
import ExpenseOneTimeEvent from './ExpenseOneTimeEvent'
import ExpenseYearlyEvent from './ExpenseYearlyEvent'
import { EventEntries } from '@/services/entries.client'

export interface ExpenseEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function ExpenseEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: ExpenseEventProps) {
  const [expenseType, setExpenseType] = useState(selectedEvent?.sub_type ?? '')
  return (
    <>
      <SheetHeader>{selectedEvent ? 'Edit' : 'Add'} Expense</SheetHeader>
      <SelectField
        id="expense-type"
        className="mb-4"
        label="Expense Type"
        fullWidth
        disabled={!!selectedEvent}
        value={expenseType}
        onValueChange={setExpenseType}
      >
        <SelectItem value="yearly">Yearly</SelectItem>
        <SelectItem value="one_time">One-time amount</SelectItem>
      </SelectField>
      {expenseType === 'yearly' && (
        <ExpenseYearlyEvent
          userId={userId}
          scenario={scenario}
          selectedEvent={selectedEvent}
          onClose={onClose}
        />
      )}
      {expenseType === 'one_time' && (
        <ExpenseOneTimeEvent
          userId={userId}
          scenario={scenario}
          selectedEvent={selectedEvent}
          onClose={onClose}
        />
      )}
    </>
  )
}
