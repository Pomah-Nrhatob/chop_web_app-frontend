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

import { useGetCalendarObjectWorkdays } from '@/features/calendar-object/api/use-get-calendar-workdays'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'

import ObjectList from '../../ui/ObjectList'
import EmptyDayDialogObjects from '@/components/calendar/emptyDayDialog/EmptyDialogObjects'
import OneDayDialog from '@/components/calendar/oneDayDialog/OneDayDialog'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import CalendarActionBar from './CalendarActionBar'
import ObjectReportGenerator from '@/widgets/report-generator/ui/ObjectReportGenerator'
import ContainerForPage from '@/components/containerForPage/ContainerForPage'
import { NoActiveCompany } from '@/components/ui/NoActiveCompany'
import { useActiveCompanyId } from '@/shared/hooks/useActiveCompanyId'

export default function ObjectCalendar() {
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
  const securityObjectId = Number(params.id)
  const activeCompanyId = useActiveCompanyId()

  const { data: objectsDictionary = [], isLoading: isDictLoading } =
    useGetDictionaryObjects(activeCompanyId)

  const stableTitle = useMemo(() => {
    if (isDictLoading || !objectsDictionary?.length) {
      return `Объект #${securityObjectId}`
    }

    const currentObject = objectsDictionary.find((el) => el.id === securityObjectId)

    return currentObject ? currentObject.title : `Объект #${securityObjectId}`
  }, [isDictLoading, objectsDictionary, securityObjectId])

  const year = getYear(currentMonth)
  const month = getMonth(currentMonth) + 1

  const {
    data: serverShifts,
    isLoading,
    isError,
    isFetching,
  } = useGetCalendarObjectWorkdays({
    securityObjectId,
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

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 }),
  })

  const currentMonthDays = calendarDays.filter((day) => isSameMonth(day, monthStart))

  const isPageLoading = isDictLoading || isLoading || isFetching

  const handleDateClick = (day) => {
    setSelectedDates((prev) =>
      prev.some((d) => isSameDay(d, day)) ? prev.filter((d) => !isSameDay(d, day)) : [...prev, day]
    )
  }

  const handleDayCellClick = (day) => {
    if (!isSameMonth(day, monthStart)) return

    const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
    const totalWorkersInDay = dayShifts.reduce((sum, s) => sum + (s.totalWorkers || 0), 0)

    if (calendarMode === 'view') {
      if (dayShifts.length > 0 && totalWorkersInDay > 0 && dayShifts[0]?.id) {
        setSelectedWorkday(dayShifts[0].objectWorkdayId || dayShifts[0].id)
        setOpenOneDayDialog(true)
      }

      return
    }

    handleDateClick(day)
  }

  const handleShiftClick = (e, shift) => {
    e.stopPropagation()

    if (calendarMode === 'edit') return

    setSelectedWorkday(shift.id)
    setOpenOneDayDialog(true)
  }

  const handleToggleExpand = (dayKey) => {
    setExpandedCells((prev) => ({
      ...prev,
      [dayKey]: !prev[dayKey],
    }))
  }

  const handleDateChange = ({ year: y, month: m }) => {
    setCurrentMonth(new Date(y, m - 1, 1))
  }

  const handleModeChange = (mode) => {
    setCalendarMode(mode)

    if (mode === 'view') {
      setSelectedDates([])
    }
  }

  const selectAllDays = () => {
    setSelectedDates(currentMonthDays)
  }

  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter((day) => {
      const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
      const total = dayShifts.reduce((sum, s) => sum + (s.totalWorkers || 0), 0)

      return dayShifts.length === 0 || total === 0
    })

    setSelectedDates(emptyDays)
  }

  const handleOpenCreateDialog = () => {
    setEmptyDayInfo({
      objectId: securityObjectId,
      dates: selectedDates,
    })

    setOpenEmptyDayDialog(true)
  }

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

      <ContainerForPage
        title="Календарь объекта"
        text={`Раздел для управления рабочими днями объекта "${stableTitle || ''}"`}
        actionComponent={
          !isPageLoading &&
          !isError && (
            <ObjectReportGenerator
              itemId={securityObjectId || null}
              year={year || null}
              month={month || null}
            />
          )
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
            <VStack
              align="stretch"
              gap={6}
              p={4}
              bg="white"
              borderRadius="xl"
              shadow="sm"
              mb={{ base: 14, md: 12 }}
            >
              <Button
                variant="ghost"
                justifyContent="space-between"
                onClick={() => setIsListOpen((prev) => !prev)}
              >
                {isListOpen ? 'Скрыть список объектов' : 'Открыть список объектов'}
                {isListOpen ? <LuChevronUp /> : <LuChevronDown />}
              </Button>

              <Box
                overflow="hidden"
                transition="max-height .25s ease, opacity .2s ease"
                maxH={isListOpen ? '100%' : '0'}
                opacity={isListOpen ? 1 : 0}
                shadow="md"
                borderRadius="xl"
              >
                <ObjectList />
              </Box>

              <CalendarHeader
                objectTitle={stableTitle}
                currentMonth={currentMonth}
                year={year}
                month={month}
                calendarMode={calendarMode}
                isListOpen={isListOpen}
                onToggleList={() => setIsListOpen((prev) => !prev)}
                onDateChange={handleDateChange}
                onModeChange={handleModeChange}
                onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
                onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
                onToday={() => setCurrentMonth(new Date())}
                onSelectAllDays={selectAllDays}
                onSelectEmptyDays={selectDaysWithoutShifts}
              />

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

              <CalendarActionBar
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
