'use client'

import { WORKDAY_OPTIONS_MAP } from '@/components/calendar/data/workday-options'
import { useGetOneObjectWorkday } from '@/features/calendar/api/use-getOneObjectWorkday'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
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
  Box,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function OneDayDialog({ open, setOpen, selectedWorkday, setSelectedWorkday }) {
  const { isLoading, isFetching, refetch, oneObjectWorkdayInfo } = useGetOneObjectWorkday(
    selectedWorkday,
    {
      enabled: !!selectedWorkday && open,
    }
  )

  const formatDate = (timestamp) => {
    try {
      return format(new Date(timestamp), 'dd MMMM yyyy г.', { locale: ru })
    } catch {
      return 'Неизвестная дата'
    }
  }

  const { data: objects = [], isLoading: loadingObjects } = useGetDictionaryObjects()
  const { data: securities = [], isLoading: loadingSecurities } = useGetDictionarySecurities()

  // Находим объект по ID
  const foundObject = objects.find((obj) => obj.id === oneObjectWorkdayInfo?.securityObjectId)
  // Находим охранника по ID
  const getSecurityName = (securityId) => {
    const security = securities.find((sec) => sec.id === securityId)
    return security ? `${security.name} ${security.surname}` : `Охранник #${securityId}`
  }

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      initialFocusEl={null}
      onExitComplete={() => {
        setSelectedWorkday(null)
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          display="flex"
          alignItems={{ base: 'center', md: 'flex-start' }}
          justifyContent="center"
        >
          <Dialog.Content w={{ base: 'calc(100vw - 24px)', md: '600px' }} maxW="600px">
            <Dialog.Header>
              <Dialog.Title>Информация о рабочем дне</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {isLoading || loadingObjects || loadingSecurities ? (
                <VStack justify="center" py={8}>
                  <Text>Загрузка данных...</Text>
                </VStack>
              ) : oneObjectWorkdayInfo ? (
                <VStack align="stretch" spacing={4}>
                  {/* Основная информация о дне */}
                  <Card.Root variant="outline">
                    <Card.Header pb={2}>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">
                          {formatDate(oneObjectWorkdayInfo.timestamp)}
                        </Text>
                      </HStack>
                    </Card.Header>
                    <Card.Body pt={2}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4}>
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

                  {/* Информация о сотрудниках */}
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
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

                    {oneObjectWorkdayInfo.securityWorkdays?.map((worker, index) => (
                      <Card.Root
                        key={worker.id}
                        variant="outline"
                        bg={
                          worker.isStarted ? 'green.50' : worker.isFinished ? 'blue.50' : 'gray.50'
                        }
                      >
                        <Card.Body p={4}>
                          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <GridItem>
                              <Text fontSize="sm" color="gray.600">
                                Охранник:
                              </Text>
                              <Text fontWeight="medium">{getSecurityName(worker.securityId)}</Text>
                            </GridItem>

                            <GridItem>
                              <Text fontSize="sm" color="gray.600">
                                Тип дня:
                              </Text>
                              <Text fontWeight="medium">
                                {WORKDAY_OPTIONS_MAP[worker.workdayStatus]?.label ||
                                  worker.workdayStatus ||
                                  'Основной'}
                              </Text>
                            </GridItem>
                          </Grid>

                          <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={3}>
                            <GridItem>
                              <Text fontSize="sm" color="gray.600">
                                Статус:
                              </Text>
                              <VStack align="stretch" spacing={2}>
                                <HStack spacing={2}>
                                  <Badge
                                    colorScheme={worker.isStarted ? 'green' : 'gray'}
                                    variant={worker.isStarted ? 'solid' : 'outline'}
                                  >
                                    {worker.isStarted ? 'Начал работу' : 'Не начал'}
                                  </Badge>
                                  {worker.isStartedComment && (
                                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                      ({worker.isStartedComment})
                                    </Text>
                                  )}
                                </HStack>

                                <HStack spacing={2}>
                                  <Badge
                                    colorScheme={worker.isFinished ? 'blue' : 'gray'}
                                    variant={worker.isFinished ? 'solid' : 'outline'}
                                  >
                                    {worker.isFinished ? 'Завершил' : 'Не завершил'}
                                  </Badge>
                                  {worker.isFinishedComment && (
                                    <Text fontSize="xs" color="gray.600" noOfLines={1}>
                                      ({worker.isFinishedComment})
                                    </Text>
                                  )}
                                </HStack>
                              </VStack>
                            </GridItem>

                            <GridItem>
                              <Text fontSize="sm" color="gray.600">
                                Оплата:
                              </Text>
                              <Text
                                fontWeight="medium"
                                color={worker.shiftSalary < 1500 ? 'orange.600' : 'green.600'}
                              >
                                {worker.shiftSalary} ₽
                              </Text>
                            </GridItem>
                          </Grid>
                        </Card.Body>
                      </Card.Root>
                    ))}

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
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Закрыть</Button>
              </Dialog.ActionTrigger>
              <Button>Редактировать</Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" position="absolute" top={3} right={3} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
