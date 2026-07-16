import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { WORKDAY_OPTIONS } from '@/components/calendar/data/workday-options'

import {
  Button,
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Dialog,
  Portal,
  createListCollection,
} from '@chakra-ui/react'
import {
  SelectRoot,
  SelectControl,
  SelectTrigger,
  SelectValueText,
  SelectIndicatorGroup,
  SelectIndicator,
  SelectPositioner,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from '@chakra-ui/react'
import { useScheduleForm } from './hooks/useScheduleForm'
import SelectSecurityDisabled from '@/features/dictionary/components/selectWithSearch/SelectSecurityDisabled'
import SelectOneObject from '@/features/dictionary/components/selectWithSearch/SelectOneObject'
import ScheduleConflictDialog from '@/components/calendar/emptyDayDialog/scheduleConflictDialog/ScheduleConflictDialog'

export default function EmptyDayDialogSecurities({
  open,
  setOpen,
  emptyDayInfo,
  setEmptyDayInfo,
  onSuccessAction,
}) {
  // Достаем переданные даты и ID фиксированного охранника
  const { securityId, dates = [] } = emptyDayInfo

  const [conflict, setConflict] = useState(null)
  const [isConflictOpen, setIsConflictOpen] = useState(false)

  const { isCreating, handleSubmit, onSubmit, control, resetForm, setValue } = useScheduleForm(
    null,
    () => {
      setOpen(false)
      if (onSuccessAction) onSuccessAction()
    }
  )

  // Автоматическое заполнение формы при открытии
  useEffect(() => {
    if (open && dates.length > 0) {
      const isoTimestamps = dates.map((date) => {
        const d = new Date(date)
        const utcDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0))
        return utcDate.toISOString()
      })
      setValue('timestamps', isoTimestamps)
    }

    // Фиксируем ID текущего охранника в форме (передаем массивом, если бэкенд ждет массив)
    if (open && securityId !== undefined) {
      setValue('securities', [securityId])
    }
  }, [open, dates, securityId, setValue])

  const collection = createListCollection({
    items: Object.values(WORKDAY_OPTIONS),
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  const renderFormattedDates = () => {
    if (!dates || dates.length === 0) return 'Даты не выбраны'
    const sortedDates = [...dates].sort((a, b) => new Date(a) - new Date(b))
    if (sortedDates.length === 1) {
      return format(new Date(sortedDates[0]), 'd MMMM yyyy г.', { locale: ru })
    }
    return sortedDates.map((d) => format(new Date(d), 'dd.MM')).join(', ')
  }

  const handleCreate = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (err) {
      if (err.status === 409) {
        setConflict(err)
        setIsConflictOpen(true)
        return
      }
    }
  })

  return (
    <>
      <Dialog.Root
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
              onSubmit={handleCreate}
              w={{ base: 'calc(100vw - 32px)', md: '500px' }}
              maxW="500px"
            >
              <Dialog.Header pb={0}>
                <Flex direction="column" gap={2}>
                  <Heading size="md">Назначение объекта охраннику</Heading>
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
              </Box>

              <Dialog.Body px={6} pb={6}>
                <Flex flexDirection="column" gap={5}>
                  {/* 1. Выбор охранника — ЗАФИКСИРОВАН И ЗАБЛОКИРОВАН */}
                  <Controller
                    control={control}
                    name="securities"
                    rules={{ required: 'Охранник обязателен' }}
                    render={({ field, fieldState }) => (
                      <SelectSecurityDisabled
                        label={
                          <Text fontWeight="medium" mb={2}>
                            Охранник
                            {/* Звездочка показывается, если значение пустое */}
                            {(!field.value || field.value?.length === 0) && (
                              <Text as="span" color="red.500" ml={1}>
                                *
                              </Text>
                            )}
                          </Text>
                        }
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error}
                        // Сделано точно так же, как в SelectObject
                        isDisabled={!!securityId}
                        placeholder="Выберите охранника"
                      />
                    )}
                  />

                  {/* 2. Выбор объекта безопасности — ТОЛЬКО ОДИН */}
                  <Controller
                    control={control}
                    name="securityObjectId"
                    rules={{ required: 'Объект безопасности обязателен' }}
                    render={({ field, fieldState }) => (
                      <div>
                        <Text fontWeight="medium" mb={2}>
                          Объект охраны
                          {!field.value && (
                            <Text as="span" color="red.500" ml={1}>
                              *
                            </Text>
                          )}
                        </Text>

                        {/* Вызываем наш очищенный компонент */}
                        <SelectOneObject
                          value={field.value} // Примет число или null
                          onChange={field.onChange} // Вернет число или null
                          error={fieldState.error}
                        />
                      </div>
                    )}
                  />
                  {/* 3. Выбор типа рабочего дня */}
                  <Controller
                    control={control}
                    name="workdayStatus"
                    rules={{ required: 'Тип дня обязателен' }}
                    render={({ field, fieldState }) => (
                      <div>
                        <Text fontWeight="medium" mb={2}>
                          Тип дня
                          {!field.value && (
                            <Text as="span" color="red.500" ml={1}>
                              *
                            </Text>
                          )}
                        </Text>

                        {/* ИСПРАВЛЕНО: Заменили Select.Root на SelectRoot и т.д. */}
                        <SelectRoot
                          collection={collection}
                          value={field.value ? [field.value] : []}
                          onValueChange={(details) => field.onChange(details.value[0])}
                        >
                          <SelectControl>
                            <SelectTrigger>
                              <SelectValueText placeholder="Выберите тип дня" />
                            </SelectTrigger>
                            <SelectIndicatorGroup>
                              <SelectIndicator />
                            </SelectIndicatorGroup>
                          </SelectControl>

                          <SelectPositioner>
                            <SelectContent>
                              {collection.items.map((item) => (
                                <SelectItem key={item.value} item={item}>
                                  <SelectItemText>{item.label}</SelectItemText>
                                  <SelectItemIndicator />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </SelectPositioner>
                        </SelectRoot>

                        {fieldState.error && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {fieldState.error.message}
                          </Text>
                        )}
                      </div>
                    )}
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

      <ScheduleConflictDialog
        open={isConflictOpen}
        conflict={conflict}
        onClose={() => setIsConflictOpen(false)}
        onExitComplete={() => setConflict(null)}
      />
    </>
  )
}
