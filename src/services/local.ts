import { keyBy } from '@/lib/keyBy'
import {
  CreateEntryInput,
  DeleteEntryInput,
  Entry,
  UpdateEntryInput,
  UpsertEntryInput,
} from '@/lib/types'

const ENTRIES_KEY = 'entries'

/**
 * READ
 */

export async function getEntries(params?: Partial<Entry>) {
  const entriesItem = localStorage.getItem(ENTRIES_KEY)
  const entries = entriesItem ? (JSON.parse(entriesItem) as Entry[]) : []

  return where(entries, params)
}

export async function getEntriesAndSubEntries(params?: Partial<Entry>) {
  const allEntries = await getEntries(params)
  const entriesByParentId = groupBy(allEntries, 'parent_id')
  const parentEntries = await getEntries({ ...params, parent_id: null })

  return parentEntries.map((entry) => ({
    ...entry,
    relatedEntries: entriesByParentId[entry.id] || [],
  }))
}

/**
 * CREATE
 */

export async function createEntries(
  entriesInput: (CreateEntryInput & { related_entries?: CreateEntryInput[] })[],
) {
  const entriesItem = localStorage.getItem(ENTRIES_KEY)
  const entries = entriesItem ? (JSON.parse(entriesItem) as Entry[]) : []
  const now = new Date()
  const newEntries = entriesInput.reduce<Entry[]>((acc, { related_entries, ...entryInput }) => {
    const entry = {
      ...getEntryBase(),
      ...entryInput,
      id: getId(),
      created_at: now.toISOString(),
    }
    acc.push(
      entry,
      ...(related_entries?.map((relEntry) => ({
        ...getEntryBase(),
        ...relEntry,
        id: getId(),
        parent_id: entry.id,
        created_at: now.toISOString(),
      })) || []),
    )
    return acc
  }, [])
  const allEntries = [...entries, ...newEntries]

  localStorage.setItem(ENTRIES_KEY, JSON.stringify(allEntries))
  return newEntries
}

function getId() {
  const date = new Date()
  const timestamp = date.getTime() // Get current timestamp in milliseconds

  // You may want to add more information to ensure uniqueness, like a random number or a counter
  const uniqueId = Number(
    `${timestamp}${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`,
  )

  return uniqueId
}

/**
 * UPDATE
 */

export async function updateEntry(entryInput: UpdateEntryInput) {
  const entriesItem = localStorage.getItem(ENTRIES_KEY)
  const entries = entriesItem ? (JSON.parse(entriesItem) as Entry[]) : []
  const entriesById = keyBy(entries, 'id')
  const entry = entriesById[entryInput.id]
  if (!entry) throw Error(`could not find entry with id: ${entryInput.id}`)

  const updatedEntry = { ...entry, ...entryInput }
  entriesById[entryInput.id] = updatedEntry
  const allEntries = Object.values(entriesById) as Entry[]

  localStorage.setItem(ENTRIES_KEY, JSON.stringify(allEntries))
  return updatedEntry
}

export async function updateEntries(
  entriesInput: (UpdateEntryInput & { related_entries?: UpsertEntryInput[] })[],
) {
  const entriesItem = localStorage.getItem(ENTRIES_KEY)
  const entries = entriesItem ? (JSON.parse(entriesItem) as Entry[]) : []
  const entriesById = keyBy(entries, 'id')

  const updatedEntries: Entry[] = []
  entriesInput.forEach(({ related_entries, ...entryInput }) => {
    const entry = entriesById[entryInput.id]
    if (!entry) throw Error(`could not find entry with id: ${entryInput.id}`)
    const updatedEntry = { ...entry, ...entryInput }
    entriesById[entryInput.id] = updatedEntry
    updatedEntries.push(updatedEntry)
    related_entries?.forEach((relEntry) => {
      // if no id, create the entry
      if (relEntry.id == null) {
        const now = new Date()
        const newId = now.getTime()
        const newEntry = {
          ...getEntryBase(),
          ...relEntry,
          id: newId,
          parent_id: entryInput.id,
          created_at: now.toISOString(),
        }
        entriesById[newId] = newEntry
        updatedEntries.push(newEntry)
      } else {
        const entry = entriesById[relEntry.id]
        if (!entry) throw Error(`could not find entry with id: ${relEntry.id}`)
        const updatedEntry = { ...entry, ...relEntry }
        entriesById[relEntry.id] = updatedEntry
        updatedEntries.push(updatedEntry)
      }
    })
  })

  const allEntries = Object.values(entriesById) as Entry[]

  localStorage.setItem(ENTRIES_KEY, JSON.stringify(allEntries))
  return updatedEntries
}

/**
 * DELETE
 */

export async function deleteEntries(entriesInput: DeleteEntryInput[]) {
  const entriesItem = localStorage.getItem(ENTRIES_KEY)
  const entries = entriesItem ? (JSON.parse(entriesItem) as Entry[]) : []
  const newEntries = entries.filter(
    (entry) =>
      !entriesInput.some((input) =>
        input.id === undefined
          ? entry.scenario === input.scenario
          : entry.id === input.id || entry.parent_id === input.id,
      ),
  )

  localStorage.setItem(ENTRIES_KEY, JSON.stringify(newEntries))
  return entriesInput
}

/**
 * Helpers
 */

interface MyObject {
  [key: string]: any
}

function where<T extends MyObject>(array: T[], filters?: Partial<T>) {
  if (!filters) return array

  return array.filter((obj) => {
    for (let key in filters) {
      if (obj[key] !== filters[key]) {
        return false
      }
    }
    return true
  })
}

function groupBy<T extends MyObject>(objects: T[], key: string): { [key: string]: T[] } {
  const grouped: { [key: string]: T[] } = {}

  objects.forEach((obj) => {
    const keyValue = obj[key]
    if (!keyValue) return

    const group = grouped[keyValue]

    if (group) {
      group.push(obj)
    } else {
      grouped[keyValue] = [obj]
    }
  })

  return grouped
}

export function getEntryBase(): Entry {
  return {
    id: 0,
    created_at: '',
    name: '',
    parent_id: null,
    type: 'income',
    sub_type: 'job',
    user_id: '1',
    scenario: 'default',

    start_year: 0,
    end_year: 0,

    cash_start: 0,
    cash_rate: 0,
    cash_recurring: 0,
    cash_recurring_rate: 0,
    cash_taxable: false,

    property_start: 0,
    property_rate: 0,

    investments_start: 0,
    investments_rate: 0,
    investments_recurring: 0,
    investments_recurring_rate: 0,

    loans_start: 0,
    loans_rate: 0,
    loans_periods: 0,
  }
}
