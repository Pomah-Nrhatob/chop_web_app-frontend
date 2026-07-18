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
  addMonths,
  subMonths,
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
import { useCreateVacation } from '@/features/calendar/api/use-create-vacation'
import VacationConfirmModal from '@/components/calendar/vacationModal/VacationConfirmModal'
import OneDayVacationDialog from '@/components/calendar/oneDayDialog/OneDayVacationDialog'
import { useActiveCompanyId } from '@/shared/hooks/useActiveCompanyId'
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'

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
  const [openVacationDialog, setOpenVacationDialog] = useState(false)
  const [selectedVacationWorkday, setSelectedVacationWorkday] = useState(null)
  const [vacationConfirmData, setVacationConfirmData] = useState({
    isOpen: false,
    startDate: null,
    endDate: null,
    missingDays: [],
  })

  const params = useParams()
  const securityId = Number(params.id)

  const { mutate: createVacation, isPending: isCreatingVacation } = useCreateVacation()
  const activeCompanyId = useActiveCompanyId()

  const { data: securityDictionary = [], isLoading: isSecurityDictLoading } =
    useGetDictionarySecurities(activeCompanyId)

  const { data: objectsDictionary = [], isLoading: isObjectsDictLoading } =
    useGetDictionaryObjects(activeCompanyId)

  const description = useMemo(() => {
    if (isSecurityDictLoading || !securityDictionary?.length) {
      return 'Раздел для управления рабочими днями сотрудника'
    }

    const currentSecurity = securityDictionary.find((el) => el.id === securityId)

    return `Раздел для управления рабочими днями сотрудника ${
      currentSecurity ? `${currentSecurity.name} ${currentSecurity.surname}` : ''
    }`
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

  const formatDateForApi = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const handleVacationClick = () => {
    if (selectedDates.length === 0) return

    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime())
    const startDate = sortedDates[0]
    const endDate = sortedDates[sortedDates.length - 1]

    const allDaysInRange = eachDayOfInterval({ start: startDate, end: endDate })
    const selectedSet = new Set(selectedDates.map((d) => d.getTime()))
    const missingDays = allDaysInRange.filter((d) => !selectedSet.has(d.getTime()))

    if (missingDays.length > 0) {
      setVacationConfirmData({
        isOpen: true,
        startDate,
        endDate,
        missingDays,
      })
    } else {
      createVacation(
        {
          securityId: Number(securityId),
          startDate: formatDateForApi(startDate),
          endDate: formatDateForApi(endDate),
        },
        {
          onSuccess: () => {
            setSelectedDates([]) // ✅ Снимаем выделение
          },
        }
      )
    }
  }

  // В handleConfirmVacation:
  const handleConfirmVacation = () => {
    if (!vacationConfirmData.startDate || !vacationConfirmData.endDate) return

    createVacation(
      {
        securityId: Number(securityId),
        startDate: formatDateForApi(vacationConfirmData.startDate),
        endDate: formatDateForApi(vacationConfirmData.endDate),
      },
      {
        onSuccess: () => {
          setSelectedDates([]) // ✅ Снимаем выделение
          setVacationConfirmData({
            isOpen: false,
            startDate: null,
            endDate: null,
            missingDays: [],
          })
        },
      }
    )
  }

  // ✅ Закрытие модалки
  const handleCloseVacationModal = () => {
    setVacationConfirmData({
      isOpen: false,
      startDate: null,
      endDate: null,
      missingDays: [],
    })
  }

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
        const shift = dayShifts[0]

        // ✅ Определяем тип дня и открываем нужный диалог
        if (shift.isVacation) {
          setSelectedVacationWorkday(shift.id)
          setOpenVacationDialog(true)
        } else {
          setSelectedWorkday(shift.id)
          setOpenOneDayDialog(true)
        }
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

    // ✅ Определяем тип дня
    if (shift.isVacation) {
      setSelectedVacationWorkday(shift.id)
      setOpenVacationDialog(true)
    } else {
      setSelectedWorkday(shift.id)
      setOpenOneDayDialog(true)
    }
  }

  const handleOpenCreateDialog = () => {
    setEmptyDayInfo({
      securityId,
      dates: selectedDates,
    })

    setOpenEmptyDayDialog(true)
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

  return (
    <>
      <OneDayVacationDialog
        open={openVacationDialog}
        setOpen={setOpenVacationDialog}
        selectedWorkday={selectedVacationWorkday}
        setSelectedWorkday={setSelectedVacationWorkday}
      />
      <VacationConfirmModal
        isOpen={vacationConfirmData.isOpen}
        onClose={handleCloseVacationModal}
        onConfirm={handleConfirmVacation}
        startDate={vacationConfirmData.startDate}
        endDate={vacationConfirmData.endDate}
        missingDays={vacationConfirmData.missingDays}
        isLoading={isCreatingVacation}
      />
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
        text={description}
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
                {isListOpen ? 'Скрыть список сотрудников' : 'Открыть список сотрудников'}
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
                <SecurityList />
              </Box>

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
                onDateChange={handleDateChange}
                onModeChange={handleModeChange}
                onSelectAllDays={selectAllDays}
                onSelectEmptyDays={selectDaysWithoutShifts}
                onPrevMonth={() => setCurrentMonth(subMonths(currentMonth, 1))}
                onNextMonth={() => setCurrentMonth(addMonths(currentMonth, 1))}
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
                onVacation={handleVacationClick}
                onClear={() => setSelectedDates([])}
                isCreatingVacation={isCreatingVacation}
              />
            </VStack>
          )}
        </NoActiveCompany>
      </ContainerForPage>
    </>
  )
}
