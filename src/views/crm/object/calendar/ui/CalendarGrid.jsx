'use client'

import { SimpleGrid, Text } from '@chakra-ui/react'
import CalendarDayCell from './CalendarDayCell'

export default function CalendarGrid({
  calendarDays,
  monthStart,
  shifts,
  selectedDates,
  isToday,
  calendarMode,
  expandedCells,
  onCellClick,
  onShiftClick,
  onToggleExpand,
  objectsDictionary,
}) {
  return (
    <SimpleGrid columns={7} gap={1}>
      {/* Заголовки дней недели */}
      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
        <Text key={d} textAlign="center" fontSize="sm" fontWeight="bold" color="gray.400">
          {d}
        </Text>
      ))}

      {/* Ячейки дней */}
      {calendarDays.map((day, idx) => {
        const isSelected = selectedDates.some((d) => d.toDateString() === day.toDateString())
        const isCurrentMonth =
          day.getMonth() === monthStart.getMonth() && day.getFullYear() === monthStart.getFullYear()

        return (
          <CalendarDayCell
            key={idx}
            day={day}
            shifts={shifts}
            isSelected={isSelected}
            isToday={isToday(day)}
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
