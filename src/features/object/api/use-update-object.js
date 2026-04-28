import { useMutation, useQueryClient } from '@tanstack/react-query'
import { objectApi } from '@/shared/api/object/object-api'
import { toaster } from '@/providers/chakraProvider/toaster'
import { useDictionaryCacheReset } from '@/features/dictionary/hooks/useDictionaryCacheReset'
import { DICTIONARY_OBJECTS_KEY } from '@/features/dictionary/api/use-get-dictionary-objects'

export const useUpdateObject = () => {
  const queryClient = useQueryClient()

  const { resetDictionaryCache } = useDictionaryCacheReset()

  return useMutation({
    mutationFn: ({ id, data }) => objectApi.updateObject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      resetDictionaryCache([DICTIONARY_OBJECTS_KEY])
      toaster.create({
        title: 'Успешно',
        description: 'Данные объекта изменены',
        type: 'success',
      })
    },
  })
}
