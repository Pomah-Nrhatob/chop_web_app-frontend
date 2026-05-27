import { useMutation, useQueryClient } from '@tanstack/react-query'
import { securityApi } from '@/shared/api/security/security-api'
import { toaster } from '@/providers/chakraProvider/toaster'
import { useDictionaryCacheReset } from '@/features/dictionary/hooks/useDictionaryCacheReset'
import { DICTIONARY_SECURITIES_KEY } from '@/features/dictionary/api/use-get-dictionary-securities'

export const useUpdateSecurity = () => {
  const queryClient = useQueryClient()

  const { resetDictionaryCache } = useDictionaryCacheReset()

  return useMutation({
    mutationFn: ({ id, data }) => securityApi.updateSecurity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securities'] })
      resetDictionaryCache([DICTIONARY_SECURITIES_KEY])
      toaster.create({
        title: 'Усрешно',
        description: 'Данные охранника изменены',
        type: 'success',
      })
    },
  })
}
