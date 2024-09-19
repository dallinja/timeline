import { createHouseEntries, HouseEntryInput } from './house'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEntries } from '@/services/entries.client'

export function useCreateHouse() {
  // const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: HouseEntryInput) => {
      const [entry, relatedEntries] = createHouseEntries(input)

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
