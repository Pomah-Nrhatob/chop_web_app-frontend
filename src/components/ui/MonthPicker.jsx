'use client'

import { DatePicker, Portal } from '@chakra-ui/react'
import { CalendarDate } from '@internationalized/date'
import { LuCalendar } from 'react-icons/lu'
import { useMemo, useState } from 'react'

export default function MonthPicker({ year, month, onChange }) {
  const [open, setOpen] = useState(false)

  const value = useMemo(() => [new CalendarDate(year, month, 1)], [year, month])

  const format = (date) => {
    return `${String(date.month).padStart(2, '0')}/${date.year}`
  }

  const parse = (string) => {
    const match = string.match(/^(\d{1,2})\/(\d{4})$/)

    if (!match) return

    return new CalendarDate(Number(match[2]), Number(match[1]), 1)
  }

  return (
    <DatePicker.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      value={value}
      defaultView="month"
      minView="month"
      format={format}
      parse={parse}
      onValueChange={(details) => {
        const date = details.value?.[0]

        if (!date) return

        onChange?.({
          year: date.year,
          month: date.month,
        })

        setOpen(false)
      }}
    >
      <DatePicker.Control>
        <DatePicker.Input
          readOnly
          cursor="pointer"
          onClick={() => setOpen(true)}
          fontWeight="600"
          bg="gray.50"
        />

        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
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
