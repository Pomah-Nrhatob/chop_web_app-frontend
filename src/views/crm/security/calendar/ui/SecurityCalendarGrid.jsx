'use client'

import { SimpleGrid, Text } from '@chakra-ui/react'
import { isSameMonth, isSameDay } from 'date-fns'
import SecurityCalendarDayCell from './SecurityCalendarDayCell'

export default function SecurityCalendarGrid({
  calendarDays,
  monthStart,
  shifts,
  selectedDates,
  calendarMode,
  expandedCells,
  onCellClick,
  onShiftClick,
  onToggleExpand,
  objectsDictionary,
}) {
  return (
    <SimpleGrid columns={7} gap={1}>
      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
        <Text key={d} textAlign="center" fontSize="sm" fontWeight="bold" color="gray.400">
          {d}
        </Text>
      ))}
      {calendarDays.map((day, idx) => {
        const isSelected = selectedDates.some((d) => isSameDay(d, day))
        const isToday = isSameDay(day, new Date())
        const isCurrentMonth = isSameMonth(day, monthStart)
        return (
          <SecurityCalendarDayCell
            key={idx}
            day={day}
            shifts={shifts}
            isSelected={isSelected}
            isToday={isToday}
            isCurrentMonth={isCurrentMonth}
            calendarMode={calendarMode}
            expandedCells={expandedCells}
            onCellClick={() => onCellClick?.(day)}
            onShiftClick={onShiftClick}
            onToggleExpand={onToggleExpand}
            objectsDictionary={objectsDictionary}
          />
        )
      })}
    </SimpleGrid>
  )
}
