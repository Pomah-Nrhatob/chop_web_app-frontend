'use client'

import { Box, HStack, Popover, Portal, Text, VStack } from '@chakra-ui/react'
import { format, isSameDay } from 'date-fns'
import SecurityCalendarShiftItem from './SecurityCalendarShiftItem'

function isFinishedShift(shift) {
  if (shift?.isFinished) return true

  const finishedCount = Number(shift?.finishedCount || 0)
  const totalWorkers = Number(shift?.totalWorkers || 0)

  return totalWorkers > 0 && finishedCount >= totalWorkers
}

function isStartedShift(shift) {
  if (isFinishedShift(shift)) return true
  if (shift?.isStarted) return true

  return Number(shift?.startedCount || 0) > 0
}

function getObjectTitle(shift, objectsDictionary) {
  const foundObject = objectsDictionary?.find(
    (item) => String(item.id) === String(shift.securityObjectId)
  )

  return foundObject?.title || `Объект #${shift.securityObjectId}`
}

function getUniqueObjects(shifts, objectsDictionary) {
  const objectsMap = new Map()

  shifts.forEach((shift) => {
    const key = String(shift.securityObjectId)

    if (!objectsMap.has(key)) {
      objectsMap.set(key, {
        id: key,
        title: getObjectTitle(shift, objectsDictionary),
        shift,
      })
    }
  })

  return Array.from(objectsMap.values())
}

