'use client'

import React, { useState } from 'react'
import { Box, SimpleGrid, Text, VStack, HStack, Button, Badge, Heading } from '@chakra-ui/react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { useParams } from 'next/navigation'
import { useGetCalendarSecurityWorkdays } from '@/features/calendar-security/api/use-get-calendar-workdays'
import { getYear, getMonth } from 'date-fns'

import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import SecurityList from '../../ui/SecurityList'
import EmptyDayDialogSecurities from '@/components/calendar/emptyDayDialog/EmptyDayDialogSecurities'
import OneDaySecurityDialog from '@/components/calendar/oneDayDialog/oneDaySecurityDialog'

export default function SecurityCalendar() {
  const params = useParams()
  const securityId = Number(params.id)

  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = getYear(currentMonth)
  const month = getMonth(currentMonth) + 1

  const [selectedDates, setSelectedDates] = useState([])
  const [isListOpen, setIsListOpen] = useState(false)

  // СТЕЙТЫ ДЛЯ УПРАВЛЕНИЯ МОДАЛКАМИ
  const [openOneDayDialog, setOpenOneDayDialog] = useState(false)
  const [openEmptyDayDialog, setOpenEmptyDayDialog] = useState(false)
  const [emptyDayInfo, setEmptyDayInfo] = useState({})
  const [selectedWorkday, setSelectedWorkday] = useState(null)

  const { data: securityDictionary = [] } = useGetDictionarySecurities()
  const { data: objectsDictionary = [] } = useGetDictionaryObjects()

  // ДОБАВЛЕНО: Находим текущий объект в словаре по ID из URL
  const currentSecurity = securityDictionary.find((el) => el.id === securityId)

  // Получение смен текущего объекта с бэкенда
  const {
    data: serverShifts,
    isLoading,
    isError,
  } = useGetCalendarSecurityWorkdays({
    securityId,
    year,
    month,
  })

  // Преобразуем строковые timestamp от бэкенда в валидные JS Date объекты
  const shifts = React.useMemo(() => {
    if (!serverShifts || !Array.isArray(serverShifts)) return []
    return serverShifts.map((shift) => ({
      ...shift,
      parsedDate:
        typeof shift.timestamp === 'string' ? parseISO(shift.timestamp) : new Date(shift.timestamp),
    }))
  }, [serverShifts])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
  const currentMonthDays = calendarDays.filter((day) => isSameMonth(day, monthStart))

  // Клик по ячейке дня: добавляет или удаляет дату из списка выделенных
  const handleDateClick = (day) => {
    setSelectedDates((prev) => {
      const exists = prev.find((d) => isSameDay(d, day))
      if (exists) {
        return prev.filter((d) => !isSameDay(d, day))
      }
      return [...prev, day]
    })
  }

  const selectAllDays = () => {
    setSelectedDates(currentMonthDays)
  }

  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter((day) => {
      // Находим все смены охранника, привязанные к текущему дню
      const dayShifts = shifts.filter((shift) => isSameDay(shift.parsedDate, day))

      // День считается абсолютно ПУСТЫМ, если в этот день у охранника нет ни одной смены
      return dayShifts.length === 0
    })

    setSelectedDates(emptyDays)
  }

  // Клик строго по бейджу существующей смены
  const handleShiftClick = (e, shift) => {
    e.stopPropagation() // Предотвращаем срабатывание клика по самой ячейке Box
    setSelectedWorkday(shift.id) // Передаем ID смены в стейт для модалки
    setOpenOneDayDialog(true)
  }

  // Клик по кнопке «Назначить смену» в синей нижней панели
  const handleOpenCreateDialog = () => {
    setEmptyDayInfo({
      securityId: securityId, // Передаем ID охранника
      dates: selectedDates, // Массив выделенных дат
    })
    setOpenEmptyDayDialog(true)
  }

  if (isLoading) return <div>Загрузка календаря...</div>
  if (isError) return <div>Ошибка загрузки данных с сервера</div>

  return (
    <>
      <OneDaySecurityDialog
        open={openOneDayDialog}
        setOpen={setOpenOneDayDialog}
        selectedWorkday={selectedWorkday}
        setSelectedWorkday={setSelectedWorkday}
      />
      {/* ДИАЛОГ МАССОВОГО СОЗДАНИЯ СМЕН ДЛЯ ВЫБРАННЫХ ДНЕЙ */}
      <EmptyDayDialogSecurities
        emptyDayInfo={emptyDayInfo}
        setEmptyDayInfo={setEmptyDayInfo}
        open={openEmptyDayDialog}
        setOpen={setOpenEmptyDayDialog}
        onSuccessAction={() => setSelectedDates([])}
      />

      <VStack align="stretch" gap={6} p={4} bg="white" borderRadius="xl" shadow="sm">
        <Box borderBottom="1px solid" borderColor="gray.100" pb={2}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="blue.500"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Календарь расписания
          </Text>
          <Heading size="lg" color="gray.800" mt={1}>
            {currentSecurity.name}
          </Heading>
          <Heading size="lg" color="gray.800" mt={1}>
            {currentSecurity.surname}
          </Heading>
        </Box>
        {/* Выпадающий список объектов */}
        <Button
          variant="ghost"
          justifyContent="space-between"
          onClick={() => setIsListOpen(!isListOpen)}
        >
          {isListOpen ? 'Скрыть список охранников' : 'Открыть список охранников'}
          {isListOpen ? <LuChevronUp /> : <LuChevronDown />}
        </Button>

        {isListOpen && <SecurityList />}

        {/* Шапка календаря: Название месяца и пагинация по месяцам */}
        <HStack justify="space-between">
          <VStack align="flex-start" gap={0}>
            <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </Text>
            <HStack gap={2} mt={2}>
              <Button size="xs" variant="outline" onClick={selectAllDays}>
                Весь месяц
              </Button>
              <Button size="xs" variant="outline" onClick={selectDaysWithoutShifts}>
                Дни без смен
              </Button>
            </HStack>
          </VStack>

          <HStack>
            <Button size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              Пред.
            </Button>
            <Button size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              След.
            </Button>
          </HStack>
        </HStack>

        {/* Сетка календаря */}
        <SimpleGrid columns={7} gap={1}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
            <Text key={d} textAlign="center" fontSize="sm" fontWeight="bold" color="gray.400">
              {d}
            </Text>
          ))}

          {calendarDays.map((day, idx) => {
            const isSelected = selectedDates.some((d) => isSameDay(d, day))
            const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
            const isToday = isSameDay(day, new Date())

            // ✅ ИСПРАВЛЕНО: Для персонального календаря день заполнен, если к нему привязана хотя бы одна смена
            const isDayPopulated = dayShifts.length > 0

            return (
              <Box
                key={idx}
                minH="110px"
                border="1px solid"
                borderColor={isToday ? 'blue.300' : 'gray.100'}
                bg={isSelected ? 'blue.500' : 'transparent'}
                color={isSelected ? 'white' : 'black'}
                p={1}
                cursor="pointer"
                transition="0.1s"
                _hover={{ bg: isSelected ? 'blue.600' : 'gray.50' }}
                onClick={() => {
                  if (isDayPopulated) {
                    // ✅ ИСПРАВЛЕНО: Безопасно извлекаем objectWorkdayId из объекта смены (как указано в DTO)
                    const firstShift = dayShifts[0]
                    const workdayId = firstShift?.securityId || firstShift?.id

                    if (workdayId) {
                      setSelectedWorkday(workdayId)
                      setOpenOneDayDialog(true)
                    }
                  } else {
                    // Если день пустой — работает обычный выбор дат
                    handleDateClick(day)
                  }
                }}
                opacity={isSameMonth(day, monthStart) ? 1 : 0.3}
              >
                <Text fontWeight={isToday ? 'bold' : 'medium'} fontSize="sm">
                  {format(day, 'd')}
                </Text>

                {/* Вывод назначенных смен в ячейке дня */}
                {isDayPopulated && (
                  <VStack align="stretch" gap={1} mt={1}>
                    {dayShifts.map((shift) => {
                      const foundObject = objectsDictionary?.find(
                        (el) => el.id == shift.securityObjectId
                      )

                      const objectTitle = foundObject
                        ? foundObject.title
                        : `Объект #${shift.securityObjectId}`

                      return (
                        <Badge
                          key={shift.id}
                          colorPalette={
                            isSelected ? 'whiteAlpha' : shift.isFinished ? 'green' : 'orange'
                          }
                          fontSize="2xs"
                          variant="solid"
                          cursor="pointer"
                          onClick={(e) => {
                            e.stopPropagation() // Предотвращает ложный клик по ячейке Box
                            handleShiftClick(e, shift)
                          }}
                        >
                          {objectTitle}
                        </Badge>
                      )
                    })}
                  </VStack>
                )}
              </Box>
            )
          })}
        </SimpleGrid>

        {/* Нижняя всплывающая синяя панель действий */}
        {selectedDates.length > 0 && (
          <HStack justify="space-between" p={4} bg="blue.900" color="white" borderRadius="lg">
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" opacity={0.8}>
                Выбрано дней: {selectedDates.length}
              </Text>
              <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                {selectedDates
                  .sort((a, b) => a - b)
                  .map((d) => format(d, 'dd.MM'))
                  .join(', ')}
              </Text>
            </VStack>
            <HStack>
              <Button colorPalette="blue" size="md" onClick={handleOpenCreateDialog}>
                Назначить смену
              </Button>
              <Button variant="whiteAlpha" onClick={() => setSelectedDates([])}>
                Сброс
              </Button>
            </HStack>
          </HStack>
        )}
      </VStack>
    </>
  )
}
