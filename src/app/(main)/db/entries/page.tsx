'use client'

import { Button, buttonBaseClass } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input, inputBaseClass } from '@/components/ui/input'
import { SelectField, SelectItem } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/cn'
import { EntryField, EntryFields } from '@/lib/types'
import { useDeleteEntries, useEntries, useUpdateEntry } from '@/queries/localEntries'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useCallback, useEffect, useRef, useState } from 'react'

const scenarios = ['default', 'optimistic', 'pessimistic'] as const

export default function DBEntriesPage() {
  const [scenario, setScenario] = useState('default')
  const { data: entries } = useEntries({ scenario })
  const [selectedRows, setSelectedRows] = useState<Record<number, CheckedState>>({})

  const { mutate: deleteRows } = useDeleteEntries()

  const handleSelectRow = (id: number, checked: CheckedState) => {
    setSelectedRows((prev) => ({ ...prev, [id]: checked }))
  }

  const handleDelete = () => {
    const ids = Object.keys(selectedRows).filter((id) => !!selectedRows[Number(id)])
    deleteRows(ids.map((id) => ({ id: Number(id) })))
  }

  const selectedEntries = entries?.filter((entry) => !!selectedRows[entry.id]) ?? []

  if (!entries) return null
  const fields = EntryFields
  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Entries</h1>
        <div className="flex items-center gap-4">
          <Text fontSize="sm" bold>
            Scenario
          </Text>
          <SelectField
            id="expense-type"
            className="w-40"
            value={scenario}
            onValueChange={setScenario}
          >
            {scenarios.map((scenario) => (
              <SelectItem key={scenario} value={scenario}>
                {scenario}
              </SelectItem>
            ))}
          </SelectField>
        </div>
      </div>
      {selectedEntries.length > 0 && (
        <div className="mb-2 flex">
          <Button size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1 text-xs">
                <Checkbox />
              </th>
              {fields.map(({ key }) => (
                <th key={key} className="border border-gray-400 px-2 py-1 text-xs">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id} className="odd:bg-gray-100">
                <td className="border border-gray-300 px-2 py-1 text-xs">
                  <Checkbox
                    checked={!!selectedRows[entry.id]}
                    onCheckedChange={(c) => handleSelectRow(entry.id, c)}
                  />
                </td>
                {fields.map((field) => (
                  <Cell key={field.key} field={field} entryId={entry.id} value={entry[field.key]} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

type CellProps = {
  entryId: number
  value: any
  field: EntryField
  startOpen?: boolean
}
function Cell({ entryId, field, value, startOpen }: CellProps) {
  const cellRef = useRef<HTMLTableCellElement>(null)
  const [isEditing, setIsEditing] = useState(startOpen ?? false)
  const [inputValue, setInputValue] = useState(value)

  const { mutate: updateEntry } = useUpdateEntry()

  const handleSave = () => {
    let newValue = value
    switch (field.type) {
      case 'number':
        newValue = inputValue == null ? null : Number(inputValue)
        break
      case 'union':
      case 'boolean':
      case 'string':
        newValue = inputValue == null ? null : inputValue
        break
      default:
    }
    updateEntry(
      { id: entryId, [field.key]: newValue },
      {
        onSuccess() {
          setIsEditing(false)
        },
      },
    )
  }
  const handleCancel = useCallback(() => {
    setInputValue(value)
    setIsEditing(false)
  }, [value])

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (cellRef.current && !cellRef.current.contains(event.target as HTMLTableCellElement)) {
        handleCancel()
      }
    }
    if (!isEditing) return
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [handleCancel, isEditing])

  return isEditing ? (
    <td ref={cellRef} className="border border-gray-300 px-2 py-1 text-xs">
      <form className="flex gap-1">
        {field.type === 'string' || field.type === 'number' ? (
          <input
            autoFocus
            className={cn(inputBaseClass, 'w-32 rounded-sm border border-gray-200 px-2 py-1')}
            type={field.type === 'number' ? 'number' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        ) : null}
        {field.type === 'boolean' && (
          <Checkbox checked={!!inputValue} onCheckedChange={setInputValue} />
        )}
        {field.type === 'union' && (
          <SelectField
            id={`${entryId}-${field.key}`}
            disablePortal
            value={inputValue}
            onValueChange={setInputValue}
          >
            {field.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectField>
        )}
        <button
          type="submit"
          className={cn(buttonBaseClass, 'ml-1 rounded-sm bg-black/5 px-2 py-1')}
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className={cn(buttonBaseClass, 'rounded-sm bg-black/5 px-2 py-1')}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </td>
  ) : (
    <td className="border border-gray-300 px-2 py-1 text-xs" onClick={() => setIsEditing(true)}>
      {field.type === 'boolean' ? <Checkbox defaultChecked={value} disabled /> : value}
    </td>
  )
}
