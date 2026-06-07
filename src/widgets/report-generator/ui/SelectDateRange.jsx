'use client'

import { DatePicker, Portal } from '@chakra-ui/react'
import { CalendarDate } from '@internationalized/date'
import { LuCalendar } from 'react-icons/lu'
import { useEffect, useMemo, useState } from 'react'
import { useGeneratorReportQueryStore } from '@/features/report/store/useGeneratorReportQueryStore'

const toDateString = (date) =>
  `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`

const fromDateString = (value) => {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null

  return new CalendarDate(year, month, day)
}

export default function SelectDateRange() {
  const { queryParams, setQueryParams } = useGeneratorReportQueryStore()
  const [open, setOpen] = useState(false)
  const [draftValue, setDraftValue] = useState([])

  const storeValue = useMemo(() => {
    const start = fromDateString(queryParams.startDay)
    const end = fromDateString(queryParams.endDay)
    return start && end ? [start, end] : []
  }, [queryParams.startDay, queryParams.endDay])

  useEffect(() => {
    setDraftValue(storeValue)
  }, [storeValue])

  return (
    <DatePicker.Root
      selectionMode="range"
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      value={draftValue}
      onValueChange={(details) => {
        const nextValue = details.value
        setDraftValue(nextValue)

        const start = nextValue[0]
        const end = nextValue[1]

        if (!start || !end) return

        setQueryParams({
          periodType: 'range',
          year: null,
          month: null,
          startDay: toDateString(start),
          endDay: toDateString(end),
        })

        setOpen(false)
      }}
      format={(date) =>
        `${String(date.day).padStart(2, '0')}.${String(date.month).padStart(2, '0')}.${date.year}`
      }
      parse={(value) => {
        const match = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
        if (!match) return undefined

        const day = Number(match[1])
        const month = Number(match[2])
        const year = Number(match[3])

        return new CalendarDate(year, month, day)
      }}
      placeholder="дд.мм.гггг"
      maxWidth="20rem"
    >
      <DatePicker.Label>Выберите период</DatePicker.Label>

      <DatePicker.Control>
        <DatePicker.Input readOnly index={0} />
        <span>-</span>
        <DatePicker.Input readOnly index={1} />
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
              <DatePicker.Context>
                {(datePicker) => (
                  <>
                    <DatePicker.ViewControl>
                      <DatePicker.PrevTrigger />
                      <DatePicker.ViewTrigger>
                        <DatePicker.RangeText />
                      </DatePicker.ViewTrigger>
                      <DatePicker.NextTrigger />
                    </DatePicker.ViewControl>

                    <DatePicker.Table>
                      <DatePicker.TableHead>
                        <DatePicker.TableRow>
                          {datePicker.weekDays.map((weekDay, id) => (
                            <DatePicker.TableHeader key={id}>
                              {weekDay.short}
                            </DatePicker.TableHeader>
                          ))}
                        </DatePicker.TableRow>
                      </DatePicker.TableHead>

                      <DatePicker.TableBody>
                        {datePicker.weeks.map((week, id) => (
                          <DatePicker.TableRow key={id}>
                            {week.map((day, id) => (
                              <DatePicker.TableCell key={id} value={day}>
                                <DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
                              </DatePicker.TableCell>
                            ))}
                          </DatePicker.TableRow>
                        ))}
                      </DatePicker.TableBody>
                    </DatePicker.Table>
                  </>
                )}
              </DatePicker.Context>
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
}
