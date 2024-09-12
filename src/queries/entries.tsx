import { CreateEntryInput, DeleteEntryInput, UpdateEntryInput } from '@/services/entries'
import {
  createEntries,
  deleteEntries,
  getEntries,
  getEntriesAndSubEntries,
  updateEntries,
  updateEntry,
} from '@/services/local'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useEntries({ scenario }: { scenario: string }) {
  return useQuery({
    queryKey: ['entries', { scenario }],
    queryFn: () => getEntries({ scenario }),
  })
}

export function useEntriesAndSubEntries({ scenario }: { scenario: string }) {
  return useQuery({
    queryKey: ['entries', { scenario, subEntries: true }],
    queryFn: () => getEntriesAndSubEntries({ scenario }),
  })
}

export function useCreateEntries() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entriesInput: CreateEntryInput[]) => createEntries(entriesInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

export function useUpdateEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entryInput: UpdateEntryInput) => updateEntry(entryInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

export function useUpdateEntries() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entriesInput: UpdateEntryInput[]) => updateEntries(entriesInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

export function useDeleteEntries({ skipInvalidation }: { skipInvalidation?: boolean } = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (entriesInput: DeleteEntryInput[]) => deleteEntries(entriesInput),
    onSuccess: () => {
      if (skipInvalidation) return
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}
