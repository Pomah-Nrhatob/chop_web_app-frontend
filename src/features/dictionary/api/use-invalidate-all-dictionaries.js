'use client'

import {
  DICTIONARY_COMPANY_ID_KEY,
  DICTIONARY_COMPANY_STORAGE_KEY,
  DICTIONARY_OBJECTS_KEY,
} from '@/features/dictionary/api/use-get-dictionary-objects'
import { DICTIONARY_SECURITIES_KEY } from '@/features/dictionary/api/use-get-dictionary-securities'
import { DICTIONARY_SECURITY_POSITION_KEY } from '@/features/dictionary/api/use-get-dictionary-securityPosition'
import { useDictionaryCacheReset } from '@/features/dictionary/hooks/useDictionaryCacheReset'
import { useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

export const useInvalidateAllDictionaries = () => {
  const queryClient = useQueryClient()
  const { resetDictionaryCache } = useDictionaryCacheReset()

  const mutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: DICTIONARY_SECURITIES_KEY }),
        queryClient.invalidateQueries({ queryKey: DICTIONARY_OBJECTS_KEY }),
        queryClient.invalidateQueries({ queryKey: DICTIONARY_SECURITY_POSITION_KEY }),
        queryClient.invalidateQueries({ queryKey: DICTIONARY_COMPANY_ID_KEY }),
        resetDictionaryCache([
          DICTIONARY_SECURITIES_KEY,
          DICTIONARY_OBJECTS_KEY,
          DICTIONARY_SECURITY_POSITION_KEY,
          DICTIONARY_COMPANY_ID_KEY,
        ]),
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
