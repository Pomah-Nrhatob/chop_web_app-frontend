'use client'

import { Box, VStack, SimpleGrid, Text, Flex, Heading, Spinner } from '@chakra-ui/react'
import { useCalendarAllObjects } from '@/features/calendar/api/use-calendarAllObjects'
import { useCalendarAllObjectsStore } from '@/features/calendar/store/useCalendarAllObjectsStore'
import WorkdayCell from '@/views/calendarAllObjects/ui/WorkdayCell'
import HeaderButtons from '@/views/calendarAllObjects/ui/HeaderButtons'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import { MdAdd, MdFolderOpen } from 'react-icons/md'
import { useState } from 'react'
import OneDayDialog from '@/components/calendar/oneDayDialog/OneDayDialog'
import EmptyDayDialog from '@/components/calendar/emptyDayDialog/EmptyDayDialog'
import CalendarPagination from '@/components/calendar/components/CalendarPagination'
import ContainerForPage from '@/components/containerForPage/ContainerForPage'

const TOTAL_COLUMNS = 6

const getDayName = (dayNum, year, month) => {
  const date = new Date(year, month - 1, dayNum)
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  return days[date.getDay()]
}

export default function CalendarAllObjects() {
  const { queryParams, getDaysInMonth, setQueryParams } = useCalendarAllObjectsStore()
  const { allObjectsWorkdays, isLoading, isFetching, refetch } = useCalendarAllObjects(queryParams)

  const { data: objectsDictionary = [] } = useGetDictionaryObjects()

  const [openOneDayDialog, setOpenOneDayDialog] = useState(false)
  const [openEmptyDayDialog, setOpenEmptyDayDialog] = useState(false)
  const [emptyDayInfo, setEmptyDayInfo] = useState({})
  const [selectedWorkday, setSelectedWorkday] = useState(null)

  const objects = allObjectsWorkdays?.data || []
  const daysInMonth = getDaysInMonth()

  return (
    <>
      <OneDayDialog
        open={openOneDayDialog}
        setOpen={setOpenOneDayDialog}
        selectedWorkday={selectedWorkday}
        setSelectedWorkday={setSelectedWorkday}
      />

      <EmptyDayDialog
        emptyDayInfo={emptyDayInfo}
        setEmptyDayInfo={setEmptyDayInfo}
        open={openEmptyDayDialog}
        setOpen={setOpenEmptyDayDialog}
      />

      <ContainerForPage title="Общий календарь" text="Раздел для управления графиком всех объектов">
        <VStack
          align="stretch"
          spacing={{ base: 3, md: 6 }}
          p={{ base: 3, md: 6 }}
          bg="white"
          borderRadius="xl"
          shadow="lg"
        >
          {/* Контролы */}
          <HeaderButtons refetch={refetch} />

          <Box>
            {/* ✅ КОНТЕЙНЕР СО СКРОЛЛОМ + STICKY ЗАГОЛОВКИ */}
            <Box
              minH="350px" // 100vh минус header + пагинация
              position="relative"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              bg="white"
            >
              {/* ✅ STICKY ЗАГОЛОВКИ ДНЕЙ */}
              <SimpleGrid
                columns={TOTAL_COLUMNS}
                spacing={1}
                minChildWidth={{ base: '55px', md: '100px' }}
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

                {/* Дни недели */}
                {Array.from({ length: 5 }, (_, i) => {
                  const dayNum = queryParams.startDay + i

                  if (dayNum > daysInMonth) {
                    return (
                      <Box
                        key={`header-empty-${i}`}
                        h={'70px'}
                        bg="gray.200"
                        borderRadius="md"
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize="xs" color="gray.500">
                          —
                        </Text>
                      </Box>
                    )
                  }

                  return (
                    <Box
                      key={`header-${dayNum}`}
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
                      <Text fontSize={{ base: 'xs', md: 'sm' }}>{dayNum}</Text>
                      <Text fontSize={{ base: '2xs', md: 'xs' }}>
                        {getDayName(dayNum, queryParams.year, queryParams.month)}
                      </Text>
                    </Box>
                  )
                })}
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
                  <Box>
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
                  {objects.map((obj) => (
                    <SimpleGrid
                      key={obj.id}
                      columns={TOTAL_COLUMNS}
                      spacing={1}
                      minChildWidth={{ base: '55px', md: '100px' }}
                    >
                      <Box
                        h="70px"
                        bg="gray.50"
                        border="2px solid"
                        borderColor="blue.200"
                        borderRadius="lg"
                        p={{ base: 2, md: 3 }}
                        display="flex"
                        alignItems="center"
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
                        {objectsDictionary.find((el) => el.id === obj.id)?.title ||
                          `Объект #${obj.id}`}
                      </Box>
                      {Array.from({ length: 5 }, (_, i) => {
                        const dayNum = queryParams.startDay + i

                        if (dayNum > daysInMonth) {
                          return (
                            <Box
                              key={`empty-${obj.id}-${i}`}
                              h={'70px'}
                              border="2px solid"
                              borderColor="gray.200"
                              bg="gray.50"
                              borderRadius="lg"
                              p={2}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text fontSize="xs" color="gray.500">
                                —
                              </Text>
                            </Box>
                          )
                        }

                        const dayData = obj.days?.find((d) => d.day === dayNum)

                        return (
                          <WorkdayCell
                            selectedWorkday={selectedWorkday}
                            openOneDay={() => {
                              setOpenOneDayDialog(true)
                              setSelectedWorkday(dayData.workday.id)
                            }}
                            openEmptyDay={() => {
                              setOpenEmptyDayDialog(true)
                              setEmptyDayInfo({
                                year: queryParams.year,
                                month: queryParams.month,
                                day: dayData.day,
                                objectId: obj.id,
                              })
                            }}
                            key={`${obj.id}-${dayNum}`}
                            workday={dayData?.workday}
                          />
                        )
                      })}
                    </SimpleGrid>
                  ))}
                </VStack>
              )}
            </Box>
            {allObjectsWorkdays?.meta.total > allObjectsWorkdays?.meta.limit ? (
              <CalendarPagination
                queryParams={queryParams}
                setQueryParams={setQueryParams}
                meta={allObjectsWorkdays?.meta}
              />
            ) : null}
          </Box>
        </VStack>
      </ContainerForPage>
    </>
  )
}
