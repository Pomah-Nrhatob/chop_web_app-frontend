'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { writeCachedData } from '@/features/dictionary/helpers/writeCachedData'
import { readCachedData } from '@/features/dictionary/helpers/readCachedData'
import { objectDictionaryApi } from '@/shared/api/dictionary/object-dictionary'

export const DICTIONARY_OBJECTS_KEY = ['dictionary', 'objects']
const DICTIONARY_OBJECTS_STORAGE_KEY = 'dictionary:objects'
const DICTIONARY_TTL = 30 * 60 * 1000

export const useGetDictionaryObjects = () => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: DICTIONARY_OBJECTS_KEY,
    queryFn: async () => {
      const response = await objectDictionaryApi.getObjectDictionary()
      const data = response?.data ?? response

      writeCachedData(data, DICTIONARY_OBJECTS_STORAGE_KEY)
      return data
    },
    initialData: () => {
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
