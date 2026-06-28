'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { writeCachedData } from '@/features/dictionary/helpers/writeCachedData'
import { readCachedData } from '@/features/dictionary/helpers/readCachedData'
import { securityPositionDictionaryApi } from '@/shared/api/dictionary/securityPosition-dictionary'

export const DICTIONARY_SECURITY_POSITION_KEY = ['dictionary', 'securityPosition']
const DICTIONARY_SECURITY_POSITION_STORAGE_KEY = 'dictionary:securityPosition'
const DICTIONARY_TTL = 30 * 24 * 60 * 60 * 1000

export const useGetDictionarySecurityPosition = () => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: DICTIONARY_SECURITY_POSITION_KEY,
    queryFn: async () => {
      const response = await securityPositionDictionaryApi.getSecurityPositionDictionary()
      const data = response?.data ?? response

      writeCachedData(data, DICTIONARY_SECURITY_POSITION_STORAGE_KEY)
      return data
    },
    initialData: () => {
      const cached = readCachedData(DICTIONARY_SECURITY_POSITION_STORAGE_KEY, DICTIONARY_TTL)
      if (cached) {
        queryClient.setQueryData(DICTIONARY_SECURITY_POSITION_KEY, cached)
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
