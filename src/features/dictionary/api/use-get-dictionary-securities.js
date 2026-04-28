'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { writeCachedData } from '@/features/dictionary/helpers/writeCachedData'
import { readCachedData } from '@/features/dictionary/helpers/readCachedData'
import { securityDictionaryApi } from '@/shared/api/dictionary/security-dictionary'

export const DICTIONARY_SECURITIES_KEY = ['dictionary', 'securities']
const DICTIONARY_SECURITIES_STORAGE_KEY = 'dictionary:securities'
const DICTIONARY_TTL = 30 * 60 * 1000

export const useGetDictionarySecurities = () => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: DICTIONARY_SECURITIES_KEY,
    queryFn: async () => {
      const response = await securityDictionaryApi.getSecurityDictionary()
      const data = response?.data ?? response

      writeCachedData(data, DICTIONARY_SECURITIES_STORAGE_KEY)
      return data
    },
    initialData: () => {
      const cached = readCachedData(DICTIONARY_SECURITIES_STORAGE_KEY, DICTIONARY_TTL)
      if (cached) {
        queryClient.setQueryData(DICTIONARY_SECURITIES_KEY, cached)
        return cached
      }
      return undefined
    },
    staleTime: DICTIONARY_TTL,
    gcTime: DICTIONARY_TTL,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })
}
