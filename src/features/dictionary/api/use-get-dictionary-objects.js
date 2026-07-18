'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { writeCachedData } from '@/features/dictionary/helpers/writeCachedData'
import { readCachedData } from '@/features/dictionary/helpers/readCachedData'
import { objectDictionaryApi } from '@/shared/api/dictionary/object-dictionary'

export const DICTIONARY_OBJECTS_KEY = ['dictionary', 'objects']
const DICTIONARY_OBJECTS_STORAGE_KEY = 'dictionary:objects'
const DICTIONARY_TTL = 30 * 60 * 1000
export const DICTIONARY_COMPANY_STORAGE_KEY = 'dictionary:companyId'
export const DICTIONARY_COMPANY_ID_KEY = ['dictionary', 'companyId']

export const useGetDictionaryObjects = (companyId) => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: DICTIONARY_OBJECTS_KEY,
    queryFn: async () => {
      const response = await objectDictionaryApi.getObjectDictionary()
      const data = response?.data
      const companyId = response?.companyId

      if (companyId) {
        localStorage.setItem(DICTIONARY_COMPANY_STORAGE_KEY, companyId)
      }

      writeCachedData(data, DICTIONARY_OBJECTS_STORAGE_KEY)
      return data
    },
    initialData: () => {
      if (typeof window === 'undefined') {
        return undefined
      }
      const cachedCompanyId = localStorage.getItem(DICTIONARY_COMPANY_STORAGE_KEY)

      // Если компания изменилась — не используем кеш
      if (companyId && cachedCompanyId !== companyId) {
        return undefined
      }
      const cached = readCachedData(DICTIONARY_OBJECTS_STORAGE_KEY, DICTIONARY_TTL)
      if (cached) {
        queryClient.setQueryData(DICTIONARY_OBJECTS_KEY, cached)
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
