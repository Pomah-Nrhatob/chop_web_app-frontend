// src/views/crm/object/calendar/ui/CalendarDayCell.jsx
'use client'

import React, { memo } from 'react'
import { Box, VStack, HStack, Badge, Text, Icon } from '@chakra-ui/react'
import { format, isSameDay } from 'date-fns'
import { MdPeopleOutline, MdCheckCircle, MdPlayCircleFilled } from 'react-icons/md'

const CalendarDayCell = ({
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
}) => {
  const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
  const isDayPopulated = dayShifts.length > 0
  const dayKey = format(day, 'yyyy-MM-dd')
  const isCellExpanded = !!expandedCells[dayKey]

  // ✅ Агрегируем данные для отображения (как в оригинале)
  const aggregated = dayShifts.reduce(
    (acc, shift) => ({
      totalWorkers: acc.totalWorkers + (shift.totalWorkers || 0),
      startedCount: acc.startedCount + (shift.startedCount || 0),
      finishedCount: acc.finishedCount + (shift.finishedCount || 0),
    }),
    { totalWorkers: 0, startedCount: 0, finishedCount: 0 }
  )

  const isEmpty = !aggregated || aggregated.totalWorkers < 1
  const progress =
    aggregated.totalWorkers > 0 ? (aggregated.startedCount / aggregated.totalWorkers) * 100 : 0
  const colorScheme = progress === 100 ? 'green' : progress >= 50 ? 'yellow' : 'orange'

  // Стили ячейки
  const borderColor =
    calendarMode === 'edit' && isSelected ? 'blue.500' : isToday ? 'blue.300' : 'gray.100'
  const borderWidth = calendarMode === 'edit' && isSelected ? '2px' : '1px'

  // ✅ Функция рендера контента ячейки (как renderCellContent в оригинале)
  const renderCellContent = () => {
    // Пустая ячейка
    if (isEmpty) {
      return (
        <VStack gap={1} h="100%" justify="center">
          <Icon as={MdPeopleOutline} boxSize={5} color="gray.400" />
          <Text fontSize="2xs" color="gray.500" fontWeight="medium">
            Пусто
          </Text>
        </VStack>
      )
    }

    // Заполненная ячейка
    return (
      <VStack gap={1} h="100%" justify="center">
        {/* Строка 1: иконка старта + бейдж начатых */}
        <HStack gap={1}>
          <Icon as={MdPlayCircleFilled} boxSize={4} color={`${colorScheme}.600`} />
          <Badge
            size="sm"
            colorScheme={isSelected ? 'whiteAlpha' : colorScheme}
            variant={isSelected ? 'solid' : 'subtle'}
            fontWeight="bold"
            fontSize="2xs"
            px={1.5}
            py={0.5}
            onClick={(e) => {
              if (calendarMode === 'view' && dayShifts[0]) {
                e.stopPropagation()
                onShiftClick?.(e, dayShifts[0])
              }
            }}
            cursor={isCurrentMonth && calendarMode === 'view' ? 'pointer' : 'default'}
          >
            {aggregated.startedCount}/{aggregated.totalWorkers}
          </Badge>
        </HStack>

        {/* Строка 2: иконка завершения + бейдж завершённых */}
        <HStack gap={1}>
          <Icon
            as={MdCheckCircle}
            boxSize={4}
            color={aggregated.finishedCount === aggregated.totalWorkers ? 'green.600' : 'gray.400'}
          />
          <Badge
            size="sm"
            variant="subtle"
            fontSize="2xs"
            px={1.5}
            py={0.5}
            colorScheme={isSelected ? 'whiteAlpha' : 'gray'}
          >
            {aggregated.finishedCount}
          </Badge>
        </HStack>

        {/* Если смен > 1 — показываем счётчик */}
        {dayShifts.length > 1 && (
          <Text fontSize="2xs" color={isSelected ? 'whiteAlpha.700' : 'gray.400'}>
            +{dayShifts.length - 1} ещё
          </Text>
        )}
      </VStack>
    )
  }

  return (
    <Box
      minH="110px"
      border={`${borderWidth} solid`}
      borderColor={borderColor}
      bg={isSelected ? 'blue.500' : 'transparent'}
      color={isSelected ? 'white' : 'black'}
      p={2}
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
      {/* Число дня */}
      <Text fontWeight={isToday ? 'bold' : 'medium'} fontSize="sm" mb={1}>
        {format(day, 'd')}
      </Text>

      {/* Контент ячейки */}
      <Box flex={1} display="flex" alignItems="center" justifyContent="center">
        {isDayPopulated && dayShifts.length > 1 && !isCellExpanded ? (
          // Счётчик, если смен много и ячейка свёрнута
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
        ) : (
          renderCellContent()
        )}
      </Box>

      {/* Кнопка "Свернуть" */}
      {dayShifts.length > 1 && isCellExpanded && (
        <Button
          size="2xs"
          variant="ghost"
          colorPalette="gray"
          fontSize="2xs"
          px={1}
          mt={1}
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

// ✅ Custom comparison для memo: перерисовываем только при изменении критичных пропсов
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.day?.getTime() === nextProps.day?.getTime() &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.isCurrentMonth === nextProps.isCurrentMonth &&
    prevProps.calendarMode === nextProps.calendarMode &&
    prevProps.expandedCells === nextProps.expandedCells &&
    prevProps.onCellClick === nextProps.onCellClick &&
    prevProps.onShiftClick === nextProps.onShiftClick &&
    prevProps.onToggleExpand === nextProps.onToggleExpand &&
    prevProps.shifts?.length === nextProps.shifts?.length &&
    prevProps.objectsDictionary === nextProps.objectsDictionary
  )
}

export default memo(CalendarDayCell, arePropsEqual)
