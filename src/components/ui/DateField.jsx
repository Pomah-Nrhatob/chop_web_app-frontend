'use client'

import { DatePicker, Field, Input, Portal } from '@chakra-ui/react'
import { CalendarDate } from '@internationalized/date'
import { Controller } from 'react-hook-form'
import { LuCalendar } from 'react-icons/lu'
import { PatternFormat } from 'react-number-format'
import { useState } from 'react'

export function DateField({ control, name, label, error, placeholder = 'дд.мм.гггг' }) {
  const [open, setOpen] = useState(false)

  const toCalendarDate = (timestamp) => {
    if (!timestamp) return []

    const date = new Date(timestamp)

    return [new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())]
  }

  const formatInput = (timestamp) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)

    return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}.${date.getFullYear()}`
  }

  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker.Root
            open={open}
            onOpenChange={({ open }) => setOpen(open)}
            value={toCalendarDate(field.value)}
            onValueChange={({ value }) => {
              const date = value?.[0]

              if (!date) {
                field.onChange(null)
                return
              }

              field.onChange(new Date(date.year, date.month - 1, date.day).getTime())

              setOpen(false)
            }}
          >
            <DatePicker.Control>
              <PatternFormat
                customInput={Input}
                format="##.##.####"
                mask="_"
                value={formatInput(field.value)}
                placeholder={placeholder}
                onValueChange={({ value }) => {
                  if (value.length !== 8) {
                    field.onChange(null)
                    return
                  }

                  const day = Number(value.slice(0, 2))
                  const month = Number(value.slice(2, 4))
                  const year = Number(value.slice(4, 8))

                  const date = new Date(year, month - 1, day)

                  if (
                    date.getFullYear() !== year ||
                    date.getMonth() !== month - 1 ||
                    date.getDate() !== day
                  ) {
                    return
                  }

                  field.onChange(date.getTime())
                }}
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
        )}
      />

      <Field.ErrorText>{error?.message}</Field.ErrorText>
    </Field.Root>
  )
}
