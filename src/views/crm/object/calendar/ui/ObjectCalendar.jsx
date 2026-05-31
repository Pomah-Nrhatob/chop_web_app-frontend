'use client'

import React, { useState, useMemo } from 'react'
import { Box, VStack, Button, Heading, Text, Spinner, Flex } from '@chakra-ui/react'
import {
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
  getYear,
  getMonth,
} from 'date-fns'
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { useParams } from 'next/navigation'

// Хуки
import { useGetCalendarObjectWorkdays } from '@/features/calendar-object/api/use-get-calendar-workdays'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'

// Компоненты
import ObjectList from '../../ui/ObjectList'
import EmptyDayDialogObjects from '@/components/calendar/emptyDayDialog/EmptyDialogObjects'
import OneDayDialog from '@/components/calendar/oneDayDialog/OneDayDialog'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import CalendarActionBar from './CalendarActionBar'

export default function ObjectCalendar() {
  // ─── STATE ─────────────────────────────────────────────────
  const [calendarMode, setCalendarMode] = useState('view')
  const [expandedCells, setExpandedCells] = useState({})
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState([])
  const [isListOpen, setIsListOpen] = useState(false)
  const [openOneDayDialog, setOpenOneDayDialog] = useState(false)
  const [openEmptyDayDialog, setOpenEmptyDayDialog] = useState(false)
  const [emptyDayInfo, setEmptyDayInfo] = useState({})
  const [selectedWorkday, setSelectedWorkday] = useState(null)

  // ─── PARAMS & DATA ─────────────────────────────────────────
  const params = useParams()
  const securityObjectId = Number(params.id)

  // ✅ 1. Добавь isLoading к хуку словаря
  const { data: objectsDictionary = [], isLoading: isDictLoading } = useGetDictionaryObjects()

  // ✅ 2. Создай стабильный заголовок
  const stableTitle = useMemo(() => {
    if (isDictLoading || !objectsDictionary?.length) {
      return `Объект #${securityObjectId}`
    }
    const currentObject = objectsDictionary.find((el) => el.id === securityObjectId)
    return currentObject ? currentObject.title : `Объект #${securityObjectId}`
  }, [isDictLoading, objectsDictionary, securityObjectId])

  // ✅ 3. УДАЛИ objectTitle — он больше не нужен (источник гидратационных ошибок)
  // const currentObject = objectsDictionary.find((el) => el.id === securityObjectId)
  // const objectTitle = currentObject ? currentObject.title : `Объект #${securityObjectId}`

  const year = getYear(currentMonth)
  const month = getMonth(currentMonth) + 1

  const {
    data: serverShifts,
    isLoading,
    isError,
    isFetching,
  } = useGetCalendarObjectWorkdays({ securityObjectId, year, month })

  const shifts = useMemo(() => {
    if (!serverShifts || !Array.isArray(serverShifts)) return []
    return serverShifts.map((shift) => ({
      ...shift,
      parsedDate:
        typeof shift.timestamp === 'string' ? parseISO(shift.timestamp) : new Date(shift.timestamp),
    }))
  }, [serverShifts])

  // ─── CALENDAR GENERATION ───────────────────────────────────
  const monthStart = startOfMonth(currentMonth)
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }),
  })
  const currentMonthDays = calendarDays.filter((day) => isSameMonth(day, monthStart))

  // ─── HANDLERS ──────────────────────────────────────────────
  const handleDateClick = (day) => {
    setSelectedDates((prev) =>
      prev.some((d) => isSameDay(d, day)) ? prev.filter((d) => !isSameDay(d, day)) : [...prev, day]
    )
  }

  const handleDayCellClick = (day) => {
    if (!isSameMonth(day, monthStart)) return
    const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
    if (calendarMode === 'view' && dayShifts[0]?.id) {
      setSelectedWorkday(dayShifts[0].objectWorkdayId || dayShifts[0].id)
      setOpenOneDayDialog(true)
    } else {
      handleDateClick(day)
    }
  }

  const handleShiftClick = (e, shift) => {
    e.stopPropagation()
    if (calendarMode === 'edit') return
    setSelectedWorkday(shift.id)
    setOpenOneDayDialog(true)
  }

  const handleToggleExpand = (dayKey) =>
    setExpandedCells((prev) => ({ ...prev, [dayKey]: !prev[dayKey] }))
  const handleDateChange = ({ year: y, month: m }) => setCurrentMonth(new Date(y, m - 1, 1))
  const handleModeChange = (mode) => {
    setCalendarMode(mode)
    if (mode === 'view') setSelectedDates([])
  }

  const selectAllDays = () => setSelectedDates(currentMonthDays)
  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter((day) => {
      const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
      const total = dayShifts.reduce((sum, s) => sum + (s.totalWorkers || 0), 0)
      return dayShifts.length === 0 || total === 0
    })
    setSelectedDates(emptyDays)
  }

  const handleOpenCreateDialog = () => {
    setEmptyDayInfo({ objectId: securityObjectId, dates: selectedDates })
    setOpenEmptyDayDialog(true)
  }

  // ─── LOADING / ERROR ───────────────────────────────────────
  // ✅ 4. Ждём загрузки И словаря, И смен
  if (isDictLoading || isLoading || isFetching) {
    return <CalendarLoader title={`Объект #${securityObjectId}`} />
  }
  if (isError) return <CalendarError title={stableTitle} />

  // ─── RENDER ────────────────────────────────────────────────
  return (
    <>
      <OneDayDialog
        open={openOneDayDialog}
        setOpen={setOpenOneDayDialog}
        selectedWorkday={selectedWorkday}
        setSelectedWorkday={setSelectedWorkday}
      />
      <EmptyDayDialogObjects
        emptyDayInfo={emptyDayInfo}
        setEmptyDayInfo={setEmptyDayInfo}
        open={openEmptyDayDialog}
        setOpen={setOpenEmptyDayDialog}
        onSuccessAction={() => setSelectedDates([])}
      />

      <VStack align="stretch" gap={6} p={4} bg="white" borderRadius="xl" shadow="sm">
        {/* Заголовок объекта */}
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
          {/* ✅ 5. Используем stableTitle вместо objectTitle */}
          <Heading size="lg" color="gray.800" mt={1}>
            {stableTitle}
          </Heading>
        </Box>

        {/* Список объектов */}
        <Button
          variant="ghost"
          justifyContent="space-between"
          onClick={() => setIsListOpen(!isListOpen)}
        >
          {isListOpen ? 'Скрыть список объектов' : 'Открыть список объектов'}
          {isListOpen ? <LuChevronUp /> : <LuChevronDown />}
        </Button>
        {isListOpen && <ObjectList />}

        {/* Шапка календаря */}
        <CalendarHeader
          // ✅ 6. Передаём stableTitle в хедер
          objectTitle={stableTitle}
          currentMonth={currentMonth}
          year={year}
          month={month}
          calendarMode={calendarMode}
          isListOpen={isListOpen}
          onToggleList={() => setIsListOpen(!isListOpen)}
          onDateChange={handleDateChange}
          onModeChange={handleModeChange}
          onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
          onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
          onToday={() => setCurrentMonth(new Date())}
          onSelectAllDays={selectAllDays}
          onSelectEmptyDays={selectDaysWithoutShifts}
        />

        {/* Сетка календаря */}
        <CalendarGrid
          calendarDays={calendarDays}
          monthStart={monthStart}
          shifts={shifts}
          selectedDates={selectedDates}
          isToday={(day) => isSameDay(day, new Date())}
          calendarMode={calendarMode}
          expandedCells={expandedCells}
          onCellClick={handleDayCellClick}
          onShiftClick={handleShiftClick}
          onToggleExpand={handleToggleExpand}
          objectsDictionary={objectsDictionary}
        />

        {/* Нижняя панель действий */}
        <CalendarActionBar
          selectedDates={selectedDates}
          onAssign={handleOpenCreateDialog}
          onClear={() => setSelectedDates([])}
        />
      </VStack>
    </>
  )
}

