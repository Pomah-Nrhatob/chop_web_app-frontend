'use client'

import { Box, Heading, Text, Button, Flex, VStack, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import SecurityList from '../../ui/SecurityList'
import { LuChevronDown, LuChevronUp, LuEye, LuPencil } from 'react-icons/lu'
import { subMonths, addMonths, isSameMonth, isSameDay } from 'date-fns'
import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import SelectYearMonth from './SelectYearMonth'

export default function SecurityCalendarHeader({
  securityId,
  month,
  year,
  currentMonth,
  setCurrentMonth,
  calendarDays,
  monthStart,
  setSelectedDates,
  calendarMode,
  shifts = [],
  onMonthChange,
  onYearChange,
  onModeChange,
  onSelectAllDays,
  onSelectEmptyDays,
}) {
  const [isListOpen, setIsListOpen] = useState(false)
  const { data: securityDictionary = [] } = useGetDictionarySecurities()
  const currentSecurity = securityDictionary.find((el) => el.id === securityId)
  const currentMonthDays = calendarDays?.filter((day) => isSameMonth(day, monthStart)) || []

  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter((day) => {
      const dayShifts = shifts.filter((shift) => isSameDay(shift.parsedDate, day))
      return dayShifts.length === 0
    })
    setSelectedDates(emptyDays)
  }

  return (
    <>
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
      <Button
        variant="ghost"
        justifyContent="space-between"
        onClick={() => setIsListOpen(!isListOpen)}
      >
        {isListOpen ? 'Скрыть список охранников' : 'Открыть список охранников'}
        {isListOpen ? <LuChevronUp /> : <LuChevronDown />}
      </Button>
      {isListOpen && <SecurityList />}
      <Box w="100%">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          gap={4}
          w="100%"
          pb={2}
          borderBottom="1px solid"
          borderColor="gray.100"
        >
          <VStack align="flex-start" gap={2} w={{ base: '100%', md: 'auto' }}>
            <SelectYearMonth
              year={year}
              month={month}
              onMonthChange={onMonthChange}
              onYearChange={onYearChange}
            />
          </VStack>
          <HStack gap={1} wrap="wrap" justifyContent={{ base: 'flex-start', md: 'flex-end' }}>
            <VStack align="flex-start" gap={0} w={{ base: '100%', md: 'auto' }}>
              <HStack gap={2} align="center" wrap="wrap">
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  Режим:
                </Text>
                <Box
                  display="inline-flex"
                  borderRadius="full"
                  border="1px solid"
                  borderColor="gray.300"
                  bg="gray.100"
                  p="2px"
                  role="radiogroup"
                >
                  <Button
                    role="radio"
                    aria-checked={calendarMode === 'view'}
                    size="sm"
                    variant={calendarMode === 'view' ? 'solid' : 'ghost'}
                    colorPalette={calendarMode === 'view' ? 'blue' : 'gray'}
                    borderRadius="full"
                    px={{ base: 3, md: 4 }}
                    minW={{ base: '32px', md: '100px' }}
                    transition="all 0.15s"
                    onClick={() => onModeChange?.('view')}
                    leftIcon={<LuEye size={15} />}
                  >
                    <Box display={{ base: 'none', md: 'inline' }} fontWeight="medium">
                      Просмотр
                    </Box>
                  </Button>
                  <Button
                    role="radio"
                    aria-checked={calendarMode === 'edit'}
                    size="sm"
                    variant={calendarMode === 'edit' ? 'solid' : 'ghost'}
                    colorPalette={calendarMode === 'edit' ? 'orange' : 'gray'}
                    borderRadius="full"
                    px={{ base: 3, md: 4 }}
                    minW={{ base: '32px', md: '115px' }}
                    transition="all 0.15s"
                    onClick={() => onModeChange?.('edit')}
                    leftIcon={<LuPencil size={15} />}
                  >
                    <Box display={{ base: 'none', md: 'inline' }} fontWeight="medium">
                      Редактирование
                    </Box>
                  </Button>
                </Box>
              </HStack>
              <Text fontSize="2xs" color="gray.500" mt={1} lineHeight="1.4" w="100%">
                {calendarMode === 'view' ? '🔒 Просмотр.' : '✏️ Редактирование.'}
              </Text>
            </VStack>
            <Box display={{ base: 'none', md: 'block' }} w="1px" h="24px" bg="gray.200" />
            <HStack
              gap={0}
              borderRadius="md"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
            >
              <Button
                size="sm"
                variant="ghost"
                minW="auto"
                w="32px"
                h="32px"
                p={0}
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                aria-label="Предыдущий месяц"
                borderRadius={0}
                _first={{ borderRadius: 'md 0 0 md' }}
              >
                <LuChevronUp size={18} />
              </Button>
              <Box w="1px" h="24px" bg="gray.200" />
              <Button
                size="sm"
                variant="ghost"
                minW="auto"
                w="32px"
                h="32px"
                p={0}
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                aria-label="Следующий месяц"
                borderRadius={0}
                _last={{ borderRadius: '0 md md 0' }}
              >
                <LuChevronDown size={18} />
              </Button>
            </HStack>
          </HStack>
        </Flex>
        {calendarMode === 'edit' && (
          <HStack gap={2} wrap="wrap" pt={2} justifyContent="flex-start">
            <Button size="xs" variant="outline" onClick={onSelectAllDays} flex={1}>
              Весь месяц
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={onSelectEmptyDays || selectDaysWithoutShifts}
              flex={1}
            >
              Без смен
            </Button>
          </HStack>
        )}
      </Box>
    </>
  )
}
