import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toaster } from '@/providers/chakraProvider/toaster'
import { objectApi } from '@/shared/api/object/object-api'
import { DICTIONARY_OBJECTS_KEY } from '@/features/dictionary/api/use-get-dictionary-objects'
import { useDictionaryCacheReset } from '@/features/dictionary/hooks/useDictionaryCacheReset'

export const usePostObject = () => {
  const queryClient = useQueryClient()

  const { resetDictionaryCache } = useDictionaryCacheReset()

  return useMutation({
    mutationFn: (data) => objectApi.postObject(data),
    onSuccess: (res) => {
      toaster.create({
        title: 'Успешно',
        description: res?.message || 'Объект добавлен',
        type: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      queryClient.invalidateQueries({
        queryKey: ['calendar-allObjects'],
      })
      resetDictionaryCache([DICTIONARY_OBJECTS_KEY])
    },
    onError: (err) => {
      console.log(err)
      toaster.create({
        title: 'Ошибка',
        description: err.response?.data?.message || err?.message,
        type: 'error',
      })
    },
  })
}
