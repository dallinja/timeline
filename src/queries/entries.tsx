import {
  CreateEntryInput,
  DeleteEntriesInput,
  UpdateEntryInput,
  UpsertEntryInput,
  createEntries,
  deleteEntries,
  getEntries,
  getEntriesAndSubEntries,
  updateEntries,
  updateEntry,
} from '@/services/entries.client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useEntries({ userId, scenario }: { userId: string; scenario?: string }) {
  return useQuery({
    queryKey: ['entries', { userId, scenario }],
    queryFn: () => getEntries({ userId, scenario }),
  })
}

export function useEntriesAndSubEntries({
  userId,
  scenario,
}: {
  userId: string
  scenario?: string
}) {
  return useQuery({
    queryKey: ['entries', { scenario, subEntries: true }],
    queryFn: () => getEntriesAndSubEntries({ userId, scenario }),
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
    mutationFn: (entriesInput: UpsertEntryInput[]) => updateEntries(entriesInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

export function useDeleteEntries({ skipInvalidation }: { skipInvalidation?: boolean } = {}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (deleteInput: DeleteEntriesInput) => deleteEntries(deleteInput),
    onSuccess: () => {
      if (skipInvalidation) return
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}
