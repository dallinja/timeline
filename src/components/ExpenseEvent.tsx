import { Entry } from '@/services/entries'
import { SheetHeader } from './ui/sheet'
import { SelectField, SelectItem } from './ui/select'
import { useState } from 'react'
import ExpenseOneTimeEvent from './ExpenseOneTimeEvent'
import ExpenseYearlyEvent from './ExpenseYearlyEvent'

export interface ExpenseEventProps {
  selectedEvent?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}

export default function ExpenseEvent({ selectedEvent, onClose }: ExpenseEventProps) {
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
        <SelectItem value="one-time">One-time amount</SelectItem>
      </SelectField>
      {expenseType === 'yearly' && (
        <ExpenseYearlyEvent selectedEvent={selectedEvent} onClose={onClose} />
      )}
      {expenseType === 'one-time' && (
        <ExpenseOneTimeEvent selectedEvent={selectedEvent} onClose={onClose} />
      )}
    </>
  )
}
