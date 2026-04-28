'use client'

import { DatePicker, Portal } from '@chakra-ui/react'
import { CalendarDate } from '@internationalized/date'
import { LuCalendar } from 'react-icons/lu'
import { useMemo, useState } from 'react'
import { useCalendarAllObjectsStore } from '@/features/calendar/store/useCalendarAllObjectsStore'

export default function SelectYearMonth() {
  const { queryParams, setQueryParams } = useCalendarAllObjectsStore()

  const [open, setOpen] = useState(false)

  const value = useMemo(() => {
    return [new CalendarDate(queryParams.year, queryParams.month, 1)]
  }, [queryParams.year, queryParams.month])

  const format = (date) => {
    const month = date.month.toString().padStart(2, '0')
    const year = date.year.toString()
    return `${month}/${year}`
  }

  const parse = (string) => {
    const fullRegex = /^(\d{1,2})\/(\d{4})$/
    const fullMatch = string.match(fullRegex)
    if (fullMatch) {
      const [, month, year] = fullMatch.map(Number)
      return new CalendarDate(year, month, 1)
    }
  }

  return (
    <DatePicker.Root
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      value={value}
      onValueChange={(details) => {
        const selected = details.value?.[0]
        if (!selected) return

        const month = selected.month
        const year = selected.year
        const monthMaxDays = new Date(year, month, 0).getDate()

        setQueryParams({
          year,
          month,
          startDay: 1,
          endDay: Math.min(5, monthMaxDays),
        })
        setOpen(false)
      }}
      format={format}
      parse={parse}
      defaultView="month"
      minView="month"
      placeholder="mm/yyyy"
      maxWidth="20rem"
    >
      <DatePicker.Label>Выберите месяц и год</DatePicker.Label>
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
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}
