'use client'

import { Button, DatePicker, HStack, Icon, Portal, Text } from '@chakra-ui/react'
import { CalendarDate } from '@internationalized/date'
import { LuCalendar, LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { useMemo, useState } from 'react'
import { useCalendarAllObjectsStore } from '@/features/calendar/store/useCalendarAllObjectsStore'
import { useCalendarOneDayStore } from '@/features/calendar/store/useCalendarOneDayStore'
import { FiRefreshCw } from 'react-icons/fi'

export default function SelectYearMonthDay({ refetch }) {
  const { queryParams, setQueryParams } = useCalendarOneDayStore()

  const [open, setOpen] = useState(false)

  const value = useMemo(() => {
    return [new CalendarDate(queryParams.year, queryParams.month, queryParams.day)]
  }, [queryParams.year, queryParams.month, queryParams.day])

  const format = (date) => {
    const day = date.day.toString().padStart(2, '0')
    const month = date.month.toString().padStart(2, '0')
    const year = date.year.toString()
    return `${day}.${month}.${year}`
  }

  const parse = (string) => {
    const regex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/
    const match = string.match(regex)
    if (match) {
      const [, day, month, year] = match.map(Number)
      return new CalendarDate(year, month, day)
    }
  }

  const handlePreviousDay = () => {
    const currentDate = new CalendarDate(queryParams.year, queryParams.month, queryParams.day)
    const previousDay = currentDate.subtract({ days: 1 })

    setQueryParams({
      year: previousDay.year,
      month: previousDay.month,
      day: previousDay.day,
    })
  }

  const handleNextDay = () => {
    const currentDate = new CalendarDate(queryParams.year, queryParams.month, queryParams.day)
    const nextDay = currentDate.add({ days: 1 })

    setQueryParams({
      year: nextDay.year,
      month: nextDay.month,
      day: nextDay.day,
    })
  }

  return (
    <div className="flex items-center gap-2">
      <DatePicker.Root
        open={open}
        onOpenChange={(details) => setOpen(details.open)}
        value={value}
        onValueChange={(details) => {
          const selected = details.value?.[0]
          if (!selected) return

          setQueryParams({
            year: selected.year,
            month: selected.month,
            day: selected.day,
          })
          setOpen(false)
        }}
        format={format}
        parse={parse}
        defaultView="day"
        minView="day"
        placeholder="dd.mm.yyyy"
        maxWidth="20rem"
      >
        <DatePicker.Label>Выберите день</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input onClick={() => setOpen(true)} readOnly />
          <DatePicker.IndicatorGroup>
            <DatePicker.Trigger onClick={() => setOpen(!open)}>
              <LuCalendar />
            </DatePicker.Trigger>
          </DatePicker.IndicatorGroup>
        </DatePicker.Control>

        <Portal>
          <DatePicker.Positioner>
            <DatePicker.Content>
              <DatePicker.View view="day">
                <DatePicker.Header />
                <DatePicker.DayTable />
              </DatePicker.View>
              <DatePicker.View view="month">
                <DatePicker.Header />
                <DatePicker.MonthTable />
              </DatePicker.View>
              <DatePicker.View view="year">
                <DatePicker.Header />
                <DatePicker.YearTable />
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>

      <HStack justify="center" gap={2} pt={4}>
        <Button
          variant="outline"
          size={{ base: 'xs', md: 'sm' }}
          onClick={handlePreviousDay}
          aria-label="Предыдущий день"
        >
          <LuChevronLeft />
          Предыдущий день
        </Button>
        <Button
          variant="outline"
          size={{ base: 'xs', md: 'sm' }}
          onClick={handleNextDay}
          aria-label="Следующий день"
        >
          Следующий день
          <LuChevronRight />
        </Button>
        <Button
          size={{ base: 'xs', md: 'sm' }}
          variant="outline"
          onClick={refetch}
          flexShrink={0}
          display={{ base: 'flex', md: 'flex' }} // Всегда показывается
          minW={{ base: 'auto', md: '100px' }}
          fontSize="xs"
        >
          <Icon>
            <FiRefreshCw />
          </Icon>
          <Text display={{ base: 'none', md: 'flex' }}>Обновить</Text>
        </Button>
      </HStack>
    </div>
  )
}
