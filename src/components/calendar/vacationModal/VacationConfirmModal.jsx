'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { Button, Box, Flex, Heading, Text, Badge, Dialog, Portal } from '@chakra-ui/react'

export default function VacationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  startDate,
  endDate,
  missingDays,
  isLoading = false,
}) {
  if (!startDate || !endDate) return null

  // Подсчёт количества дней в диапазоне
  const totalDays =
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Форматирование диапазона дат
  const renderDateRange = () => {
    if (format(startDate, 'dd.MM.yyyy') === format(endDate, 'dd.MM.yyyy')) {
      return format(startDate, 'd MMMM yyyy г.', { locale: ru })
    }
    return `${format(startDate, 'd MMMM', { locale: ru })} — ${format(endDate, 'd MMMM yyyy г.', { locale: ru })}`
  }

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose()
      }}
      lazyMount
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner
          alignItems={{ base: 'center', md: 'flex-start' }}
          justifyContent="center"
        >
          <Dialog.Content w="500px" maxW="500px">
            <Dialog.Header pb={0}>
              <Flex direction="column" gap={2}>
                <Heading size="md">Подтверждение отпуска</Heading>
                <Badge colorPalette="orange" alignSelf="flex-start">
                  Отпуск ({totalDays} дн.)
                </Badge>
              </Flex>
              <Dialog.CloseTrigger position="absolute" top="2" right="2" />
            </Dialog.Header>

            <Box px={6} py={2}>
              <Flex
                align="center"
                justify="space-between"
                mb={4}
                p={3}
                bg="gray.50"
                borderRadius="md"
              >
                <Text fontSize="sm" color="gray.700">
                  <strong>Период:</strong> {renderDateRange()}
                </Text>
                <Badge colorPalette="orange" variant="solid">
                  Отпуск
                </Badge>
              </Flex>
            </Box>

            <Dialog.Body px={6} pb={6}>
              <Flex flexDirection="column" gap={4}>
                {/* Предупреждение о пропущенных днях */}
                {missingDays && missingDays.length > 0 ? (
                  <Box
                    bg="orange.50"
                    p={4}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="orange.400"
                  >
                    <Flex align="center" gap={2} mb={2}>
                      <Text fontSize="lg">⚠️</Text>
                      <Text fontWeight="bold" color="orange.700">
                        Внимание!
                      </Text>
                    </Flex>
                    <Text fontSize="sm" color="orange.800" mb={3}>
                      В выбранном диапазоне есть <strong>невыбранные дни</strong>, которые также
                      будут включены в отпуск:
                    </Text>
                    <Flex flexWrap="wrap" gap={2}>
                      {missingDays.map((day, index) => (
                        <Box
                          key={index}
                          bg="orange.100"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="sm"
                          fontWeight="medium"
                          color="orange.800"
                        >
                          {format(day, 'dd.MM')}
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                ) : (
                  <Box
                    bg="green.50"
                    p={4}
                    borderRadius="md"
                    borderLeft="4px solid"
                    borderColor="green.400"
                  >
                    <Flex align="center" gap={2}>
                      <Text fontSize="lg">✅</Text>
                      <Text fontSize="sm" color="green.800">
                        Все дни в диапазоне выбраны последовательно. Отпуск будет создан на{' '}
                        <strong>{totalDays}</strong>{' '}
                        {totalDays === 1 ? 'день' : totalDays < 5 ? 'дня' : 'дней'}.
                      </Text>
                    </Flex>
                  </Box>
                )}
              </Flex>
            </Dialog.Body>

            <Dialog.Footer px={6} pb={6} pt={0}>
              <Dialog.ActionTrigger asChild>
                <Button disabled={isLoading} variant="outline" type="button">
                  Отменить
                </Button>
              </Dialog.ActionTrigger>
              <Button loading={isLoading} colorPalette="orange" onClick={onConfirm}>
                Создать отпуск
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
