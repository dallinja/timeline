'use client'

import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import IncomeEvent from './IncomeEvent'
import { useState } from 'react'
import ExpenseEvent from './ExpenseEvent'
import PropertyEvent from './PropertyEvent'
import { Entry, EntryType } from '@/services/entries'

export interface EditEventButtonProps {
  children: React.ReactNode
  eventType?: EntryType
  event?: Entry & { relatedEntries?: Entry[] }
}

export default function EditEventButton({
  children,
  eventType: eventTypeProp,
  event,
}: EditEventButtonProps) {
  const eventType = eventTypeProp || event?.type
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <EditEventDialogContent
          eventType={eventType}
          event={event}
          onClose={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}

function EditEventDialogContent({
  eventType,
  event,
  onClose,
}: {
  eventType?: EntryType | null
  event?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}) {
  switch (eventType) {
    case 'income':
      return <IncomeEvent selectedEvent={event} onClose={onClose} />
    case 'expense':
      return <ExpenseEvent selectedEvent={event} onClose={onClose} />
    case 'property':
      return <PropertyEvent selectedEvent={event} onClose={onClose} />
    default:
      return 'hey'
  }
}
