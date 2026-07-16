import { useUpdateManySecurityWorkdays } from '@/features/calendar/api/use-update-many-security-workdays'
import { editDaySchema } from '@/features/calendar/model/edit-day-schema'
import { toaster } from '@/providers/chakraProvider/toaster'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'

export const useEditDaysAllObjectsForm = (initialData, onSuccess = null) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const [alertMessage, setAlertMessage] = useState('')

  const updateMutation = useUpdateManySecurityWorkdays()

  const queryClient = useQueryClient()

  const defaultValues = {
    updatedWorkdays: [],
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

  // Обновление рабочего дня (работает как с новыми, так и с существующими)
  const updateWorkday = (id, data) => {
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

  // Подготовка данных для отправки на сервер
  const prepareSubmitData = () => {
    const formData = getValues()

    const updateData =
      formData.updatedWorkdays.length > 0
        ? {
            workdays: formData.updatedWorkdays,
          }
        : null

    return { updateData }
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

      const { updateData } = prepareSubmitData()
      const requests = []
      const requestKeys = []

      // Обновление существующих записей
      if (updateData) {
        requests.push(updateMutation.mutateAsync(updateData))
        requestKeys.push('update')
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

      if (fulfilledCount > 0 && rejectedCount === 0) {
        toaster.create({
          title: 'Успешно',
          description: `Изменения успешно сохранены`,
          duration: 4000,
          type: 'success',
          isClosable: true,
        })
        if (onSuccess) {
          onSuccess()
        }

        queryClient.invalidateQueries({ queryKey: ['oneObjectWorkdayInfo'] })
        queryClient.invalidateQueries({ queryKey: ['calendar-allObjects'] })
        queryClient.invalidateQueries({ queryKey: ['calendar-oneDay'] })
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

  // Функция для получения обновлённого объекта
  const getUpdatedWorkday = useCallback((id) => {
    return getValues('updatedWorkdays').find((w) => w.id === id)
  }, [])

  const clearUpdateForm = () => {
    resetForm({ updatedWorkdays: [] })
  }

  // Проставить поле сразу всем сменам
  const updateAllWorkdays = (workdays, field, value = true) => {
    const currentUpdated = getValues('updatedWorkdays') || []

    const updatedMap = new Map(currentUpdated.map((item) => [item.id, item]))

    workdays.forEach((workday) => {
      updatedMap.set(workday.id, {
        ...updatedMap.get(workday.id),
        id: workday.id,
        [field]: value,
      })
    })

    setValue('updatedWorkdays', Array.from(updatedMap.values()))
  }

  const startAllWorkdays = (workdays) => {
    updateAllWorkdays(workdays, 'isStarted')

    setAlertMessage(`Все смены отмечены начатыми. Кол-во: ${workdays.length}`)

    setTimeout(() => {
      setAlertMessage('')
    }, 3000)
  }

  const finishAllWorkdays = (workdays) => {
    updateAllWorkdays(workdays, 'isFinished')

    setAlertMessage(`Все смены отмечены завершенными. Кол-во: ${workdays.length}`)

    setTimeout(() => {
      setAlertMessage('')
    }, 3000)
  }

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
    updateWorkday,
    getValues,
    prepareSubmitData,
    trigger,
    clearErrors,
    getUpdatedWorkday,
    isProcessing,
    clearUpdateForm,
    startAllWorkdays,
    finishAllWorkdays,
    alertMessage,
  }
}
