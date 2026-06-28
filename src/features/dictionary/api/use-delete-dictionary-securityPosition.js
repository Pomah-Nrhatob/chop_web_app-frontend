'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DICTIONARY_SECURITY_POSITION_KEY } from '@/features/dictionary/api/use-get-dictionary-securityPosition'
import { securityPositionDictionaryApi } from '@/shared/api/dictionary/securityPosition-dictionary'
import { toaster } from '@/providers/chakraProvider/toaster'

export const useDeleteDictionarySecurityPosition = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => securityPositionDictionaryApi.deleteSecurityPositionDictionary(id),

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: DICTIONARY_SECURITY_POSITION_KEY,
      })

      toaster.create({
        title: 'Успешно',
        description: res?.message || 'Должность успешно удалена из списка',
        type: 'success',
      })
    },

    onError: (err) => {
      console.log(err)
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message,
        type: 'error',
      })
    },
  })
}
