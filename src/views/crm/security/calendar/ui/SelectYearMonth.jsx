// src/views/crm/security/calendar/ui/SelectYearMonth.jsx
'use client'

import { HStack, Box } from '@chakra-ui/react'
import { LuChevronDown } from 'react-icons/lu'

const MONTHS = [
  { value: 1, label: 'Январь' },
  { value: 2, label: 'Февраль' },
  { value: 3, label: 'Март' },
  { value: 4, label: 'Апрель' },
  { value: 5, label: 'Май' },
  { value: 6, label: 'Июнь' },
  { value: 7, label: 'Июль' },
  { value: 8, label: 'Август' },
  { value: 9, label: 'Сентябрь' },
  { value: 10, label: 'Октябрь' },
  { value: 11, label: 'Ноябрь' },
  { value: 12, label: 'Декабрь' },
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i)

export default function SelectYearMonth({ year, month, onMonthChange, onYearChange }) {
  return (
    <HStack gap={2} wrap="wrap">
      {/* Месяц */}
      <Box position="relative">
        <Box
          as="select"
          value={month}
          onChange={onMonthChange}
          px={3}
          py={2}
          fontSize="sm"
          fontWeight="medium"
          borderRadius="md"
          border="2px solid"
          borderColor="blue.200"
          bg="blue.50"
          color="blue.700"
          _focus={{ outline: 'none', ring: '2px', ringColor: 'blue.500' }}
          cursor="pointer"
          appearance="none"
          pr={8}
          minW="110px"
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Box>
        <Box
          position="absolute"
          right={2}
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          color="blue.500"
        >
          <LuChevronDown size={16} />
        </Box>
      </Box>

      {/* Год */}
      <Box position="relative">
        <Box
          as="select"
          value={year}
          onChange={onYearChange}
          px={3}
          py={2}
          fontSize="sm"
          fontWeight="medium"
          borderRadius="md"
          border="2px solid"
          borderColor="blue.200"
          bg="blue.50"
          color="blue.700"
          _focus={{ outline: 'none', ring: '2px', ringColor: 'blue.500' }}
          cursor="pointer"
          appearance="none"
          pr={8}
          minW="75px"
          textAlign="center"
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Box>
        <Box
          position="absolute"
          right={2}
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
          color="blue.500"
        >
          <LuChevronDown size={16} />
        </Box>
      </Box>
    </HStack>
  )
}
