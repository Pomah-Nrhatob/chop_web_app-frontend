'use client'

import { useQueryClient } from '@tanstack/react-query'

export const useDictionaryCacheReset = () => {
  const queryClient = useQueryClient()

  const resetDictionaryCache = async (queryKeys) => {
    for (const queryKey of queryKeys) {
      await queryClient.cancelQueries({ queryKey, exact: true })
      queryClient.removeQueries({ queryKey, exact: true })

      const storageKey = `dictionary:${queryKey.slice(1).join(':')}`
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey)
      }
    }
  }

  return { resetDictionaryCache }
}