export default function SecurityCalendarDayCell({
  day,
  shifts,
  isSelected,
  isToday,
  isCurrentMonth,
  calendarMode,
  onCellClick,
  onShiftClick,
  objectsDictionary = [],
}) {
  const dayShifts = shifts.filter((shift) => isSameDay(shift.parsedDate, day))

  const vacationShift = dayShifts.find((shift) => shift.isVacation === true)
  const workShifts = dayShifts.filter((shift) => shift.isVacation !== true)
  const objects = getUniqueObjects(workShifts, objectsDictionary)

  const hasWorkShifts = workShifts.length > 0
  const allShiftsFinished = hasWorkShifts && workShifts.every((shift) => isFinishedShift(shift))
  const hasStartedShifts = workShifts.some((shift) => isStartedShift(shift))

  const isEditMode = calendarMode === 'edit'
  const isViewMode = calendarMode === 'view'
  const canSelectCell = isCurrentMonth && isEditMode

  const cellBg = isSelected
    ? 'blue.500'
    : vacationShift
      ? 'orange.50'
      : allShiftsFinished
        ? 'green.50'
        : hasStartedShifts
          ? 'yellow.50'
          : hasWorkShifts
            ? 'orange.50'
            : 'transparent'

  const hoverBg = isSelected
    ? 'blue.600'
    : vacationShift
      ? 'orange.100'
      : allShiftsFinished
        ? 'green.100'
        : hasStartedShifts
          ? 'yellow.100'
          : hasWorkShifts
            ? 'orange.100'
            : 'gray.50'

  const borderColor = isSelected
    ? 'blue.600'
    : vacationShift
      ? 'orange.200'
      : allShiftsFinished
        ? 'green.200'
        : hasStartedShifts
          ? 'yellow.300'
          : hasWorkShifts
            ? 'orange.200'
            : isToday
              ? 'blue.300'
              : 'gray.200'

  const contentColor = isSelected ? 'white' : 'gray.800'

  const handleCellClick = (event) => {
    if (!canSelectCell) return
    onCellClick?.(event)
  }

  const handleShiftOpen = (event, shift) => {
    if (!isViewMode || !isCurrentMonth) return

    event.stopPropagation()
    onShiftClick?.(event, shift)
  }

  return (
    <Box
      minH="110px"
      h="100%"
      minW={0}
      position="relative"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      border="1px solid"
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={borderColor}
      borderRadius={{ base: 'md', md: 'lg' }}
      bg={cellBg}
      color={contentColor}
      p={{ base: 1, md: 1.5 }}
      opacity={isCurrentMonth ? 1 : 0.35}
      cursor={canSelectCell ? 'pointer' : 'default'}
      transition="background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease"
      _hover={
        canSelectCell
          ? {
              bg: hoverBg,
              borderColor,
            }
          : undefined
      }
      _active={canSelectCell ? { transform: 'scale(0.985)' } : undefined}
      onClick={handleCellClick}
    >
      <HStack justify="space-between" align="flex-start" gap={1} minH="18px">
        <Text
          fontSize={{ base: '9px', sm: '10px', md: 'sm' }}
          lineHeight="1"
          fontWeight={isToday ? '800' : '600'}
          color={isSelected ? 'white' : isToday ? 'blue.600' : 'inherit'}
        >
          {format(day, 'd')}
        </Text>

        {objects.length > 1 && !vacationShift && (
          <Text
            as="span"
            px={{ base: 1, md: 1.5 }}
            py="1px"
            borderRadius="full"
            bg={isSelected ? 'whiteAlpha.300' : 'blackAlpha.100'}
            fontSize={{ base: '7px', sm: '8px', md: '2xs' }}
            lineHeight="1.4"
            fontWeight="700"
            whiteSpace="nowrap"
          >
            {objects.length}
          </Text>
        )}
      </HStack>

      <Box
        flex="1"
        minH={0}
        display="flex"
        alignItems="stretch"
        justifyContent="stretch"
        pt={{ base: 0.5, md: 1 }}
      >
        {vacationShift ? (
          <SecurityCalendarShiftItem
            type="vacation"
            isSelected={isSelected}
            isInteractive={isViewMode && isCurrentMonth}
            onClick={(event) => handleShiftOpen(event, vacationShift)}
          />
        ) : objects.length === 1 ? (
          <SecurityCalendarShiftItem
            title={objects[0].title}
            isSelected={isSelected}
            isInteractive={isViewMode && isCurrentMonth}
            onClick={(event) => handleShiftOpen(event, objects[0].shift)}
          />
        ) : objects.length > 1 ? (
          isViewMode && isCurrentMonth ? (
            <Popover.Root positioning={{ placement: 'bottom', gutter: 6 }}>
              <Popover.Trigger asChild>
                <Box
                  as="button"
                  type="button"
                  w="100%"
                  minW={0}
                  minH={0}
                  display="flex"
                  textAlign="left"
                  borderRadius="md"
                  cursor="pointer"
                  onClick={(event) => event.stopPropagation()}
                >
                  <SecurityCalendarShiftItem
                    title={objects[0].title}
                    additionalCount={objects.length - 1}
                    isSelected={isSelected}
                    isInteractive
                  />
                </Box>
              </Popover.Trigger>

              <Portal>
                <Popover.Positioner zIndex="popover">
                  <Popover.Content
                    width={{ base: 'min(280px, calc(100vw - 24px))', md: '300px' }}
                    maxH="320px"
                    overflowY="auto"
                    borderRadius="xl"
                    boxShadow="xl"
                  >
                    <Popover.Arrow />

                    <Popover.Header fontWeight="700" fontSize="sm">
                      Объекты на {format(day, 'dd.MM.yyyy')}
                    </Popover.Header>

                    <Popover.Body p={2}>
                      <VStack align="stretch" gap={1}>
                        {objects.map((object) => (
                          <Box
                            as="button"
                            type="button"
                            key={object.id}
                            width="100%"
                            minW={0}
                            px={3}
                            py={2.5}
                            textAlign="left"
                            borderRadius="lg"
                            transition="background-color 0.15s ease"
                            _hover={{ bg: 'gray.100' }}
                            _focusVisible={{ outline: '2px solid', outlineColor: 'blue.400' }}
                            onClick={(event) => handleShiftOpen(event, object.shift)}
                          >
                            <Text
                              fontSize="sm"
                              lineHeight="1.25"
                              fontWeight="600"
                              whiteSpace="normal"
                              overflowWrap="anywhere"
                              wordBreak="break-word"
                            >
                              {object.title}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </Popover.Body>
                  </Popover.Content>
                </Popover.Positioner>
              </Portal>
            </Popover.Root>
          ) : (
            <SecurityCalendarShiftItem
              title={objects[0].title}
              additionalCount={objects.length - 1}
              isSelected={isSelected}
            />
          )
        ) : null}
      </Box>
    </Box>
  )
}
