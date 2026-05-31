'use client'

import React, { memo } from 'react'
import { Box, VStack, HStack, Badge, Icon, Text } from '@chakra-ui/react'
import { MdCheckCircle, MdPlayCircleFilled } from 'react-icons/md'

const ShiftCard = ({ shift, isSelected, isCurrentMonth, onClick, objectsDictionary = [] }) => {
  const foundObject = objectsDictionary?.find((el) => el.id == shift.securityObjectId)
  const objectTitle = foundObject ? foundObject.title : `Объект #${shift.securityObjectId}`

  const shiftProgress =
    shift.totalWorkers > 0 ? ((shift.startedCount || 0) / shift.totalWorkers) * 100 : 0
  const isShiftFinished =
    shift.isFinished ||
    ((shift.finishedCount || 0) >= (shift.totalWorkers || 0) && (shift.totalWorkers || 0) > 0)
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
      cursor={isCurrentMonth ? 'pointer' : 'default'}
      _hover={isCurrentMonth ? { shadow: 'md', bg: `${shiftColor}.100` } : undefined}
      onClick={onClick}
    >
      <VStack align="stretch" gap={1}>
        {/* Название объекта */}
        <Text
          fontSize="2xs"
          fontWeight="medium"
          color={isSelected ? 'whiteAlpha.900' : 'gray.600'}
          noOfLines={1}
          title={objectTitle}
        >
          {objectTitle.length > 20 ? objectTitle.slice(0, 20) + '…' : objectTitle}
        </Text>

        {/* Строка 1: старт + бейдж */}
        <HStack justify="space-between">
          <HStack gap={1}>
            <Icon as={MdPlayCircleFilled} boxSize={4} color={`${shiftColor}.600`} />
            <Badge
              size="sm"
              colorScheme={isSelected ? 'whiteAlpha' : shiftColor}
              variant={isSelected ? 'solid' : 'subtle'}
              fontWeight="bold"
              fontSize="2xs"
              px={1.5}
              py={0.5}
            >
              {shift.startedCount || 0}/{shift.totalWorkers || 0}
            </Badge>
          </HStack>
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
            {isShiftFinished ? 'Завершена' : 'Активна'}
          </Text>
        </HStack>

        {/* Строка 2: завершение + бейдж */}
        <HStack gap={1} justify="flex-start">
          <Icon as={MdCheckCircle} boxSize={4} color={isShiftFinished ? 'green.600' : 'gray.400'} />
          <Badge
            size="sm"
            variant="subtle"
            fontSize="2xs"
            px={1.5}
            py={0.5}
            colorScheme={isSelected ? 'whiteAlpha' : 'gray'}
          >
            Завершено: {shift.finishedCount || 0}
          </Badge>
        </HStack>
      </VStack>
    </Box>
  )
}

// ✅ Custom comparison: перерисовываем только если изменились критичные пропсы
const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.shift?.id === nextProps.shift?.id &&
    prevProps.shift?.startedCount === nextProps.shift?.startedCount &&
    prevProps.shift?.finishedCount === nextProps.shift?.finishedCount &&
    prevProps.shift?.totalWorkers === nextProps.shift?.totalWorkers &&
    prevProps.shift?.isFinished === nextProps.shift?.isFinished &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isCurrentMonth === nextProps.isCurrentMonth &&
    prevProps.objectsDictionary === nextProps.objectsDictionary
  )
}

export default memo(ShiftCard, arePropsEqual)
