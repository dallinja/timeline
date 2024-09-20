'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import IncomeEvent from './IncomeEvent'
import { useState } from 'react'
import ExpenseEvent from './ExpenseEvent'
import PropertyEvent from './PropertyEvent'
import { Entry, EntryType } from '@/services/entries.server'

export interface EditEventButtonProps {
  userId: string
  scenario: string
  children: React.ReactNode
  eventType?: EntryType
  event?: Entry & { relatedEntries?: Entry[] }
}

export default function EditEventButton({
  userId,
  scenario,
  children,
  eventType: eventTypeProp,
  event,
}: EditEventButtonProps) {
  const eventType = eventTypeProp || (event?.type as EntryType)
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent aria-describedby={undefined}>
        <EditEventDialogContent
          userId={userId}
          scenario={scenario}
          eventType={eventType}
          event={event}
          onClose={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}

function EditEventDialogContent({
  userId,
  scenario,
  eventType,
  event,
  onClose,
}: {
  userId: string
  scenario: string
  eventType?: EntryType | null
  event?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}) {
  const eventTypeTitle = eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) : ''

  const renderSwitch = (eventType?: EntryType | null) => {
    switch (eventType) {
      case 'income':
        return (
          <IncomeEvent
            userId={userId}
            scenario={scenario}
            selectedEvent={event}
            onClose={onClose}
          />
        )
      case 'expense':
        return null
      // return <ExpenseEvent selectedEvent={event} onClose={onClose} />
      case 'property':
        return (
          <PropertyEvent
            userId={userId}
            scenario={scenario}
            selectedEvent={event}
            onClose={onClose}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>
          {event ? 'Edit' : 'Add'} {eventTypeTitle}
        </SheetTitle>
      </SheetHeader>
      {renderSwitch(eventType)}
    </>
  )
}
