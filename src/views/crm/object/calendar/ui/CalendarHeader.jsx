'use client'

import MonthPicker from '@/components/ui/MonthPicker'
import {
  Box,
  Flex,
  HStack,
  VStack,
  Button,
  IconButton,
  Text,
  Separator,
  SegmentGroup,
  Card,
} from '@chakra-ui/react'

import { LuChevronLeft, LuChevronRight, LuEye, LuPencil } from 'react-icons/lu'

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
    <Card.Root size="sm" shadow="xs" borderColor="gray.200" w="100%">
      <Card.Body p={4}>
        <Flex
          direction={{
            base: 'column',
            md: 'row',
          }}
          justify="space-between"
          align={{
            base: 'stretch',
            md: 'center',
          }}
          gap={4}
        >
          <HStack
            justify={{
              base: 'space-between',
              md: 'flex-start',
            }}
            w={{
              base: '100%',
              md: 'auto',
            }}
          >
            <MonthPicker year={year} month={month} onChange={onDateChange} />

            <HStack
              w="100%"
              h="40px"
              gap={0}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              overflow="hidden"
            >
              <IconButton
                flex={1}
                h="full"
                borderRadius="0"
                variant="ghost"
                aria-label="Предыдущий месяц"
                onClick={onPrevMonth}
              >
                <LuChevronLeft />
              </IconButton>

              <Box w="1px" h="full" bg="gray.200" />

              <IconButton
                flex={1}
                h="full"
                borderRadius="0"
                variant="ghost"
                aria-label="Следующий месяц"
                onClick={onNextMonth}
              >
                <LuChevronRight />
              </IconButton>
            </HStack>
          </HStack>

          <SegmentGroup.Root
            value={calendarMode}
            onValueChange={(e) => onModeChange?.(e.value)}
            size="sm"
          >
            <SegmentGroup.Indicator />

            <SegmentGroup.Items
              cursor="pointer"
              w="100%"
              items={[
                {
                  value: 'view',
                  label: (
                    <HStack gap={2}>
                      <LuEye />
                      <Text>Просмотр</Text>
                    </HStack>
                  ),
                },
                {
                  value: 'edit',
                  label: (
                    <HStack gap={2}>
                      <LuPencil />
                      <Text>Редактирование</Text>
                    </HStack>
                  ),
                },
              ]}
            />
          </SegmentGroup.Root>
        </Flex>

        {calendarMode === 'edit' && (
          <>
            <Separator mt={4} mb={4} />

            <Flex
              gap={2}
              direction={{
                base: 'column',
                sm: 'row',
              }}
            >
              <Button flex={1} variant="subtle" colorPalette="blue" onClick={onSelectAllDays}>
                Весь месяц
              </Button>

              <Button flex={1} variant="subtle" colorPalette="orange" onClick={onSelectEmptyDays}>
                Без смен
              </Button>
            </Flex>
          </>
        )}
      </Card.Body>
    </Card.Root>
  )
}
