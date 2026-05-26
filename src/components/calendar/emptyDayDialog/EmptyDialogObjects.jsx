'use client'

import React, { useEffect } from 'react'
import { useScheduleForm } from '@/components/calendar/emptyDayDialog/hooks/useScheduleForm'
import SelectObject from '@/features/dictionary/components/selectWithSearch/SelectObject'
import SelectSecurity from '@/features/dictionary/components/selectWithSearch/SelectSecurity'
import {
  Button,
  createListCollection,
  Dialog,
  Flex,
  Portal,
  Select,
  Text,
  Badge,
  Heading,
  Box,
} from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { format, formatISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { WORKDAY_OPTIONS } from '@/components/calendar/data/workday-options'

export default function EmptyDayDialogObjects({
  open,
  setOpen,
  setEmptyDayInfo,
  emptyDayInfo,
  onSuccessAction,
}) {
  // Достаем из метаданных массив dates и objectId объекта безопасности
  const { objectId, securities, dates = [] } = emptyDayInfo

  // Передаем onSuccess колбэк в ваш хук формы, чтобы закрыть окно и сбросить выделение в календаре
  const { isCreating, handleSubmit, onSubmit, control, resetForm, setValue } = useScheduleForm(
    null,
    () => {
      setOpen(false)
      if (onSuccessAction) onSuccessAction() // Очищает синюю панель в календаре
    }
  )

  // СИНХРОНИЗАЦИЯ ДАННЫХ С ФОРМОЙ
  useEffect(() => {
    if (open && dates.length > 0) {
      // Преобразуем каждую выделенную дату в формат ISO строки для отправки бэкенду
      const isoTimestamps = dates.map((date) => {
        const d = new Date(date)
        // Создаем чистую дату в UTC (00:00:00) без смещения локального часового пояса
        const utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0))
        return utcDate.toISOString()
      })

      // Записываем массив строк в поле timestamps формы
      setValue('timestamps', isoTimestamps)
    }

    if (open && objectId !== undefined) {
      setValue('securityObjectId', objectId)
    }

    if (open && securities) {
      setValue('securities', securities)
    }
  }, [open, dates, objectId, securities, setValue])

  // Создаем коллекцию из значений для селекта Chakra UI v3
  const collection = createListCollection({
    items: Object.values(WORKDAY_OPTIONS),
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  // Красиво форматируем выбранные даты для вывода пользователю в интерфейсе
  const renderFormattedDates = () => {
    if (!dates || dates.length === 0) return 'Даты не выбраны'

    // Сортируем по возрастанию перед выводом
    const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b))

    if (sortedDates.length === 1) {
      return format(new Date(sortedDates[0]), 'd MMMM yyyy г.', { locale: ru })
    }

    // Если дней много, выводим их компактным списком через запятую (например: "15.05, 16.05, 17.05")
    return sortedDates.map((d) => format(new Date(d), 'dd.MM')).join(', ')
  }

  return (
    <Dialog.Root
      initialFocusEl={null}
      onExitComplete={() => {
        setEmptyDayInfo({})
        resetForm()
      }}
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          alignItems={{ base: 'center', md: 'flex-start' }}
          justifyContent="center"
        >
          <Dialog.Content
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            w={{ base: 'calc(100vw - 32px)', md: '500px' }}
            maxW="500px"
          >
            <Dialog.Header pb={0}>
              <Flex direction="column" gap={2}>
                <Heading size="md">Создание расписания</Heading>
                <Badge colorPalette="blue" alignSelf="flex-start">
                  Массовая настройка ({dates.length} дн.)
                </Badge>
              </Flex>
              <Dialog.CloseTrigger position="absolute" top="2" right="2" />
            </Dialog.Header>

            <Box px={6} py={2}>
              <Flex
                align="center"
                justify="space-between"
                mb={4}
                p={3}
                bg="gray.50"
                borderRadius="md"
              >
                <Text fontSize="sm" color="gray.700" noOfLines={2}>
                  <strong>Выбранные дни:</strong> {renderFormattedDates()}
                </Text>
                <Badge colorPalette="green" variant="solid">
                  Пакет
                </Badge>
              </Flex>

              <Text fontSize="sm" color="gray.600" mb={4}>
                Укажите параметры расписания. Выбранные настройки будут применены одновременно ко
                всем выделенным дням.
              </Text>
            </Box>

            <Dialog.Body px={6} pb={6}>
              <Flex flexDirection="column" gap={5}>
                {/* Выбор объекта безопасности */}
                <Controller
                  control={control}
                  name="securityObjectId"
                  rules={{ required: 'Объект безопасности обязателен' }}
                  render={({ field, fieldState }) => (
                    <SelectObject
                      label={
                        <Text fontWeight="medium" mb={2}>
                          Объект безопасности
                          {!field.value && (
                            <Text as="span" color="red.500" ml={1}>
                              *
                            </Text>
                          )}
                        </Text>
                      }
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error}
                      isDisabled={!!objectId} // Если зашли из конкретного объекта, поле заблокировано
                      placeholder="Выберите объект безопасности"
                    />
                  )}
                />

                {/* Выбор охранников */}
                <Controller
                  control={control}
                  name="securities"
                  rules={{ required: 'Охранники обязательны' }}
                  render={({ field, fieldState }) => (
                    <SelectSecurity
                      label={
                        <Text fontWeight="medium" mb={2}>
                          Охранники
                          {!field.value?.length && (
                            <Text as="span" color="red.500" ml={1}>
                              *
                            </Text>
                          )}
                        </Text>
                      }
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error}
                      placeholder="Выберите охранников"
                    />
                  )}
                />

                {/* Выбор типа рабочего дня */}
                <Controller
                  control={control}
                  name="workdayStatus"
                  rules={{ required: 'Тип дня обязателен' }}
                  render={({ field, fieldState }) => {
                    return (
                      <div>
                        <Text fontWeight="medium" mb={2}>
                          Тип дня
                          {!field.value && (
                            <Text as="span" color="red.500" ml={1}>
                              *
                            </Text>
                          )}
                        </Text>

                        <Select.Root
                          collection={collection}
                          value={field.value ? [field.value] : []}
                          onValueChange={(details) => {
                            field.onChange(details.value[0])
                          }}
                        >
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Выберите тип дня" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>

                          <Select.Positioner>
                            <Select.Content>
                              {collection.items.map((item) => (
                                <Select.Item key={item.value} item={item}>
                                  <Select.ItemText>{item.label}</Select.ItemText>
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                        {fieldState.error && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {fieldState.error.message}
                          </Text>
                        )}
                      </div>
                    )
                  }}
                />
              </Flex>
            </Dialog.Body>

            <Dialog.Footer px={6} pb={6} pt={0}>
              <Dialog.ActionTrigger asChild>
                <Button disabled={isCreating} variant="outline" type="button">
                  Отменить
                </Button>
              </Dialog.ActionTrigger>
              <Button loading={isCreating} colorPalette="blue" type="submit">
                Сохранить расписание
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
