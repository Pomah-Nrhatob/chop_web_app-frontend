import { useEditDayForm } from '@/components/calendar/emptyDayDialog/hooks/useEditDayForm'
import { useGetOneObjectWorkday } from '@/features/calendar/api/use-getOneObjectWorkday'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import SecurityDayInfo from '@/components/calendar/oneDayDialog/SecurityDayInfo'
import { WORKDAY_OPTIONS } from '@/components/calendar/data/workday-options'
import { useWatch } from 'react-hook-form'
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
  VStack,
  HStack,
  Badge,
  Card,
  Grid,
  GridItem,
  IconButton,
  Alert,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState, useMemo } from 'react'
import { IoIosAdd } from 'react-icons/io'

export default function OneDayDialog({ open, setOpen, selectedWorkday, setSelectedWorkday }) {
  const [isEditing, setIsEditing] = useState(false)

  const { isLoading, oneObjectWorkdayInfo, isFetching } = useGetOneObjectWorkday(selectedWorkday, {
    enabled: !!selectedWorkday && open,
  })

  const {
    addNewWorkday,
    markForDeletion,
    updateWorkday,
    handleSubmit,
    resetForm,
    removeNewWorkday,
    control,
    errors,
    isProcessing,
  } = useEditDayForm(
    {},
    () => {
      resetForm()
      setIsEditing(false)
    },
    () => {
      resetForm()
      setIsEditing(false)
    }
  )

  // Функция для извлечения сообщений об ошибках
  const getErrorMessages = () => {
    const messages = []

    if (errors.newWorkdays && Array.isArray(errors.newWorkdays)) {
      errors.newWorkdays.forEach((workdayErrors, index) => {
        if (workdayErrors) {
          Object.entries(workdayErrors).forEach(([field, fieldError]) => {
            if (fieldError?.message) {
              messages.push(`Новый сотрудник ${index + 1}: ${fieldError.message}`)
            }
          })
        }
      })
    }

    if (errors.updatedWorkdays && Array.isArray(errors.updatedWorkdays)) {
      errors.updatedWorkdays.forEach((workdayErrors, index) => {
        if (workdayErrors) {
          Object.entries(workdayErrors).forEach(([field, fieldError]) => {
            if (fieldError?.message) {
              messages.push(`Обновленный сотрудник ${index + 1}: ${fieldError.message}`)
            }
          })
        }
      })
    }

    if (errors.deletedWorkdays && errors.deletedWorkdays.message) {
      messages.push(errors.deletedWorkdays.message)
    }

    return messages
  }

  const errorMessages = getErrorMessages()

  // Используем useWatch для получения данных формы
  const deletedWorkdays = useWatch({ name: 'deletedWorkdays', control }) || []
  const newWorkdays = useWatch({ name: 'newWorkdays', control }) || []
  const updatedWorkdays = useWatch({ name: 'updatedWorkdays', control }) || []

  // Используем useMemo для вычисления производных данных
  const deletedSet = useMemo(() => new Set(deletedWorkdays), [deletedWorkdays])
  const updatedMap = useMemo(() => {
    const map = new Map()
    updatedWorkdays.forEach((item) => {
      map.set(item.id, item)
    })
    return map
  }, [updatedWorkdays])

  const handleAddWorkday = (data) => {
    addNewWorkday(data)
  }

  const formatDate = (timestamp) => {
    try {
      return format(new Date(timestamp), 'dd MMMM yyyy г.', { locale: ru })
    } catch {
      return 'Неизвестная дата'
    }
  }

  const { data: objects = [], isLoading: loadingObjects } = useGetDictionaryObjects()
  const { isLoading: loadingSecurities } = useGetDictionarySecurities()

  const foundObject = objects.find((obj) => obj.id === oneObjectWorkdayInfo?.securityObjectId)

  const onSubmit = () => {
    console.log('submit')
  }

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      initialFocusEl={null}
      onExitComplete={() => {
        setSelectedWorkday(null)
        resetForm()
        setIsEditing(false)
      }}
      scrollBehavior="inside"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          display="flex"
          alignItems={{ base: 'flex-start', md: 'center' }}
          justifyContent="center"
          pt={{ base: 2, md: 0 }}
          px={{ base: 2, md: 0 }}
        >
          <Dialog.Content
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            w={{ base: 'calc(100vw - 16px)', md: '600px' }}
            maxW="600px"
            maxH={{ base: 'calc(100dvh - 72px)', md: '90dvh' }}
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            <Dialog.Header flex="0 0 auto">
              <Dialog.Title>Информация о рабочем дне</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top={3} right={3} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body flex="1 1 auto" overflowY="auto" overscrollBehavior="contain">
              {isLoading || isFetching || loadingObjects || loadingSecurities ? (
                <VStack justify="center" py={8}>
                  <Text>Загрузка данных...</Text>
                </VStack>
              ) : oneObjectWorkdayInfo ? (
                <VStack align="stretch" spacing={4}>
                  <Card.Root variant="outline">
                    <Card.Header pb={2}>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">
                          {formatDate(oneObjectWorkdayInfo.timestamp)}
                        </Text>
                      </HStack>
                    </Card.Header>
                    <Card.Body pt={2}>
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mb={4}>
                        <GridItem>
                          <Text fontSize="sm" color="gray.600">
                            Объект:
                          </Text>
                          <Text fontWeight="medium">
                            {foundObject
                              ? foundObject.title
                              : `Объект #${oneObjectWorkdayInfo.securityObjectId}`}
                          </Text>
                        </GridItem>
                      </Grid>
                    </Card.Body>
                  </Card.Root>

                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between" align="start" flexWrap="wrap" gap={2}>
                      <Text fontSize="lg" fontWeight="bold" color="gray.700">
                        Сотрудники ({oneObjectWorkdayInfo.securityWorkdays?.length || 0})
                      </Text>
                      <Badge
                        colorScheme={
                          oneObjectWorkdayInfo.securityWorkdays?.some((sw) => sw.isFinished)
                            ? 'green'
                            : 'gray'
                        }
                        variant="outline"
                      >
                        {oneObjectWorkdayInfo.securityWorkdays?.filter((sw) => sw.isFinished)
                          .length || 0}{' '}
                        завершили рабочий день
                      </Badge>
                    </HStack>

                    {oneObjectWorkdayInfo.securityWorkdays?.map((worker) => {
                      const isDeleted = deletedSet.has(worker.id)
                      const isUpdateWorkday = updatedMap.get(worker.id)

                      return (
                        <SecurityDayInfo
                          key={worker.id}
                          worker={isUpdateWorkday ? { ...worker, ...isUpdateWorkday } : worker}
                          isDeleted={isDeleted}
                          isEditing={isEditing}
                          addNewWorkday={addNewWorkday}
                          markForDeletion={markForDeletion}
                          updateWorkday={updateWorkday}
                          isEdited={!!isUpdateWorkday}
                        />
                      )
                    })}

                    {newWorkdays.length > 0 && (
                      <>
                        <Text fontSize="lg" fontWeight="bold" color="gray.700">
                          Добавленные сотрудники
                        </Text>

                        {newWorkdays.map((worker) => {
                          const isDeleted = deletedSet.has(worker.id)

                          return (
                            <SecurityDayInfo
                              key={worker.id}
                              worker={worker}
                              isDeleted={isDeleted}
                              isEditing={isEditing}
                              addNewWorkday={addNewWorkday}
                              markForDeletion={removeNewWorkday}
                              updateWorkday={updateWorkday}
                              isNewWorkday
                            />
                          )
                        })}
                      </>
                    )}

                    {(!oneObjectWorkdayInfo.securityWorkdays ||
                      oneObjectWorkdayInfo.securityWorkdays.length === 0) && (
                      <Card.Root variant="outline" bg="gray.50">
                        <Card.Body p={6} textAlign="center">
                          <Text color="gray.500">Нет назначенных сотрудников</Text>
                        </Card.Body>
                      </Card.Root>
                    )}
                  </VStack>
                </VStack>
              ) : (
                <VStack justify="center" py={8}>
                  <Text color="gray.500">Данные отсутствуют</Text>
                </VStack>
              )}
              {isEditing && (
                <HStack justifyContent="flex-end" w="100%" mt={2}>
                  <IconButton
                    onClick={() =>
                      handleAddWorkday({
                        shiftSalary: 0,
                        securityId: 0,
                        objectWorkdayId: oneObjectWorkdayInfo?.id || 0,
                        isStarted: false,
                        isStartedComment: '',
                        isFinished: false,
                        isFinishedComment: '',
                        workdayStatus: WORKDAY_OPTIONS.MAIN.value,
                      })
                    }
                    size="xs"
                    px={2}
                    mx="auto"
                    right={2}
                  >
                    <IoIosAdd />
                    Добавить сотрудника
                  </IconButton>
                </HStack>
              )}
              {errorMessages.length > 0 && (
                <Alert.Root status="error" mt={2}>
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Ошибки валидации:</Alert.Title>
                    <Alert.Description>
                      <VStack align="start" mt={2}>
                        {errorMessages.map((message, index) => (
                          <Text key={index} fontSize="xs">
                            • {message}
                          </Text>
                        ))}
                      </VStack>
                    </Alert.Description>
                  </Alert.Content>
                </Alert.Root>
              )}
            </Dialog.Body>

            <Dialog.Footer flex="0 0 auto">
              <HStack justifyContent="flex-end" w="100%" gap={2}>
                {!isEditing && (
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Закрыть
                  </Button>
                )}

                {isEditing && (
                  <Button
                    disabled={isProcessing}
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      resetForm()
                    }}
                  >
                    Отменить
                  </Button>
                )}

                {isEditing && (
                  <Button type="submit" disabled={isProcessing} loading={isProcessing}>
                    Сохранить
                  </Button>
                )}
                {!isEditing && (
                  <Button htmlType="button" onClick={() => setIsEditing(true)}>
                    Редактировать
                  </Button>
                )}
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
