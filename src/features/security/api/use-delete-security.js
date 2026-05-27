// features/security/api/use-delete-security.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { securityApi } from '@/shared/api/security/security-api'
import { toaster } from '@/providers/chakraProvider/toaster'
import { useDictionaryCacheReset } from '@/features/dictionary/hooks/useDictionaryCacheReset'
import { DICTIONARY_SECURITIES_KEY } from '@/features/dictionary/api/use-get-dictionary-securities'

export const useDeleteSecurity = (onSuccessCallback) => {
  const queryClient = useQueryClient()

  const { resetDictionaryCache } = useDictionaryCacheReset()

  return useMutation({
    mutationFn: (id) => securityApi.deleteSecurity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securities'] })
      resetDictionaryCache([DICTIONARY_SECURITIES_KEY])
      toaster.create({
        title: 'Удалено',
        description: 'Охранник успешно удален из базы',
        type: 'success',
      })
      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (err) => {
      toaster.create({
        title: 'Ошибка',
        description: err.message || 'Не удалось удалить объект',
        type: 'error',
      })
    },
  })
}
