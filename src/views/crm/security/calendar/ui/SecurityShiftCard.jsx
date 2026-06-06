'use client'

import { Box, VStack, Text } from '@chakra-ui/react'

export default function SecurityShiftCard({
  shift,
  isSelected,
  isCurrentMonth,
  calendarMode,
  onClick,
  objectsDictionary = [],
}) {
  const foundObject = objectsDictionary?.find((el) => el.id == shift.securityObjectId)
  const objectTitle = foundObject ? foundObject.title : `Объект #${shift.securityObjectId}`
  const isShiftFinished =
    shift.isFinished ||
    ((shift.finishedCount || 0) >= (shift.totalWorkers || 0) && (shift.totalWorkers || 0) > 0)
  const shiftProgress =
    shift.totalWorkers > 0 ? ((shift.startedCount || 0) / shift.totalWorkers) * 100 : 0
  const shiftColor = isShiftFinished
    ? 'green'
    : shiftProgress === 100
      ? 'green'
      : shiftProgress >= 50
        ? 'yellow'
        : 'orange'

  return (
    <Box
      p={2}
      borderRadius="md"
      bg={isSelected ? 'whiteAlpha.200' : `${shiftColor}.50`}
      border="1px solid"
      borderColor={isSelected ? 'whiteAlpha.400' : `${shiftColor}.300`}
      cursor={isCurrentMonth && calendarMode === 'view' ? 'pointer' : 'default'}
      _hover={
        isCurrentMonth && calendarMode === 'view'
          ? { shadow: 'md', bg: `${shiftColor}.100` }
          : undefined
      }
      onClick={onClick}
    >
      <VStack align="stretch" gap={1}>
        <Text
          fontSize="2xs"
          fontWeight="medium"
          color={isSelected ? 'whiteAlpha.900' : 'gray.600'}
          noOfLines={1}
          title={objectTitle}
        >
          {objectTitle.length > 20 ? objectTitle.slice(0, 20) + '…' : objectTitle}
        </Text>
        <Text
          fontSize="2xs"
          color={
            isShiftFinished
              ? isSelected
                ? 'green.200'
                : 'green.600'
              : isSelected
                ? 'whiteAlpha.700'
                : 'gray.500'
          }
        >
          {isShiftFinished ? 'Завершена' : shift.isFinished ? 'Завершена' : 'Активна'}
        </Text>
      </VStack>
    </Box>
  )
}
