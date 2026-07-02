'use client'

import React, { useState, useMemo } from 'react'
import { Box, Text, VStack, Button, Flex, Spinner } from '@chakra-ui/react'
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
import SecurityReportGenerator from '@/widgets/report-generator/ui/SecurityReportGenerator'
import ContainerForPage from '@/components/containerForPage/ContainerForPage'
import { NoActiveCompany } from '@/components/ui/NoActiveCompany'

export default function SecurityCalendar() {
  const [calendarMode, setCalendarMode] = useState('view')
  const [expandedCells, setExpandedCells] = useState({})
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState([])
  const [isListOpen, setIsListOpen] = useState(false)
  const [openOneDayDialog, setOpenOneDayDialog] = useState(false)
  const [openEmptyDayDialog, setOpenEmptyDayDialog] = useState(false)
  const [emptyDayInfo, setEmptyDayInfo] = useState({})
  const [selectedWorkday, setSelectedWorkday] = useState(null)

  const params = useParams()
  const securityId = Number(params.id)

  const { data: securityDictionary = [], isLoading: isSecurityDictLoading } =
    useGetDictionarySecurities()

  const { data: objectsDictionary = [], isLoading: isObjectsDictLoading } =
    useGetDictionaryObjects()

  const stableTitle = useMemo(() => {
    if (isSecurityDictLoading || !securityDictionary?.length) {
      return `Сотрудник #${securityId}`
    }

    const currentSecurity = securityDictionary.find((el) => el.id === securityId)

    return currentSecurity
      ? `${currentSecurity.name} ${currentSecurity.surname}`
      : `Сотрудник #${securityId}`
  }, [isSecurityDictLoading, securityDictionary, securityId])

  const year = getYear(currentMonth)
  const month = getMonth(currentMonth) + 1

  const {
    data: serverShifts,
    isLoading,
    isError,
    isFetching,
  } = useGetCalendarSecurityWorkdays({
    securityId,
    year,
    month,
  })

  const shifts = useMemo(() => {
    if (!serverShifts || !Array.isArray(serverShifts)) return []

    return serverShifts.map((shift) => ({
      ...shift,
      parsedDate:
        typeof shift.timestamp === 'string' ? parseISO(shift.timestamp) : new Date(shift.timestamp),
    }))
  }, [serverShifts])

  const monthStart = startOfMonth(currentMonth)

  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 })

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  const currentMonthDays = calendarDays.filter((day) => isSameMonth(day, monthStart))

  const isPageLoading = isSecurityDictLoading || isObjectsDictLoading || isLoading || isFetching

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

    if (calendarMode === 'view') {
      if (isDayPopulated && dayShifts.length > 1) {
        const dayKey = format(day, 'yyyy-MM-dd')

        setExpandedCells((prev) => ({
          ...prev,
          [dayKey]: !prev[dayKey],
        }))

        return
      }

      if (dayShifts[0]?.id) {
        setSelectedWorkday(dayShifts[0].id)
        setOpenOneDayDialog(true)
      }

      return
    }

    handleDateClick(day)
  }

  const selectAllDays = () => {
    setSelectedDates(currentMonthDays)
  }

  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter((day) => {
      const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))

      return dayShifts.length === 0
    })

    setSelectedDates(emptyDays)
  }

  const handleShiftClick = (e, shift) => {
    e.stopPropagation()

    if (calendarMode === 'edit') return

    setSelectedWorkday(shift.id)
    setOpenOneDayDialog(true)
  }

  const handleOpenCreateDialog = () => {
    setEmptyDayInfo({
      securityId,
      dates: selectedDates,
    })

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

    if (mode === 'view') {
      setSelectedDates([])
    }
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

      <ContainerForPage
        title="Календарь сотрудника"
        text={`Раздел для управления рабочими днями сотрудника ${stableTitle}`}
        actionComponent={
          !isPageLoading &&
          !isError && <SecurityReportGenerator itemId={securityId} year={year} month={month} />
        }
      >
        <NoActiveCompany>
          {isPageLoading ? (
            <Flex
              minH="320px"
              align="center"
              justify="center"
              bg="white"
              borderRadius="xl"
              shadow="sm"
            >
              <Spinner size="lg" color="blue.500" thickness="3px" />
            </Flex>
          ) : isError ? (
            <Flex
              minH="320px"
              align="center"
              justify="center"
              bg="white"
              borderRadius="xl"
              shadow="sm"
              color="red.500"
            >
              <Text>Ошибка загрузки данных с сервера</Text>
            </Flex>
          ) : (
            <VStack align="stretch" gap={6} p={4} bg="white" borderRadius="xl" shadow="sm">
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
                  setExpandedCells((prev) => ({
                    ...prev,
                    [dayKey]: !prev[dayKey],
                  }))
                }
                objectsDictionary={objectsDictionary}
              />

              <SecurityCalendarActionBar
                selectedDates={selectedDates}
                onAssign={handleOpenCreateDialog}
                onClear={() => setSelectedDates([])}
              />
            </VStack>
          )}
        </NoActiveCompany>
      </ContainerForPage>
    </>
  )
}
