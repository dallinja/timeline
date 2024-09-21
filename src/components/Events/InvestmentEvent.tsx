import { useState } from 'react'
import { SelectField, SelectItem } from '@/components/ui/select'
import { EventEntries } from '@/services/entries.client'
import InvestmentInvestmentEvent from './InvestmentInvestmentEvent'

export interface InvestmentEventProps {
  userId: string
  scenario: string
  selectedEvent?: EventEntries
  onClose?: () => void
}

export default function InvestmentEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: InvestmentEventProps) {
  const [investmentType, setInvestmentType] = useState(selectedEvent?.sub_type ?? '')
  return (
    <>
      <SelectField
        id="investment-type"
        className="mb-4"
        label="Investment Type"
        fullWidth
        disabled={!!selectedEvent}
        value={investmentType}
        onValueChange={setInvestmentType}
      >
        <SelectItem value="investment">Investment</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectField>
      {investmentType === 'investment' && (
        <InvestmentInvestmentEvent
          userId={userId}
          scenario={scenario}
          selectedEvent={selectedEvent}
          onClose={onClose}
        />
      )}
    </>
  )
}
