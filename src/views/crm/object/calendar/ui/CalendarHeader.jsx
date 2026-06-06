'use client'

import { Box, VStack, HStack, Button, Text, Flex } from '@chakra-ui/react'
import { LuChevronDown, LuChevronUp, LuEye, LuPencil } from 'react-icons/lu'

export default function CalendarHeader({
  year,
  month,
  calendarMode,

  onDateChange,
  onModeChange,
  onPrevMonth,
  onNextMonth,

  onSelectAllDays,
  onSelectEmptyDays,
}) {
  return (
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
          <HStack gap={2} wrap="wrap">
            <Box position="relative">
              <Box
                as="select"
                value={month}
                onChange={(e) => onDateChange?.({ year, month: Number(e.target.value) })}
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
                <option value="1">Январь</option>
                <option value="2">Февраль</option>
                <option value="3">Март</option>
                <option value="4">Апрель</option>
                <option value="5">Май</option>
                <option value="6">Июнь</option>
                <option value="7">Июль</option>
                <option value="8">Август</option>
                <option value="9">Сентябрь</option>
                <option value="10">Октябрь</option>
                <option value="11">Ноябрь</option>
                <option value="12">Декабрь</option>
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

            <Box position="relative">
              <Box
                as="select"
                value={year}
                onChange={(e) => onDateChange?.({ year: Number(e.target.value), month })}
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
                {Array.from({ length: 11 }, (_, i) => {
                  const y = new Date().getFullYear() - 5 + i
                  return (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  )
                })}
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
        </VStack>

        <Flex
          align="center"
          gap={2}
          wrap="wrap"
          justifyContent={{ base: 'flex-start', md: 'flex-end' }}
          w={{ base: '100%', md: 'auto' }}
        >
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
              {calendarMode === 'view' ? '🔒 Просмотр' : '✏️ Редактирование'}
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
              onClick={onPrevMonth}
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
              onClick={onNextMonth}
              aria-label="Следующий месяц"
              borderRadius={0}
              _last={{ borderRadius: '0 md md 0' }}
            >
              <LuChevronDown size={18} />
            </Button>
          </HStack>
        </Flex>
      </Flex>

      {calendarMode === 'edit' && (
        <HStack gap={2} wrap="wrap" pt={2} justifyContent="flex-start">
          <Button size="xs" variant="outline" onClick={onSelectAllDays} flex={1}>
            Весь месяц
          </Button>
          <Button size="xs" variant="outline" onClick={onSelectEmptyDays} flex={1}>
            Без смен
          </Button>
        </HStack>
      )}
    </Box>
  )
}
