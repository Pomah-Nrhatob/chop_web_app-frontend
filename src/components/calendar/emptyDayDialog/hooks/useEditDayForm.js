import { useCreateManySecurityWorkdays } from '@/features/calendar/api/use-create-many-security-workdays'
import { useDeleteManySecurityWorkdays } from '@/features/calendar/api/use-delete-many-security-workdays'
import { useUpdateManySecurityWorkdays } from '@/features/calendar/api/use-update-many-security-workdays'
import { editDaySchema } from '@/features/calendar/model/edit-day-schema'
import { toaster } from '@/providers/chakraProvider/toaster'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

export const useEditDayForm = (initialData, onSuccess = null, onSuccessError = null) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const createMutation = useCreateManySecurityWorkdays()
  const updateMutation = useUpdateManySecurityWorkdays()
  const deleteMutation = useDeleteManySecurityWorkdays()

  const queryClient = useQueryClient()

  // Подготовка defaultValues
  const defaultValues = {
    newWorkdays: [],
    updatedWorkdays: [],
    deletedWorkdays: [],
    ...initialData,
  }

  const {
    register,
    handleSubmit,
    reset: resetForm,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    getValues,
    trigger,
    clearErrors,
  } = useForm({
    resolver: zodResolver(editDaySchema),
    defaultValues,
    mode: 'onBlur',
  })

  // Добавление нового рабочего дня
  const addNewWorkday = (workday) => {
    const currentNew = getValues('newWorkdays') || []
    const newWorkdayWithId = {
      ...workday,
      id: workday.id || `new-${Date.now()}`, // Временный ID только для клиентской обработки
    }
    setValue('newWorkdays', [...currentNew, newWorkdayWithId])
    return newWorkdayWithId.id // Возвращаем временный ID для дальнейшего использования
  }

  // Удаление нового рабочего дня (еще не сохраненного)
  const removeNewWorkday = (id) => {
    const currentNew = getValues('newWorkdays') || []
    setValue(
      'newWorkdays',
      currentNew.filter((w) => w.id !== id)
    )
  }

  // Пометить существующий день на удаление
  const markForDeletion = (id) => {
    const currentDeleted = getValues('deletedWorkdays') || []

    if (currentDeleted.includes(id)) {
      // Если уже помечен, убираем из списка удаления
      setValue(
        'deletedWorkdays',
        currentDeleted.filter((delId) => delId !== id)
      )
    } else {
      // Помечаем на удаление
      setValue('deletedWorkdays', [...currentDeleted, id])

      // Если это новый день, убираем его из списка новых
      const isNew = getValues(`newWorkdays`).find((w) => w.id === id)
      if (isNew) {
        setValue(
          'newWorkdays',
          getValues('newWorkdays').filter((w) => w.id !== id)
        )
      } else {
        // Для существующих дней убираем из списка обновлений
        const currentUpdated = getValues('updatedWorkdays') || []
        setValue(
          'updatedWorkdays',
          currentUpdated.filter((w) => w.id !== id)
        )
      }
    }
  }

  // Обновление рабочего дня (работает как с новыми, так и с существующими)
  const updateWorkday = (id, data) => {
    const isNew = String(id).startsWith('new-')

    if (isNew) {
      // Обновление нового рабочего дня
      const currentNew = getValues('newWorkdays') || []
      const index = currentNew.findIndex((w) => w.id === id)

      if (index >= 0) {
        const updated = [...currentNew]
        updated[index] = { ...updated[index], ...data }
        setValue('newWorkdays', updated)

        // Мгновенная проверка валидации для этого элемента
        trigger(`newWorkdays.${index}`)
      }
    } else {
      // Обновление существующего рабочего дня
      const currentUpdated = getValues('updatedWorkdays') || []
      const index = currentUpdated.findIndex((w) => w.id === id)

      if (index >= 0) {
        const updated = [...currentUpdated]
        updated[index] = { ...updated[index], ...data }
        setValue('updatedWorkdays', updated)
      } else {
        setValue('updatedWorkdays', [...currentUpdated, { id, ...data }])
      }
    }
  }

  // Подготовка данных для отправки на сервер
  const prepareSubmitData = () => {
    const formData = getValues()

    // Подготовка данных для создания (новые записи)
    // ВАЖНО: удаляем временные ID из новых записей перед отправкой
    const createData =
      formData.newWorkdays.length > 0
        ? {
            workdays: formData.newWorkdays.map(({ id, ...rest }) => rest),
          }
        : null

    // Подготовка данных для обновления (существующие записи)
    const updateData =
      formData.updatedWorkdays.length > 0
        ? {
            workdays: formData.updatedWorkdays,
          }
        : null

    // Подготовка данных для удаления
    const deleteData =
      formData.deletedWorkdays.length > 0
        ? {
            ids: formData.deletedWorkdays,
          }
        : null

    return { createData, updateData, deleteData }
  }

  // Основная функция отправки
  const onSubmit = async (formData) => {
    setIsProcessing(true)
    try {
      // Проверяем валидность формы перед отправкой
      const isValid = await trigger()
      if (!isValid) {
        throw new Error('Форма содержит ошибки. Пожалуйста, проверьте все поля.')
      }

      const { createData, updateData, deleteData } = prepareSubmitData()
      const requests = []
      const requestKeys = []

      // Создание новых записей
      if (createData) {
        requests.push(createMutation.mutateAsync(createData))
        requestKeys.push('create')
      }

      // Обновление существующих записей
      if (updateData) {
        requests.push(updateMutation.mutateAsync(updateData))
        requestKeys.push('update')
      }

      // Удаление записей
      if (deleteData) {
        requests.push(deleteMutation.mutateAsync(deleteData))
        requestKeys.push('delete')
      }

      if (requests.length === 0) {
        // Нет ни одного действия
        toaster.create({
          title: 'Нет изменений',
          description: 'Нечего сохранять.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
        return false
      }

      // Выполняем все запросы параллельно
      const results = await Promise.allSettled(requests)

      const fulfilledCount = results.filter((r) => r.status === 'fulfilled').length
      const rejectedCount = results.filter((r) => r.status === 'rejected').length

      if (fulfilledCount > 0 && rejectedCount > 0) {
        // Есть и успехи, и ошибки
        toaster.create({
          title: 'Частичный успех',
          description: `Выполнено: ${fulfilledCount}, ошибок: ${rejectedCount}`,
          type: 'success',
          duration: 4000,
          isClosable: true,
        })
        if (onSuccessError) {
          onSuccessError()
        }
        // Не вызываем onSuccess
        queryClient.invalidateQueries({ queryKey: ['oneObjectWorkdayInfo'] })
        return false
      }

      if (fulfilledCount === 0) {
        // Все запросы провалились
        toaster.create({
          title: 'Ошибка при сохранении',
          description: 'Не удалось выполнить ни одного действия.',
          type: 'error',
          duration: 4000,
          isClosable: true,
        })
        if (onSuccessError) {
          onSuccessError()
        }
        // Не вызываем onSuccess
        return false
      }

      // Все запросы прошли успешно
      if (fulfilledCount > 0 && rejectedCount === 0) {
        toaster.create({
          title: 'Успешно',
          description: `Изменения успешно сохранены`,
          duration: 4000,
          type: 'success',
          isClosable: true,
        })
        // Вызываем колбэк успеха
        if (onSuccess) {
          onSuccess()
        }

        queryClient.invalidateQueries({ queryKey: ['oneObjectWorkdayInfo'] })
        queryClient.invalidateQueries({ queryKey: ['calendar-allObjects'] })
      }

      return true
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error)
      toaster.create({
        title: 'Ошибка',
        description: error.message || 'Произошла ошибка при сохранении',
        type: 'error',
        duration: 4000,
        isClosable: true,
      })
      throw error
    } finally {
      setIsProcessing(false)
    }
  }

  const isMarkedForDeletion = useCallback((id) => {
    return getValues('deletedWorkdays').includes(id)
  }, [])

  // Функция для получения обновлённого объекта
  const getUpdatedWorkday = useCallback((id) => {
    return getValues('updatedWorkdays').find((w) => w.id === id)
  }, [])

  // Функция для получения новых
  const isNewWorkday = useCallback((id) => {
    return String(id).startsWith('new-')
  }, [])

  return {
    register,
    handleSubmit: (onValid) =>
      handleSubmit((data) => onSubmit(data).then((valid) => valid && onValid?.())),
    errors,
    onSubmit,
    setValue,
    control,
    watch,
    resetForm,
    isSubmitting: isSubmitting || isProcessing,
    addNewWorkday,
    removeNewWorkday,
    markForDeletion,
    updateWorkday,
    getValues,
    prepareSubmitData,
    trigger,
    clearErrors,
    isMarkedForDeletion,
    getUpdatedWorkday,
    isNewWorkday,
    isProcessing,
  }
}
