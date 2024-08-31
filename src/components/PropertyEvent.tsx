import { Entry } from '@/lib/types'
import { SheetHeader } from './ui/sheet'
import { SelectField, SelectItem } from './ui/select'
import { useState } from 'react'
import PropertyHouseEvent from './PropertyHouseEvent'

export interface PropertyEventProps {
  selectedEvent?: Entry & { relatedEntries?: Entry[] | null }
  onClose?: () => void
}

export default function PropertyEvent({ selectedEvent, onClose }: PropertyEventProps) {
  const [propertyType, setPropertyType] = useState(selectedEvent?.sub_type ?? '')
  return (
    <>
      <SheetHeader>{selectedEvent ? 'Edit' : 'Add'} Property</SheetHeader>
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
        {/* <SelectItem value="one-time">One-time amount</SelectItem> */}
      </SelectField>
      {propertyType === 'house' && (
        <PropertyHouseEvent selectedEvent={selectedEvent} onClose={onClose} />
      )}
      {/* {propertyType === 'one-time' && (
        <PropertyOneTimeEvent selectedEvent={selectedEvent} onClose={onClose} />
      )} */}
    </>
  )
}