// ─── Вспомогательные компоненты лоадера/ошибки ──────────────
function CalendarLoader({ title }) {
  return (
    <VStack align="stretch" gap={6} p={4} bg="white" borderRadius="xl" shadow="sm">
      <Box borderBottom="1px solid" borderColor="gray.100" pb={2}>
        <Text fontSize="sm" fontWeight="bold" color="blue.500" textTransform="uppercase">
          Календарь расписания
        </Text>
        {/* ✅ 7. Стабильный заголовок в лоадере */}
        <Heading size="lg" color="gray.800" mt={1} suppressHydrationWarning>
          {title}
        </Heading>
      </Box>
      <Box h="calc(75vh - 200px)" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="blue.500" thickness="3px" />
      </Box>
    </VStack>
  )
}

function CalendarError({ title }) {
  return (
    <VStack align="stretch" gap={6} p={4} bg="white" borderRadius="xl" shadow="sm">
      <Box borderBottom="1px solid" borderColor="gray.100" pb={2}>
        <Text fontSize="sm" fontWeight="bold" color="blue.500" textTransform="uppercase">
          Календарь расписания
        </Text>
        <Heading size="lg" color="gray.800" mt={1} suppressHydrationWarning>
          {title}
        </Heading>
      </Box>
      <Flex h="200px" align="center" justify="center" color="red.500">
        <Text>Ошибка загрузки данных с сервера</Text>
      </Flex>
    </VStack>
  )
}
