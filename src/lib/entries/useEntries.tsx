import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createEntries,
  CreateEntryInput,
  deleteEntries,
  EventEntries,
  updateEntries,
  UpsertEntryInput,
} from '@/services/entries.client'

export function useCreateEventEntries<T>(
  gatherEntries: (input: T) => [CreateEntryInput, CreateEntryInput[], null],
) {
  // const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: T) => {
      const [entry, relatedEntries] = gatherEntries(input)

      const data = await createEntries([entry])
      const mainEntry = data[0]
      if (!mainEntry) {
        throw new Error('Failed to create entry')
      }

      const otherEntries =
        relatedEntries.length > 0
          ? await createEntries(
              relatedEntries.map((relEntry) => ({ ...relEntry, parent_id: mainEntry.id })),
            )
          : []
      return { ...mainEntry, relatedEntries: otherEntries }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

export function useUpdateEventEntries<T>(
  gatherEntries: (
    input: T,
    selectedEvent: EventEntries,
  ) => [UpsertEntryInput, (CreateEntryInput | UpsertEntryInput)[], { ids: number[] } | null],
) {
  // const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { input: T; selectedEvent: EventEntries }) => {
      const [entry, relatedEntries, entriesToDelete] = gatherEntries(
        input.input,
        input.selectedEvent,
      )

      const entriesToCreate = relatedEntries.filter(
        (relEntry) => !relEntry.id,
      ) as CreateEntryInput[]
      const entriesToUpdate = relatedEntries.filter(
        (relEntry) => !!relEntry.id,
      ) as UpsertEntryInput[]

      const otherEntries = []
      if (entriesToCreate.length > 0) {
        const data = await createEntries(entriesToCreate)
        if (!data) {
          throw new Error('Failed to update entry')
        }
        otherEntries.push(...data)
      }
      if (entriesToDelete && entriesToDelete.ids.length > 0) {
        await deleteEntries(entriesToDelete)
      }
      const data = await updateEntries([entry, ...entriesToUpdate])

      const mainEntry = data.find((entry) => entry.id === input.selectedEvent.id)
      otherEntries.push(...data.filter((entry) => entry.id !== input.selectedEvent.id))

      return { ...mainEntry, relatedEntries: otherEntries }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}

export function useDeleteEventEntries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (selectedEvent: EventEntries) => {
      const loan = selectedEvent.relatedEntries?.find((ent) => ent.type === 'loan')
      const ids = [selectedEvent.id, ...(loan ? [loan.id] : [])]
      return deleteEntries({ ids })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] })
    },
  })
}
