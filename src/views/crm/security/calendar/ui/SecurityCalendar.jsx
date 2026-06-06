'use client'

import React, { useState, useMemo } from 'react'
import { Box, Text, VStack, Button, Heading, Flex, Spinner } from '@chakra-ui/react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  getYear,
  getMonth,
} from 'date-fns'

import { LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { useParams } from 'next/navigation'

import { useGetCalendarSecurityWorkdays } from '@/features/calendar-security/api/use-get-calendar-workdays'
import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'

import SecurityList from '../../ui/SecurityList'
import EmptyDayDialogSecurities from '@/components/calendar/emptyDayDialog/EmptyDayDialogSecurities'
import OneDaySecurityDialog from '@/components/calendar/oneDayDialog/oneDaySecurityDialog'
import SecurityCalendarHeader from './SecurityCalendarHeader'
import SecurityCalendarGrid from './SecurityCalendarGrid'
import SecurityCalendarActionBar from './SecurityCalendarActionBar'

export default function SecurityCalendar() {
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
  const securityId = Number(params.id)

  const { data: securityDictionary = [] } = useGetDictionarySecurities()
  const { data: objectsDictionary = [] } = useGetDictionaryObjects()

  const currentSecurity = securityDictionary.find((el) => el.id === securityId)

  const year = getYear(currentMonth)
  const month = getMonth(currentMonth) + 1

  const {
    data: serverShifts,
    isLoading,
    isError,
    isFetching,
  } = useGetCalendarSecurityWorkdays({ securityId, year, month })

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
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
  const currentMonthDays = calendarDays.filter((day) => isSameMonth(day, monthStart))

  const handleDateClick = (day) => {
    setSelectedDates((prev) => {
      const exists = prev.find((d) => isSameDay(d, day))
      if (exists) {
        return prev.filter((d) => !isSameDay(d, day))
      }
      return [...prev, day]
    })
  }

  const handleDayCellClick = (day) => {
    const isCurrentMonth = isSameMonth(day, monthStart)
    if (!isCurrentMonth) return

    const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
    const isDayPopulated = dayShifts.length > 0

    // 👁 РЕЖИМ ПРОСМОТРА
    if (calendarMode === 'view') {
      if (isDayPopulated && dayShifts.length > 1) {
        const dayKey = format(day, 'yyyy-MM-dd')
        setExpandedCells((prev) => ({ ...prev, [dayKey]: !prev[dayKey] }))
        return
      }
      if (dayShifts[0]?.id) {
        setSelectedWorkday(dayShifts[0].id)
        setOpenOneDayDialog(true)
      }
      return
    }

    // ✏️ РЕЖИМ РЕДАКТИРОВАНИЯ: клик выделяет/снимает выделение
    handleDateClick(day)
  }

  const selectAllDays = () => setSelectedDates(currentMonthDays)
  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter(
      (day) => shifts.filter((s) => isSameDay(s.parsedDate, day)).length === 0
    )
    setSelectedDates(emptyDays)
  }

  const handleShiftClick = (e, shift) => {
    e.stopPropagation()
    if (calendarMode === 'edit') return
    setSelectedWorkday(shift.id)
    setOpenOneDayDialog(true)
  }

  const handleOpenCreateDialog = () => {
    setEmptyDayInfo({ securityId, dates: selectedDates })
    setOpenEmptyDayDialog(true)
  }

  const handleMonthChange = (e) => {
    const newMonth = Number(e.target.value) - 1
    setCurrentMonth(new Date(year, newMonth, 1))
  }

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value)
    setCurrentMonth(new Date(newYear, month - 1, 1))
  }

  const handleModeChange = (mode) => {
    setCalendarMode(mode)
    if (mode === 'view') setSelectedDates([])
  }

  if (isLoading || isFetching) {
    return (
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
          <Heading size="lg" color="gray.800" mt={1} suppressHydrationWarning>
            {currentSecurity?.name} {currentSecurity?.surname}
          </Heading>
        </Box>
        <Box h="calc(75vh - 200px)" display="flex" alignItems="center" justifyContent="center">
          <Spinner size="lg" color="blue.500" thickness="3px" />
        </Box>
      </VStack>
    )
  }

  if (isError) {
    return (
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
          <Heading size="lg" color="gray.800" mt={1} suppressHydrationWarning>
            {currentSecurity?.name} {currentSecurity?.surname}
          </Heading>
        </Box>
        <Flex h="200px" align="center" justify="center" color="red.500">
          <Text>Ошибка загрузки данных с сервера</Text>
        </Flex>
      </VStack>
    )
  }

  return (
    <>
      <OneDaySecurityDialog
        open={openOneDayDialog}
        setOpen={setOpenOneDayDialog}
        selectedWorkday={selectedWorkday}
        setSelectedWorkday={setSelectedWorkday}
      />
      <EmptyDayDialogSecurities
        emptyDayInfo={emptyDayInfo}
        setEmptyDayInfo={setEmptyDayInfo}
        open={openEmptyDayDialog}
        setOpen={setOpenEmptyDayDialog}
        onSuccessAction={() => setSelectedDates([])}
      />
      <VStack align="stretch" gap={6} p={4} bg="white" borderRadius="xl" shadow="sm">
        {/* Заголовок */}
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
          <Heading size="lg" color="gray.800" mt={1} suppressHydrationWarning>
            {currentSecurity?.name}
          </Heading>
          <Heading size="lg" color="gray.800" mt={1} suppressHydrationWarning>
            {currentSecurity?.surname}
          </Heading>
        </Box>
        {/* Список охранников */}
        <Button
          variant="ghost"
          justifyContent="space-between"
          onClick={() => setIsListOpen(!isListOpen)}
        >
          {isListOpen ? 'Скрыть список охранников' : 'Открыть список охранников'}
          {isListOpen ? <LuChevronUp /> : <LuChevronDown />}
        </Button>
        {isListOpen && <SecurityList />}

        <SecurityCalendarHeader
          securityId={securityId}
          month={month}
          year={year}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          calendarDays={calendarDays}
          monthStart={monthStart}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          calendarMode={calendarMode}
          setCalendarMode={setCalendarMode}
          shifts={shifts}
          objectsDictionary={objectsDictionary}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onModeChange={handleModeChange}
          onSelectAllDays={selectAllDays}
          onSelectEmptyDays={selectDaysWithoutShifts}
        />
        <SecurityCalendarGrid
          calendarDays={calendarDays}
          monthStart={monthStart}
          shifts={shifts}
          selectedDates={selectedDates}
          calendarMode={calendarMode}
          expandedCells={expandedCells}
          onCellClick={handleDayCellClick}
          onShiftClick={handleShiftClick}
          onToggleExpand={(dayKey) =>
            setExpandedCells((prev) => ({ ...prev, [dayKey]: !prev[dayKey] }))
          }
          objectsDictionary={objectsDictionary}
        />

        <SecurityCalendarActionBar
          selectedDates={selectedDates}
          onAssign={handleOpenCreateDialog}
          onClear={() => setSelectedDates([])}
        />
      </VStack>
    </>
  )
}
