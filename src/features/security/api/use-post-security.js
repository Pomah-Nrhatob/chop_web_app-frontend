import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toaster } from '@/providers/chakraProvider/toaster'
import { securityApi } from '@/shared/api/security/security-api'
import { useDictionaryCacheReset } from '@/features/dictionary/hooks/useDictionaryCacheReset'
import { DICTIONARY_SECURITIES_KEY } from '@/features/dictionary/api/use-get-dictionary-securities'

export const usePostSecurity = () => {
  const queryClient = useQueryClient()

  const { resetDictionaryCache } = useDictionaryCacheReset()

  return useMutation({
    mutationFn: (data) => securityApi.postSecurity(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно',
        description: res?.message || 'Охранник добавлен',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['securities'] })
      resetDictionaryCache([DICTIONARY_SECURITIES_KEY])
    },
    onError: (err) => {
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message,
        type: 'error',
      })
    },
  })
}
