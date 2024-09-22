'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import IncomeEvent from './Events/IncomeEvent'
import { useState } from 'react'
import ExpenseEvent from './Events/ExpenseEvent'
import PropertyEvent from './Events/PropertyEvent'
import { Entry, EntryType, EventEntries } from '@/services/entries.server'
import InvestmentEvent from './Events/InvestmentEvent'

export interface EditEventButtonProps {
  userId: string
  scenario: string
  children: React.ReactNode
  eventType?: EntryType
  event?: EventEntries
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
      <SheetContent className="sm:max-w-md" aria-describedby={undefined}>
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
  event?: EventEntries
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
        return (
          <ExpenseEvent
            userId={userId}
            scenario={scenario}
            selectedEvent={event}
            onClose={onClose}
          />
        )
      case 'property':
        return (
          <PropertyEvent
            userId={userId}
            scenario={scenario}
            selectedEvent={event}
            onClose={onClose}
          />
        )
      case 'investment':
        return (
          <InvestmentEvent
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
