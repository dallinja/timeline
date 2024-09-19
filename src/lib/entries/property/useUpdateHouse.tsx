import { updateHouseEntries, HouseEntryInput } from './house'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createEntries,
  CreateEntryInput,
  deleteEntries,
  EventEntries,
  updateEntries,
  UpsertEntryInput,
} from '@/services/entries.client'

export function useUpdateHouse() {
  // const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { input: HouseEntryInput; selectedEvent: EventEntries }) => {
      const [entry, relatedEntries, entriesToDelete] = updateHouseEntries(
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
