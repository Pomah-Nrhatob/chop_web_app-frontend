'use client'

import React, { useState } from 'react'
import { Box, SimpleGrid, Text, VStack, HStack, Button, Badge } from '@chakra-ui/react'
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
} from 'date-fns'
import { ru } from 'date-fns/locale'

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  // Теперь храним массив выбранных дат
  const [selectedDates, setSelectedDates] = useState([])

  const [shifts] = useState([
    { id: 1, date: new Date(2026, 3, 15), status: 'active', title: 'Смена 1' },
  ])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
  const currentMonthDays = calendarDays.filter((day) => isSameMonth(day, monthStart))

  // Логика клика: если дата уже есть в массиве — удаляем, если нет — добавляем
  const handleDateClick = (day) => {
    setSelectedDates((prev) => {
      const exists = prev.find((d) => isSameDay(d, day))
      if (exists) {
        return prev.filter((d) => !isSameDay(d, day))
      }
      return [...prev, day]
    })
  }

  // Выделить все дни месяца
  const selectAllDays = () => {
    setSelectedDates(currentMonthDays)
  }

  // Выделить только пустые дни (без смен)
  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter(
      (day) => !shifts.some((shift) => isSameDay(shift.date, day))
    )
    setSelectedDates(emptyDays)
  }

  return (
    <VStack align="stretch" spacing={6} p={4} bg="white" borderRadius="xl" shadow="sm">
      <HStack justify="space-between">
        <VStack align="start" spacing={0}>
          <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </Text>
          <HStack spacing={2} mt={2}>
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

      <SimpleGrid columns={7} spacing={1}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
          <Text key={d} textAlign="center" fontSize="sm" fontWeight="bold" color="gray.400">
            {d}
          </Text>
        ))}

        {calendarDays.map((day, idx) => {
          // Проверяем, выбрана ли текущая дата
          const isSelected = selectedDates.some((d) => isSameDay(d, day))
          const dayShifts = shifts.filter((s) => isSameDay(s.date, day))
          const isToday = isSameDay(day, new Date())

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
              onClick={() => handleDateClick(day)}
              opacity={isSameMonth(day, monthStart) ? 1 : 0.3}
            >
              <Text fontWeight={isToday ? 'bold' : 'medium'} fontSize="sm">
                {format(day, 'd')}
              </Text>

              <VStack align="stretch" spacing={1} mt={1}>
                {dayShifts.map((shift) => (
                  <Badge
                    key={shift.id}
                    colorScheme={isSelected ? 'whiteAlpha' : 'orange'}
                    fontSize="2xs"
                    variant="solid"
                  >
                    {shift.title}
                  </Badge>
                ))}
              </VStack>
            </Box>
          )
        })}
      </SimpleGrid>

      {selectedDates.length > 0 && (
        <HStack justify="space-between" p={4} bg="blue.900" color="white" borderRadius="lg">
          <VStack align="start" spacing={0}>
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
            <Button colorScheme="blue" size="md">
              Назначить смену
            </Button>
            <Button variant="whiteAlpha" onClick={() => setSelectedDates([])}>
              Сброс
            </Button>
          </HStack>
        </HStack>
      )}
    </VStack>
  )
}
