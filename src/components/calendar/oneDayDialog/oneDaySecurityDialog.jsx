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
  Separator,
  Spinner,
  Box,
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
  const { data: securities = [], isLoading: loadingSecurities } = useGetDictionarySecurities()
  const { data: objects = [], isLoading: loadingObjects } = useGetDictionaryObjects()

  const foundSecurity = securities?.find((sec) => sec.id === oneSecurityWorkdayInfo?.securityId)
  const foundObject = objects?.find((obj) => obj.id === oneSecurityWorkdayInfo?.securityObjectId)

  const onSubmit = () => {
    setOpen(false)
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
          alignItems={{ base: 'flex-end', md: 'center' }} // На мобилках выезжает снизу, на десктопе по центру
          justifyContent="center"
          p={{ base: 0, md: 4 }}
        >
          <Dialog.Content
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            w={{ base: '100vw', md: '600px' }}
            maxW="600px"
            maxH={{ base: '85dvh', md: '90dvh' }} // Чтобы не упиралось в экран на мобилках
            borderTopRadius={{ base: 'l3', md: 'md' }} // Скругление сверху на мобильных
            borderBottomRadius={{ base: 0, md: 'md' }}
            overflow="hidden"
            display="flex"
            flexDirection="column"
            bg="bg.panel"
            boxShadow="lg"
          >
            {/* ХЕДЕР */}
            <Dialog.Header flex="0 0 auto" px={6} py={4} position="relative">
              <Dialog.Title fontSize="xl" fontWeight="semibold">
                Информация о рабочем дне
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top={4} right={4} />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Separator />

            {/* ТЕЛО МОДАЛКИ */}
            <Dialog.Body
              flex="1 1 auto"
              overflowY="auto"
              overscrollBehavior="contain"
              px={6}
              py={5}
            >
              {/* СОСТОЯНИЕ ЗАГРУЗКИ */}
              {isLoading || isFetching || loadingObjects || loadingSecurities ? (
                <VStack justify="center" align="center" h="200px" gap={3}>
                  <Spinner size="xl" color="blue.500" strokeWidth={3} />
                  <Text color="fg.muted" fontSize="sm">
                    Загрузка данных...
                  </Text>
                </VStack>
              ) : oneSecurityWorkdayInfo ? (
                <VStack align="stretch" gap={5}>
                  {/* ПЛАШКА С ДАТОЙ */}
                  <Box
                    bg="bg.muted"
                    p={4}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="border.subtle"
                  >
                    <HStack justify="space-between">
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="fg.muted"
                        textTransform="uppercase"
                        letterSpacing="wider"
                      >
                        Дата смены
                      </Text>
                      <Text fontSize="md" fontWeight="semibold" color="fg.main">
                        {formatDate(oneSecurityWorkdayInfo.timestamp)}
                      </Text>
                    </HStack>
                  </Box>

                  {/* КОНТЕНТ ФОРМЫ */}
                  <Box>
                    {(() => {
                      const isDeleted = deletedSet.has(oneSecurityWorkdayInfo.id)
                      const isUpdateWorkday = updatedMap.get(oneSecurityWorkdayInfo.id)

                      return (
                        <SecurityDayInfoBySecurities
                          loadingObjects={loadingObjects}
                          objects={objects}
                          control={control}
                          foundObject={foundObject}
                          key={oneSecurityWorkdayInfo.id}
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
                  </Box>
                </VStack>
              ) : (
                /* ПУСТОЕ СОСТОЯНИЕ */
                <VStack justify="center" h="200px" gap={2}>
                  <Text color="fg.muted" fontSize="md" fontWeight="medium">
                    Данные отсутствуют
                  </Text>
                </VStack>
              )}
            </Dialog.Body>

            <Separator />

            {/* ФУТЕР */}
            <Dialog.Footer flex="0 0 auto" px={6} py={4} bg="bg.muted/30">
              <HStack
                justifyContent="flex-end"
                w="100%"
                gap={3}
                flexDirection={{ base: 'column-reverse', sm: 'row' }} // Кнопки в стек на мобильных
              >
                {/* Режим просмотра */}
                {!isEditing && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      Закрыть
                    </Button>
                    <Button
                      colorPalette="blue"
                      onClick={() => setIsEditing(true)}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      Редактировать
                    </Button>
                  </>
                )}

                {/* Режим редактирования */}
                {isEditing && (
                  <>
                    <Button
                      disabled={isProcessing}
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        resetForm()
                      }}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      Отменить
                    </Button>
                    <Button
                      type="submit"
                      colorPalette="blue"
                      disabled={isProcessing}
                      loading={isProcessing}
                      w={{ base: '100%', sm: 'auto' }}
                    >
                      Сохранить
                    </Button>
                  </>
                )}
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
