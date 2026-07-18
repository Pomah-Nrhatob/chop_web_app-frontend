'use client'

import CalendarPagination from '@/components/calendar/components/CalendarPagination'
import { useEditDaysAllObjectsForm } from '@/components/calendar/oneDayDialog/hooks/useEditDaysAllObjectsForm'
import ContainerForPage from '@/components/containerForPage/ContainerForPage'
import { NoActiveCompany } from '@/components/ui/NoActiveCompany'
import { useCalendarOneDay } from '@/features/calendar/api/use-calendarOneDay'
import { useCalendarOneDayStore } from '@/features/calendar/store/useCalendarOneDayStore'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import { useActiveCompanyId } from '@/shared/hooks/useActiveCompanyId'
import SecurityWorkdayForm from '@/views/calendarToday/ui/SecurityWorkdayForm'
import SelectYearMonthDay from '@/views/calendarToday/ui/SelectYearMonthDay'
import {
  ActionBar,
  Alert,
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Portal,
  Presence,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { CiSaveDown1 } from 'react-icons/ci'
import { LuCircleCheck, LuPlay } from 'react-icons/lu'
import { MdEdit, MdOutlineCancel } from 'react-icons/md'

const ACTIVE_LINE = 220

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

  const scrollRef = useRef(null)
  const isProgrammaticScroll = useRef(false)

  const badgesRef = useRef(null)
  const activeBadgeRef = useRef(null)

  const [currentId, setCurrentId] = useState(null)

  const smoothScrollTo = (element, onFinish) => {
    const start = window.scrollY
    const end = element.getBoundingClientRect().top + window.scrollY - 220

    const duration = 500
    const startTime = performance.now()

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1)

      const ease =
        progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      window.scrollTo(0, start + (end - start) * ease)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        onFinish?.()
      }
    }

    requestAnimationFrame(animate)
  }

  const scrollToObject = (id) => {
    const el = itemRefs.current[id]
    if (!el) return

    isProgrammaticScroll.current = true

    setCurrentId(id)

    smoothScrollTo(el, () => {
      isProgrammaticScroll.current = false
    })
  }

  const { queryParams, setQueryParams } = useCalendarOneDayStore()

  const { oneDayWorkdays, isLoading, isFetching, refetch } = useCalendarOneDay(queryParams)

  const objects = oneDayWorkdays?.data || []

  const activeCompanyId = useActiveCompanyId()

  const { data: objectsDictionary = [] } = useGetDictionaryObjects(activeCompanyId)

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
    alertMessage,
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

  useEffect(() => {
    if (!activeBadgeRef.current) return

    activeBadgeRef.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [currentId])

  useEffect(() => {
    const el = badgesRef.current
    if (!el) return

    const handleWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth) return

      e.preventDefault()

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY

      el.scrollLeft += delta
    }

    el.addEventListener('wheel', handleWheel, {
      passive: false,
    })

    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [])

  useEffect(() => {
    const updateCurrentObject = () => {
      if (isProgrammaticScroll.current) return
      if (!objects.length) return

      let activeId = objects[0].id
      let bestDistance = Infinity

      for (const obj of objects) {
        const el = itemRefs.current[obj.id]
        if (!el) continue

        const rect = el.getBoundingClientRect()

        const distance = Math.abs(rect.top - ACTIVE_LINE)

        if (distance < bestDistance) {
          bestDistance = distance
          activeId = obj.id
        }
      }

      setCurrentId((prev) => (prev === activeId ? prev : activeId))
    }

    updateCurrentObject()

    window.addEventListener('scroll', updateCurrentObject, {
      passive: true,
    })

    window.addEventListener('resize', updateCurrentObject)

    return () => {
      window.removeEventListener('scroll', updateCurrentObject)
      window.removeEventListener('resize', updateCurrentObject)
    }
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
            <Box p={4} bg="white" borderTopWidth="1px" borderBottomWidth="1px">
              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <Box>
                  <Text fontWeight="medium">Массовые действия</Text>
                  <Text fontSize="sm" color="gray.500">
                    Применяются ко всем отображаемым сотрудникам
                  </Text>
                </Box>

                <Box position="relative">
                  <Presence
                    present={!!alertMessage}
                    position="absolute"
                    bottom="calc(100% + 12px)"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex={20}
                  >
                    <Alert.Root
                      // status="success"
                      w="fit-content"
                      maxW="360px"
                      shadow="lg"
                      borderRadius="lg"
                      variant="subtle"
                    >
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Description>{alertMessage}</Alert.Description>
                      </Alert.Content>
                    </Alert.Root>
                  </Presence>

                  <HStack position="relative">
                    <IconButton
                      size={{ base: 'xs', md: 'md' }}
                      p={3}
                      variant="outline"
                      colorPalette="green"
                      onClick={() =>
                        startAllWorkdays(allSecurityWorkdays.filter((el) => !el.isStarted))
                      }
                    >
                      <LuPlay />
                      Начать смены
                    </IconButton>

                    <IconButton
                      size={{ base: 'xs', md: 'md' }}
                      p={3}
                      colorPalette="orange"
                      variant="outline"
                      onClick={() =>
                        finishAllWorkdays(allSecurityWorkdays.filter((el) => !el.isFinished))
                      }
                    >
                      <LuCircleCheck />
                      Завершить смены
                    </IconButton>
                  </HStack>
                </Box>
              </Flex>
            </Box>
            <SelectYearMonthDay refetch={refetch} />

            {/* Панель массовых действий */}

            <Box>
              {/* ✅ КОНТЕЙНЕР СО СКРОЛЛОМ + STICKY ЗАГОЛОВКИ */}
              <Box
                ref={scrollRef}
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

                {objects.length > 0 && (
                  <Flex
                    ref={badgesRef}
                    position="sticky"
                    top="78px"
                    zIndex={9}
                    bg="white"
                    gap={2}
                    wrap="nowrap"
                    overflowX="auto"
                    px={2}
                    pt={2}
                    pb={3}
                    borderBottom="1px solid"
                    borderBottomColor="gray.200"
                    css={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 transparent',

                      '&::-webkit-scrollbar': {
                        height: '10px',
                      },

                      '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                      },

                      '&::-webkit-scrollbar-thumb': {
                        background: '#cbd5e1',
                        borderRadius: '999px',

                        // Полоска выглядит тонкой,
                        // но попасть мышкой намного проще.
                        border: '3px solid transparent',
                        backgroundClip: 'padding-box',
                      },

                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#94a3b8',
                      },
                    }}
                  >
                    {objects.map((objData) => {
                      const title =
                        objectsDictionary.find((el) => el.id === objData.id)?.title ||
                        `Объект #${objData.id}`

                      const isActive = String(currentId) === String(objData.id)

                      return (
                        <Button
                          ref={isActive ? activeBadgeRef : null}
                          key={objData.id}
                          size="xs"
                          flexShrink={0}
                          borderRadius="full"
                          variant={isActive ? 'solid' : 'outline'}
                          colorPalette={isActive ? 'black' : 'gray'}
                          onClick={() => scrollToObject(objData.id)}
                        >
                          {title}
                        </Button>
                      )
                    })}
                  </Flex>
                )}

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
                          scrollMarginTop={ACTIVE_LINE}
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
              <ActionBar.Positioner style={{ zIndex: 500 }}>
                <ActionBar.Content
                  bg="gray.900"
                  color="white"
                  borderRadius="xl"
                  px={{ base: 3, md: 5 }}
                  py={{ base: 2, md: 3 }}
                  boxShadow="2xl"
                  width={{ base: 'calc(100vw - 24px)', md: 'auto' }}
                  maxW="700px"
                  display="flex"
                  flexDirection={{ base: 'column', sm: 'row' }}
                  alignItems={{ base: 'stretch', sm: 'center' }}
                  gap={{ base: 2, sm: 3 }}
                >
                  <HStack flex="1" minW={0} gap={2} mr={{ base: 0, md: 4 }}>
                    <MdEdit />

                    <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="medium" lineClamp={1}>
                      <Text as="span" display={{ base: 'none', sm: 'inline' }}>
                        Есть несохранённые изменения
                      </Text>

                      <Text as="span" display={{ base: 'inline', sm: 'none' }}>
                        Изменения не сохранены
                      </Text>
                    </Text>
                  </HStack>

                  <ActionBar.Separator display={{ base: 'none', sm: 'block' }} />

                  <HStack width={{ base: '100%', sm: 'auto' }} gap={2}>
                    <Button
                      flex={{ base: 1, sm: 'initial' }}
                      variant="solid"
                      colorPalette="red"
                      color="gray.200"
                      size={{ base: 'xs', md: 'sm' }}
                      onClick={clearUpdateForm}
                      disabled={updatedWorkdays.length === 0 || isProcessing}
                    >
                      <MdOutlineCancel />
                      Сбросить
                    </Button>

                    <Button
                      flex={{ base: 1, sm: 'initial' }}
                      onClick={() => handleSubmit(onSubmit)()}
                      disabled={updatedWorkdays.length === 0 || isProcessing}
                      loading={isProcessing}
                      colorPalette="green"
                      variant="solid"
                      size={{ base: 'xs', md: 'sm' }}
                    >
                      <CiSaveDown1 />

                      <Text as="span" display={{ base: 'none', sm: 'inline' }}>
                        Сохранить изменения
                      </Text>

                      <Text as="span" display={{ base: 'inline', sm: 'none' }}>
                        Сохранить
                      </Text>
                    </Button>
                  </HStack>
                </ActionBar.Content>
              </ActionBar.Positioner>
            </Portal>
          </ActionBar.Root>
        </NoActiveCompany>
      </ContainerForPage>
    </>
  )
}
