'use client'

import { DICTIONARY_OBJECTS_KEY } from '@/features/dictionary/api/use-get-dictionary-objects'
import { DICTIONARY_SECURITIES_KEY } from '@/features/dictionary/api/use-get-dictionary-securities'
import { useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

export const useInvalidateAllDictionaries = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: DICTIONARY_SECURITIES_KEY }),
        queryClient.invalidateQueries({ queryKey: DICTIONARY_OBJECTS_KEY }),
      ])
    },
  })

  return {
    invalidateAllDictionaries: mutation.mutate,
    invalidateAllDictionariesAsync: mutation.mutateAsync,
    isInvalidating: mutation.isPending,
    error: mutation.error,
  }
}
