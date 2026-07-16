import { useScheduleForm } from '@/components/calendar/emptyDayDialog/hooks/useScheduleForm'
import SelectObject from '@/features/dictionary/components/selectWithSearch/SelectObject'
import SelectSecurity from '@/features/dictionary/components/selectWithSearch/SelectSecurity'
import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  Text,
  Badge,
  Heading,
  Box,
} from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import SelectTypeDay from '@/components/calendar/components/SelectTypeDay'
import ScheduleConflictDialog from '@/components/calendar/emptyDayDialog/scheduleConflictDialog/ScheduleConflictDialog'

export default function emptyDayDialog({ open, setOpen, setEmptyDayInfo, emptyDayInfo }) {
  const { day, month, year, objectId, securities } = emptyDayInfo

  const [conflict, setConflict] = useState(null)
  const [isConflictOpen, setIsConflictOpen] = useState(false)

  const { isCreating, handleSubmit, errors, onSubmit, control, resetForm, setValue } =
    useScheduleForm(null, () => setOpen(false))

  useEffect(() => {
    if (open && day && month && year) {
      const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
      setValue('timestamps', [utcDate.toISOString()])
    }
    if (open && objectId !== undefined) {
      setValue('securityObjectId', objectId)
    }
    if (open && securities) {
      setValue('securities', securities)
    }
  }, [open, day, month, year, objectId, securities, setValue])

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

  // Форматируем дату для отображения
  const formattedDate =
    day && month && year
      ? format(new Date(year, month - 1, day), 'd MMMM yyyy г.', { locale: ru })
      : 'Неизвестная дата'

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
                  <Heading size="md">Создание расписания</Heading>
                  <Badge colorScheme="blue" alignSelf="flex-start">
                    Настройка дня
                  </Badge>
                </Flex>
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
                  <Text fontSize="sm" color="gray.700">
                    <strong>Дата:</strong> {formattedDate}
                  </Text>
                  <Badge colorScheme="green" variant="solid">
                    Пустой день
                  </Badge>
                </Flex>

                <Text fontSize="sm" color="gray.600" mb={4}>
                  Укажите параметры расписания для выбранного дня. Все поля обязательны для
                  заполнения.
                </Text>

                <Box divideX={4} />
              </Box>

              <Dialog.Body px={6} pb={6}>
                <Flex flexDirection="column" gap={5}>
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
                        isDisabled={!!objectId}
                        placeholder="Выберите объект безопасности"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="securities"
                    rules={{ required: 'Охранники обязательны' }}
                    render={({ field, fieldState }) => (
                      <SelectSecurity
                        objectId={objectId}
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

                  <SelectTypeDay control={control} />
                </Flex>
              </Dialog.Body>

              <Dialog.Footer px={6} pb={6} pt={0}>
                <Dialog.ActionTrigger asChild>
                  <Button disabled={isCreating} variant="outline" type="button">
                    Отменить
                  </Button>
                </Dialog.ActionTrigger>

                <Button loading={isCreating} disabled={isCreating} type="submit">
                  Создать расписание
                </Button>
              </Dialog.Footer>

              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top={3} right={3} />
              </Dialog.CloseTrigger>
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
