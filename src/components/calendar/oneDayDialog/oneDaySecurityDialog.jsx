import { useEditDayForm } from '@/components/calendar/emptyDayDialog/hooks/useEditDayForm'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import SecurityDayInfo from '@/components/calendar/oneDayDialog/SecurityDayInfo'
import { WORKDAY_OPTIONS } from '@/components/calendar/data/workday-options'
import { Controller, useWatch } from 'react-hook-form'
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
import { useGetOneSecurityWorkday } from '@/features/calendar/api/useGetOneSecurityWorkday'
import SelectOneObject from '@/features/dictionary/components/selectWithSearch/SelectOneObject'
import SecurityDayInfoBySecurities from './SecurityDayInfoBySecurities'

export default function OneDaySecurityDialog({
  open,
  setOpen,
  selectedWorkday,
  setSelectedWorkday,
}) {
  const [isEditing, setIsEditing] = useState(false)

  const { isLoading, oneSecurityWorkdayInfo, isFetching } = useGetOneSecurityWorkday(
    selectedWorkday,
    {
      enabled: !!selectedWorkday && open,
    }
  )

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
      setIsEditing(false)
    },
    () => {
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

  const formatDate = (timestamp) => {
    try {
      return format(new Date(timestamp), 'dd MMMM yyyy г.', { locale: ru })
    } catch {
      return 'Неизвестная дата'
    }
  }

  const { data: objects, isLoading: loadingObjects } = useGetDictionaryObjects()
  const { data: securities, isLoading: loadingSecurities } = useGetDictionarySecurities()

  const foundSecurity = securities.find((sec) => sec.id === oneSecurityWorkdayInfo?.securityId)

  const foundObject = objects.find((obj) => obj.id === oneSecurityWorkdayInfo?.securityObjectId)

  const onSubmit = () => {
    console.log('submit')
  }

  console.log(oneSecurityWorkdayInfo)
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
              ) : oneSecurityWorkdayInfo ? (
                <VStack align="stretch" spacing={4}>
                  <Card.Root variant="outline">
                    <Card.Header pb={2}>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">
                          {formatDate(oneSecurityWorkdayInfo.timestamp)}
                        </Text>
                      </HStack>
                    </Card.Header>
                  </Card.Root>

                  <VStack align="stretch" spacing={3}>
                    {(() => {
                      // Выносим расчет переменных в анонимную функцию, которая сразу выполняется
                      const isDeleted = deletedSet.has(oneSecurityWorkdayInfo.id)
                      const isUpdateWorkday = updatedMap.get(oneSecurityWorkdayInfo.id)

                      return (
                        <SecurityDayInfoBySecurities
                          // ИСПРАВЛЕНО: Ключом должен быть ID записи смены (id), а не ID охранника
                          loadingObjects={loadingObjects}
                          objects={objects}
                          control={control}
                          foundObject={foundObject}
                          key={oneSecurityWorkdayInfo.id}
                          // Если есть обновления в форме, подмешиваем их в объект смены
                          worker={
                            isUpdateWorkday
                              ? { ...oneSecurityWorkdayInfo, ...isUpdateWorkday }
                              : oneSecurityWorkdayInfo
                          }
                          isDeleted={isDeleted}
                          isEditing={isEditing}
                          addNewWorkday={addNewWorkday}
                          markForDeletion={markForDeletion}
                          updateWorkday={updateWorkday}
                          isEdited={!!isUpdateWorkday}
                        />
                      )
                    })()}
                  </VStack>
                </VStack>
              ) : (
                <VStack justify="center" py={8}>
                  <Text color="gray.500">Данные отсутствуют</Text>
                </VStack>
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
