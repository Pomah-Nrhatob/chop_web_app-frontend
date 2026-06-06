'use client'

import { Box, VStack, Badge, Button, Text } from '@chakra-ui/react'
import { format, isSameDay } from 'date-fns'
import SecurityShiftCard from './SecurityShiftCard'

export default function SecurityCalendarDayCell({
  day,
  shifts,
  isSelected,
  isToday,
  isCurrentMonth,
  calendarMode,
  expandedCells,
  onCellClick,
  onShiftClick,
  onToggleExpand,
  objectsDictionary,
}) {
  const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
  const isDayPopulated = dayShifts.length > 0
  const dayKey = format(day, 'yyyy-MM-dd')
  const isCellExpanded = !!expandedCells[dayKey]
  const borderColor =
    calendarMode === 'edit' && isSelected ? 'blue.500' : isToday ? 'blue.300' : 'gray.100'
  const borderWidth = calendarMode === 'edit' && isSelected ? '2px' : '1px'

  return (
    <Box
      minH="110px"
      border={`${borderWidth} solid`}
      borderColor={borderColor}
      bg={isSelected ? 'blue.500' : 'transparent'}
      color={isSelected ? 'white' : 'black'}
      p={1}
      cursor={isCurrentMonth && calendarMode === 'edit' ? 'pointer' : 'default'}
      transition="0.1s"
      _hover={
        isCurrentMonth && calendarMode === 'edit'
          ? { bg: isSelected ? 'blue.600' : 'gray.50' }
          : undefined
      }
      onClick={onCellClick}
      opacity={isCurrentMonth ? 1 : 0.3}
      display="flex"
      flexDirection="column"
    >
      <Text fontWeight={isToday ? 'bold' : 'medium'} fontSize="sm">
        {format(day, 'd')}
      </Text>
      <Box flex={1} display="flex" alignItems="center" justifyContent="center">
        {isDayPopulated
          ? (() => {
              if (dayShifts.length > 1 && !isCellExpanded) {
                return (
                  <Badge
                    colorPalette="blue"
                    variant="subtle"
                    fontSize="2xs"
                    fontWeight="medium"
                    cursor="pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleExpand?.(dayKey)
                    }}
                  >
                    Смен: {dayShifts.length}
                  </Badge>
                )
              }
              return (
                <Box
                  maxH="140px"
                  overflowY="auto"
                  sx={{
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-thumb': { bg: 'gray.300', borderRadius: 'full' },
                  }}
                >
                  <VStack align="stretch" gap={1.5}>
                    {dayShifts.map((shift) => (
                      <SecurityShiftCard
                        key={shift.id}
                        shift={shift}
                        isSelected={isSelected}
                        isCurrentMonth={isCurrentMonth}
                        calendarMode={calendarMode}
                        objectsDictionary={objectsDictionary}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (calendarMode === 'view') onShiftClick?.(e, shift)
                        }}
                      />
                    ))}
                  </VStack>
                </Box>
              )
            })()
          : null}
      </Box>
      {dayShifts.length > 1 && isCellExpanded && (
        <Button
          size="xs"
          variant="ghost"
          colorPalette="gray"
          fontSize="2xs"
          px={1}
          mt={-1}
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand?.(dayKey)
          }}
        >
          Свернуть
        </Button>
      )}
    </Box>
  )
}
