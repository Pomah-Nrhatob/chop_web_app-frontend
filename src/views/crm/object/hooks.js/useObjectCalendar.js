import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  getMonth,
  getYear,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import React, { useState } from 'react'

export const useObjectCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = getYear(currentMonth)
  const month = getMonth(currentMonth) + 1

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
  const currentMonthDays = calendarDays.filter((day) => isSameMonth(day, monthStart))

  const { data: objectsDictionary = [] } = useGetDictionaryObjects()

  const [isListOpen, setIsListOpen] = useState(false)

  // СТЕЙТЫ ДЛЯ УПРАВЛЕНИЯ МОДАЛКАМИ
  const [openOneDayDialog, setOpenOneDayDialog] = useState(false)
  const [openEmptyDayDialog, setOpenEmptyDayDialog] = useState(false)
  const [emptyDayInfo, setEmptyDayInfo] = useState({})
  const [selectedWorkday, setSelectedWorkday] = useState(null)

  const [selectedDates, setSelectedDates] = useState([])

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

  return {
    currentMonth,
    setCurrentMonth,
    year,
    month,
    currentMonthDays,
    calendarDays,
    monthStart,
    objectsDictionary,
    openOneDayDialog,
    setOpenOneDayDialog,
    openEmptyDayDialog,
    setOpenEmptyDayDialog,
    emptyDayInfo,
    setEmptyDayInfo,
    selectedWorkday,
    setSelectedWorkday,
    selectedDates,
    setSelectedDates,
    handleDateClick,
    selectAllDays,
    isListOpen,
    setIsListOpen,
  }
}
