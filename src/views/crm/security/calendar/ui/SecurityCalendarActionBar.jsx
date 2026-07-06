'use client'

import { HStack, VStack, Text, Button } from '@chakra-ui/react'
import { format } from 'date-fns'

export default function SecurityCalendarActionBar({
  selectedDates,
  onVacation,
  onAssign,
  onClear,
  isCreatingVacation = false,
}) {
  if (selectedDates.length === 0) return null
  return (
    <HStack justify="space-between" p={4} bg="blue.900" color="white" borderRadius="lg">
      <VStack align="flex-start" gap={0}>
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
        <Button colorScheme="blue" size="md" onClick={onAssign}>
          Назначить смену
        </Button>
        <Button loading={isCreatingVacation} colorScheme="orange" size="md" onClick={onVacation}>
          В отпуск
        </Button>
        <Button
          bg="white"
          color="red.600"
          _hover={{ bg: 'red.50', color: 'red.700' }}
          size="md"
          fontWeight="bold"
          onClick={onClear}
        >
          Очистить выбор
        </Button>
      </HStack>
    </HStack>
  )
}
