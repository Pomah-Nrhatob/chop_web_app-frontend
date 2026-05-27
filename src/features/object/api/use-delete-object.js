// src/features/object/api/use-delete-object.js
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { objectApi } from '@/shared/api/object/object-api'
import { toaster } from '@/providers/chakraProvider/toaster'
import { useDictionaryCacheReset } from '@/features/dictionary/hooks/useDictionaryCacheReset'
import { DICTIONARY_OBJECTS_KEY } from '@/features/dictionary/api/use-get-dictionary-objects'

// 1. Добавляем аргумент onSuccessCallback
export const useDeleteObject = (onSuccessCallback) => {
  const queryClient = useQueryClient()

  const { resetDictionaryCache } = useDictionaryCacheReset()

  return useMutation({
    mutationFn: (id) => objectApi.deleteObject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      queryClient.invalidateQueries({
        queryKey: ['calendar-allObjects'],
      })
      resetDictionaryCache([DICTIONARY_OBJECTS_KEY])

      toaster.create({
        title: 'Удалено',
        description: 'Объект успешно удален из базы',
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
