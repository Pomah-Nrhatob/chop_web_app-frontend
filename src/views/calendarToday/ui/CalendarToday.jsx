'use client'

import CalendarPagination from '@/components/calendar/components/CalendarPagination'
import { useEditDaysAllObjectsForm } from '@/components/calendar/oneDayDialog/hooks/useEditDaysAllObjectsForm'
import ContainerForPage from '@/components/containerForPage/ContainerForPage'
import { NoActiveCompany } from '@/components/ui/NoActiveCompany'
import { useCalendarOneDay } from '@/features/calendar/api/use-calendarOneDay'
import { useCalendarOneDayStore } from '@/features/calendar/store/useCalendarOneDayStore'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import SecurityWorkdayForm from '@/views/calendarToday/ui/SecurityWorkdayForm'
import SelectYearMonthDay from '@/views/calendarToday/ui/SelectYearMonthDay'
import {
  ActionBar,
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  Portal,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { CiSaveDown1 } from 'react-icons/ci'
import { MdOutlineCancel } from 'react-icons/md'

const getFormattedDate = (day, month, year) => {
  const date = new Date(year, month - 1, day)
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  // Форматируем дату без дня недели
  const dateFormatter = new Intl.DateTimeFormat('ru-RU', options)
  const formattedDate = dateFormatter.format(date)

  // Получаем только день недели
  const weekdayOptions = { weekday: 'long' }
  const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', weekdayOptions)
  const weekday = weekdayFormatter.format(date)

  // Приводим день недели к нижнему регистру
  const lowercaseWeekday = weekday.toLowerCase()

  return `${formattedDate} (${lowercaseWeekday})`
}

export default function CalendarToday() {
  const itemRefs = useRef({})

  const [currentId, setCurrentId] = useState(null)

  const { queryParams, setQueryParams } = useCalendarOneDayStore()

  const { oneDayWorkdays, isLoading, isFetching, refetch } = useCalendarOneDay(queryParams)

  const objects = oneDayWorkdays?.data || []

  const { data: objectsDictionary = [] } = useGetDictionaryObjects()

  const {
    updateWorkday,
    handleSubmit,
    resetForm,
    control,
    errors,
    isProcessing,
    watch,
    clearUpdateForm,
    startAllWorkdays,
    finishAllWorkdays,
  } = useEditDaysAllObjectsForm(null, () => {
    resetForm()
  })

  const allSecurityWorkdays = useMemo(() => {
    return objects.flatMap((object) => object.days?.[0]?.workday?.securityWorkdays ?? [])
  }, [objects])

  const updatedWorkdays = useWatch({ name: 'updatedWorkdays', control }) || []

  const updatedMap = useMemo(() => {
    const map = new Map()
    updatedWorkdays.forEach((item) => {
      map.set(item.id, item)
    })
    return map
  }, [updatedWorkdays])

  const onSubmit = () => {
    clearUpdateForm()
  }

  const containerRef = useRef(null)

  const HEADER_HEIGHT = 70

  const handleScroll = () => {
    let current = null
    let minTop = Infinity

    Object.entries(itemRefs.current).forEach(([id, el]) => {
      if (!el) return

      const top = el.getBoundingClientRect().top

      // первый элемент ниже sticky header
      if (top >= HEADER_HEIGHT && top < minTop) {
        minTop = top
        current = Number(id)
      }
    })

    setCurrentId(current)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentId(Number(entry.target.dataset.id))
          }
        })
      },
      {
        rootMargin: '-70px 0px -90% 0px',
        threshold: 0,
      }
    )

    Object.values(itemRefs.current).forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [objects])

  return (
    <>
      <ContainerForPage
        title="График на день"
        text={`Раздел для управления всеми объектами на
            ${getFormattedDate(queryParams.day, queryParams.month, queryParams.year)}`}
      >
        <NoActiveCompany>
          <VStack
            align="stretch"
            spacing={{ base: 3, md: 6 }}
            p={{ base: 3, md: 6 }}
            mb={{ base: '90px', md: '80px' }}
            bg="white"
            borderRadius="xl"
            shadow="lg"
            as="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Box p={4} bg="gray.50" border="1px solid" borderColor="gray.200" borderRadius="lg">
              <Flex
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'stretch', md: 'center' }}
                justify="space-between"
                gap={3}
              >
                <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                  Массовые действия
                </Text>

                <Flex gap={2} wrap="wrap">
                  <Button
                    size="sm"
                    colorPalette="green"
                    variant="outline"
                    onClick={() => startAllWorkdays(allSecurityWorkdays)}
                  >
                    Начать всем
                  </Button>

                  <Button
                    size="sm"
                    colorPalette="orange"
                    variant="outline"
                    onClick={() => finishAllWorkdays(allSecurityWorkdays)}
                  >
                    Завершить всем
                  </Button>
                </Flex>
              </Flex>
            </Box>
            <SelectYearMonthDay refetch={refetch} />

            {/* Панель массовых действий */}

            <Box>
              {/* ✅ КОНТЕЙНЕР СО СКРОЛЛОМ + STICKY ЗАГОЛОВКИ */}
              <Box
                ref={containerRef}
                // overflowY="auto"
                // h="calc(100vh - 250px)"
                onScroll={handleScroll}
                minH="350px" // 100vh минус header + пагинация
                position="relative"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                bg="white"
              >
                {/* ✅ STICKY ЗАГОЛОВКИ ДНЕЙ */}
                <SimpleGrid
                  columns={2}
                  spacing={1}
                  minChildWidth={{ base: '60px', md: '100px' }}
                  position="sticky"
                  top={0}
                  zIndex={10}
                  bg="white"
                  py={1}
                  borderBottom="2px solid"
                  borderBottomColor="gray.200"
                  backdropFilter="blur(10px)"
                >
                  {/* Пустая ячейка для объекта */}
                  <GridItem colSpan={1}>
                    <Box
                      h={'70px'}
                      bg="blue.500"
                      borderRadius="md"
                      shadow="sm"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontWeight="bold" color="white">
                        Объект
                      </Text>
                    </Box>
                  </GridItem>

                  <GridItem colSpan={2}>
                    <Box
                      h={'70px'}
                      bg="linear-gradient(135deg, blue.400, indigo.500)"
                      borderRadius="md"
                      shadow="sm"
                      display="flex"
                      flexDir="column"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                    >
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>День</Text>
                      <Text fontSize={{ base: '2xs', md: 'xs' }}>
                        {getFormattedDate(queryParams.day, queryParams.month, queryParams.year)}
                      </Text>
                    </Box>
                  </GridItem>
                </SimpleGrid>

                {/* ❌ НЕ STICKY - обычные строки объектов */}

                {isLoading || isFetching ? (
                  <Box
                    h={`calc(75vh - 150px)`}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Spinner size="lg" />
                  </Box>
                ) : objects.length === 0 ? (
                  <Flex
                    h={'80%'}
                    direction="column"
                    align="center"
                    justify="center"
                    p={8}
                    textAlign="center"
                    gap={6}
                    color="gray.500"
                  >
                    {/* Заголовок */}
                    <Box pt={55}>
                      <Heading
                        size={{ base: 'md', md: 'lg' }}
                        color="gray.700"
                        mb={2}
                        fontWeight="semibold"
                      >
                        Объектов пока нет
                      </Heading>

                      <Text fontSize={{ base: 'md', md: 'lg' }} opacity={0.8} lineHeight="1.5">
                        Создайте первый объект в разделе "Объекты"
                      </Text>
                    </Box>
                  </Flex>
                ) : (
                  <VStack spacing={0} align="stretch">
                    {objects.map((objData) => {
                      let securityWorkers = objData.days[0]?.workday?.securityWorkdays || []

                      return (
                        <SimpleGrid
                          data-id={objData.id}
                          ref={(el) => {
                            itemRefs.current[objData.id] = el
                          }}
                          key={objData.id}
                          columns={2}
                          spacing={1}
                          minChildWidth={{ base: '60px', md: '100px' }}
                        >
                          {/* Ячейка с названием объекта */}
                          <GridItem colSpan={1}>
                            <Box
                              h="full" // ✅ Растягиваем по высоте
                              bg={currentId === objData.id ? 'blue.50' : 'gray.50'}
                              border="2px solid"
                              borderColor={currentId === objData.id ? 'blue.400' : 'blue.200'}
                              borderRadius="lg"
                              p={{ base: 2, md: 3 }}
                              display="flex"
                              alignItems="center" // Выравнивание по верху
                              justifyContent="flex-start"
                              fontWeight="semibold"
                              fontSize={{ base: 'xs', md: 'sm' }}
                              color="blue.700"
                              lineHeight="1.3"
                              wordBreak="break-word"
                              shadow="sm"
                              _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                              sx={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineClamp: 2,
                              }}
                            >
                              {objectsDictionary.find((el) => el.id === objData.id)?.title ||
                                `Объект #${objData.id}`}
                            </Box>
                          </GridItem>

                          {/* Ячейка с охранниками */}
                          <GridItem colSpan={2}>
                            <Box
                              w="100%"
                              minH="70px"
                              bg="gray.50"
                              border="2px solid"
                              borderColor="gray.300"
                              borderRadius="lg"
                              py={{ base: 3, md: 4 }}
                              shadow="sm"
                            >
                              {securityWorkers.length > 0 ? (
                                <VStack spacing={1} align="stretch">
                                  {securityWorkers.map((worker) => {
                                    const isUpdateWorkday = updatedMap.get(worker.id)
                                    return (
                                      <Box
                                        key={worker.id}
                                        bg="white"
                                        borderRadius="md"
                                        px={2}
                                        py={1}
                                        fontSize={{ base: '2xs', md: 'xs' }}
                                        shadow="sm"
                                      >
                                        <SecurityWorkdayForm
                                          updateWorkday={updateWorkday}
                                          worker={
                                            isUpdateWorkday
                                              ? { ...worker, ...isUpdateWorkday }
                                              : worker
                                          }
                                        />
                                      </Box>
                                    )
                                  })}
                                </VStack>
                              ) : (
                                <Flex h="full" alignItems="center">
                                  <Text color="gray.400">Нет работников</Text>
                                </Flex>
                              )}
                            </Box>
                          </GridItem>
                        </SimpleGrid>
                      )
                    })}
                  </VStack>
                )}
              </Box>
            </Box>

            {oneDayWorkdays?.meta.total > oneDayWorkdays?.meta.limit ? (
              <Box>
                <CalendarPagination
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
                  meta={oneDayWorkdays?.meta}
                />
              </Box>
            ) : null}
          </VStack>

          <ActionBar.Root open={updatedWorkdays.length > 0} closeOnInteractOutside={false}>
            <Portal>
              <ActionBar.Positioner style={{ zIndex: 2000 }}>
                <ActionBar.Content>
                  <ActionBar.Separator />
                  <Button
                    onClick={clearUpdateForm}
                    disabled={!updatedWorkdays.length > 0 || isProcessing}
                    variant="outline"
                    size="sm"
                  >
                    <MdOutlineCancel />
                    Сбросить
                  </Button>
                  <Button
                    onClick={() => {
                      // Программно вызвать отправку формы
                      handleSubmit(onSubmit)()
                    }}
                    disabled={!updatedWorkdays.length > 0 || isProcessing}
                    loading={isProcessing}
                    colorPalette="green"
                    variant="outline"
                    size="sm"
                  >
                    <CiSaveDown1 />
                    Сохранить изменения
                  </Button>
                </ActionBar.Content>
              </ActionBar.Positioner>
            </Portal>
          </ActionBar.Root>
        </NoActiveCompany>
      </ContainerForPage>
    </>
  )
}
