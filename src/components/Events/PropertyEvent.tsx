import { Entry } from '@/services/entries.server'
import { SelectField, SelectItem } from '../ui/select'
import { useState } from 'react'
import PropertyHouseEvent from './PropertyHouseEvent'

export interface PropertyEventProps {
  userId: string
  scenario: string
  selectedEvent?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}

export default function PropertyEvent({
  userId,
  scenario,
  selectedEvent,
  onClose,
}: PropertyEventProps) {
  const [propertyType, setPropertyType] = useState(selectedEvent?.sub_type ?? '')
  return (
    <>
      <SelectField
        id="property-type"
        className="mb-4"
        label="Property Type"
        fullWidth
        disabled={!!selectedEvent}
        value={propertyType}
        onValueChange={setPropertyType}
      >
        <SelectItem value="house">House</SelectItem>
      </SelectField>
      {propertyType === 'house' && (
        <PropertyHouseEvent
          userId={userId}
          scenario={scenario}
          selectedEvent={selectedEvent}
          onClose={onClose}
        />
      )}
    </>
  )
}
