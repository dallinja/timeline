import {
  CreateEntryInput,
  DeleteEntryInput,
  Entry,
  UpdateEntryInput,
} from '@/services/entries.server'
import { getEntries, createEntries, updateEntries, deleteEntries } from '@/services/local'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

export const LocalEntriesContext = createContext<{
  data: Entry[] | undefined
  refetchData: () => void
}>({
  data: undefined,
  refetchData: () => undefined,
})

export function LocalContextProvider({ children }: { children?: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(() => getEntries())

  const refetchData = useCallback(() => {
    setEntries(getEntries())
  }, [])

  return (
    <LocalEntriesContext.Provider value={{ data: entries, refetchData }}>
      {children}
    </LocalEntriesContext.Provider>
  )
}

export const useLocalEntries = (params?: Partial<Entry>) => {
  const localEntriesContext = useContext(LocalEntriesContext)

  if (localEntriesContext === undefined) {
    throw new Error('useLocalEntries must be used within a LocalEntriesProvider')
  }

  const data = localEntriesContext.data ? where(localEntriesContext.data, params) : undefined

  return { data }
}
export const useLocalEntriesAndSubEntries = (params?: Partial<Entry>) => {
  const localEntriesContext = useContext(LocalEntriesContext)

  if (localEntriesContext === undefined) {
    throw new Error('useLocalEntries must be used within a LocalEntriesProvider')
  }

  const data = localEntriesContext.data ? where(localEntriesContext.data, params) : undefined

  return { data }
}

export const useCreateLocalEntries = () => {
  const localEntriesContext = useContext(LocalEntriesContext)

  if (localEntriesContext === undefined) {
    throw new Error('useLocalEntries must be used within a LocalEntriesProvider')
  }

  const mutate = useCallback(
    (createEntriesInput: CreateEntryInput[]) => {
      createEntries(createEntriesInput)
      localEntriesContext.refetchData()
    },
    [localEntriesContext],
  )

  return { mutate }
}

export const useUpdateLocalEntries = () => {
  const localEntriesContext = useContext(LocalEntriesContext)

  if (localEntriesContext === undefined) {
    throw new Error('useLocalEntries must be used within a LocalEntriesProvider')
  }

  const mutate = useCallback(
    (updateEntriesInput: UpdateEntryInput[]) => {
      updateEntries(updateEntriesInput)
      localEntriesContext.refetchData()
    },
    [localEntriesContext],
  )

  return { mutate }
}
export const useDeleteLocalEntries = () => {
  const localEntriesContext = useContext(LocalEntriesContext)

  if (localEntriesContext === undefined) {
    throw new Error('useLocalEntries must be used within a LocalEntriesProvider')
  }

  const mutate = useCallback(
    (deleteEntriesInput: DeleteEntryInput[]) => {
      deleteEntries(deleteEntriesInput)
      localEntriesContext.refetchData()
    },
    [localEntriesContext],
  )

  return { mutate }
}

function where(array: Entry[], filters?: Partial<Entry>) {
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
