'use client'

import {
  Box,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  Text,
  Button,
  IconButton,
  Select,
  createListCollection,
  Icon,
} from '@chakra-ui/react'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'
import { useCalendarAllObjectsStore } from '@/features/calendar/store/useCalendarAllObjectsStore'
import { FiRefreshCw } from 'react-icons/fi'
import SelectYearMonth from '@/views/calendarAllObjects/ui/SelectYearMonth'

const MONTHS = createListCollection({
  items: [
    { label: 'Январь', value: '1' },
    { label: 'Февраль', value: '2' },
    { label: 'Март', value: '3' },
    { label: 'Апрель', value: '4' },
    { label: 'Май', value: '5' },
    { label: 'Июнь', value: '6' },
    { label: 'Июль', value: '7' },
    { label: 'Август', value: '8' },
    { label: 'Сентябрь', value: '9' },
    { label: 'Октябрь', value: '10' },
    { label: 'Ноябрь', value: '11' },
    { label: 'Декабрь', value: '12' },
  ],
})

const YEAR_OPTIONS = createListCollection({
  items: Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { label: String(year), value: String(year) }
  }),
})

export default function HeaderButtons({ refetch }) {
  const { queryParams, setQueryParams, nextDayRange, prevDayRange, getDaysInMonth } =
    useCalendarAllObjectsStore()

  const daysInMonth = getDaysInMonth()

  // ✅ Логика кнопок диапазонов
  const dayRanges = []

  // Базовые диапазоны по 5 дней
  const ranges = [
    { start: 1, end: 5 },
    { start: 6, end: 10 },
    { start: 11, end: 15 },
    { start: 16, end: 20 },
    { start: 21, end: 25 },
  ]

  ranges.forEach(({ start, end }) => {
    const actualEnd = Math.min(end, daysInMonth)
    dayRanges.push({ start, end: actualEnd })
  })

  // Последний диапазон
  const lastStart = 26
  if (lastStart <= daysInMonth) {
    dayRanges.push({ start: lastStart, end: daysInMonth })
  }

  // ✅ ОТДЕЛЬНАЯ кнопка "31" только если 31 день
  if (daysInMonth === 31) {
    dayRanges.push({ start: 31, end: 31 })
  }

  const setDayRange = (start, end) => {
    setQueryParams({
      startDay: start,
      endDay: end,
    })
  }

  const isActiveRange = (start, end) => queryParams.startDay === start && queryParams.endDay === end

  return (
    <VStack align="stretch" gap={5} spacing={3}>
      {/* Верхняя строка: селекты + обновить */}
      <HStack justify="space-between" align="start" spacing={{ base: 2, md: 4 }} wrap="wrap">
        <SelectYearMonth />
      </HStack>

      {/* ✅ Быстрые кнопки диапазонов */}
      <Wrap spacing={1} justify="center">
        {dayRanges.map(({ start, end }) => (
          <WrapItem key={`${start}-${end}`}>
            <Button
              size="xs"
              variant={isActiveRange(start, end) ? 'solid' : 'outline'}
              colorScheme={isActiveRange(start, end) ? 'blue' : 'gray'}
              onClick={() => setDayRange(start, end)}
              fontSize="xs"
              minW="auto"
              px={2}
              py={1}
            >
              {start}
              {start !== end ? `-${end}` : null}
            </Button>
          </WrapItem>
        ))}
        <Button
          size="xs"
          variant="outline"
          onClick={refetch}
          flexShrink={0}
          display={{ base: 'flex', md: 'flex' }} // Всегда показывается
          minW={{ base: 'auto', md: '100px' }}
          fontSize="xs"
        >
          <Icon>
            <FiRefreshCw />
          </Icon>
          <Text display={{ base: 'none', md: 'flex' }}>Обновить</Text>
        </Button>
      </Wrap>
    </VStack>
  )
}
