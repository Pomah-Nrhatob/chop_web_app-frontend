'use client'

import React, { useState } from 'react'
import { Box, SimpleGrid, Text, VStack, HStack, Button, Badge, Heading } from '@chakra-ui/react'
import { format, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import ObjectList from '../../ui/ObjectList'
import { LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { useParams } from 'next/navigation'
import { useGetCalendarObjectWorkdays } from '@/features/calendar-object/api/use-get-calendar-workdays'

// ИМПОРТЫ ДИАЛОГОВЫХ ОКЕН
import EmptyDayDialogObjects from '@/components/calendar/emptyDayDialog/EmptyDialogObjects'
import OneDayDialog from '@/components/calendar/oneDayDialog/OneDayDialog'
import { useObjectCalendar } from '../../hooks.js/useObjectCalendar'

export default function ObjectCalendar() {
  const params = useParams()
  const securityObjectId = Number(params.id)

  const {
    currentMonth,
    setCurrentMonth,
    year,
    month,
    currentMonthDays,
    calendarDays,
    monthStart,
    objectsDictionary,
    openOneDayDialog,
    setOpenOneDayDialog,
    openEmptyDayDialog,
    setOpenEmptyDayDialog,
    emptyDayInfo,
    setEmptyDayInfo,
    selectedWorkday,
    setSelectedWorkday,
    selectedDates,
    setSelectedDates,
    handleDateClick,
    selectAllDays,
    isListOpen,
    setIsListOpen,
  } = useObjectCalendar()

  // ДОБАВЛЕНО: Находим текущий объект в словаре по ID из URL
  const currentObject = objectsDictionary.find((el) => el.id === securityObjectId)
  const objectTitle = currentObject ? currentObject.title : `Объект #${securityObjectId}`

  // Получение смен текущего объекта с бэкенда
  const {
    data: serverShifts,
    isLoading,
    isError,
  } = useGetCalendarObjectWorkdays({
    securityObjectId,
    year,
    month,
  })

  // Преобразуем строковые timestamp от бэкенда в валидные JS Date объекты
  const shifts = React.useMemo(() => {
    if (!serverShifts || !Array.isArray(serverShifts)) return []
    return serverShifts.map((shift) => ({
      ...shift,
      parsedDate:
        typeof shift.timestamp === 'string' ? parseISO(shift.timestamp) : new Date(shift.timestamp),
    }))
  }, [serverShifts])

  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter((day) => {
      // Находим все смены, привязанные к текущему дню
      const dayShifts = shifts.filter((shift) => isSameDay(shift.parsedDate, day))

      // Считаем общее количество людей в этих сменах
      const totalWorkersInDay = dayShifts.reduce((sum, shift) => sum + (shift.totalWorkers || 0), 0)

      // День считается ПУСТЫМ, если смен нет вообще ИЛИ сумма рабочих равна 0
      return dayShifts.length === 0 || totalWorkersInDay === 0
    })

    setSelectedDates(emptyDays)
  }

  // Клик строго по бейджу существующей смены
  const handleShiftClick = (e, shift) => {
    e.stopPropagation() // Предотвращаем срабатывание клика по самой ячейке Box
    setSelectedWorkday(shift.id) // Передаем ID смены в стейт для модалки
    setOpenOneDayDialog(true)
  }

  // Клик по кнопке «Назначить смену» в синей нижней панели
  const handleOpenCreateDialog = () => {
    setEmptyDayInfo({
      objectId: securityObjectId,
      dates: selectedDates, // Передаем массив всех выделенных дат в EmptyDayDialog
    })
    setOpenEmptyDayDialog(true)
  }

  if (isLoading) return <div>Загрузка календаря...</div>
  if (isError) return <div>Ошибка загрузки данных с сервера</div>

  return (
    <>
      <OneDayDialog
        open={openOneDayDialog}
        setOpen={setOpenOneDayDialog}
        selectedWorkday={selectedWorkday}
        setSelectedWorkday={setSelectedWorkday}
      />
      {/* ДИАЛОГ МАССОВОГО СОЗДАНИЯ СМЕН ДЛЯ ВЫБРАННЫХ ДНЕЙ */}
      <EmptyDayDialogObjects
        emptyDayInfo={emptyDayInfo}
        setEmptyDayInfo={setEmptyDayInfo}
        open={openEmptyDayDialog}
        setOpen={setOpenEmptyDayDialog}
        onSuccessAction={() => setSelectedDates([])} // Очистит выбор дней при успешном сохранении формы
      />

      <VStack align="stretch" gap={6} p={4} bg="white" borderRadius="xl" shadow="sm">
        <Box borderBottom="1px solid" borderColor="gray.100" pb={2}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            color="blue.500"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Календарь расписания
          </Text>
          <Heading size="lg" color="gray.800" mt={1}>
            {objectTitle}
          </Heading>
        </Box>
        {/* Выпадающий список объектов */}
        <Button
          variant="ghost"
          justifyContent="space-between"
          onClick={() => setIsListOpen(!isListOpen)}
        >
          {isListOpen ? 'Скрыть список объектов' : 'Открыть список объектов'}
          {isListOpen ? <LuChevronUp /> : <LuChevronDown />}
        </Button>

        {isListOpen && <ObjectList />}

        {/* Шапка календаря: Название месяца и пагинация по месяцам */}
        <HStack justify="space-between">
          <VStack align="flex-start" gap={0}>
            <Text fontSize="2xl" fontWeight="bold" textTransform="capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </Text>
            <HStack gap={2} mt={2}>
              <Button size="xs" variant="outline" onClick={selectAllDays}>
                Весь месяц
              </Button>
              <Button size="xs" variant="outline" onClick={selectDaysWithoutShifts}>
                Дни без смен
              </Button>
            </HStack>
          </VStack>

          <HStack>
            <Button size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              Пред.
            </Button>
            <Button size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              След.
            </Button>
          </HStack>
        </HStack>

        {/* Сетка календаря */}
        <SimpleGrid columns={7} gap={1}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
            <Text key={d} textAlign="center" fontSize="sm" fontWeight="bold" color="gray.400">
              {d}
            </Text>
          ))}

          {calendarDays.map((day, idx) => {
            const isSelected = selectedDates.some((d) => isSameDay(d, day))
            const dayShifts = shifts.filter((s) => isSameDay(s.parsedDate, day))
            const isToday = isSameDay(day, new Date())

            // Проверяем, принадлежит ли день текущему месяцу
            const isCurrentMonth = isSameMonth(day, monthStart)

            // Считаем общее количество людей во всех сменах этого дня
            const totalWorkersInDay = dayShifts.reduce(
              (sum, shift) => sum + (shift.totalWorkers || 0),
              0
            )
            // День считается заполненным, только если есть смены И в них есть люди
            const isDayPopulated = dayShifts.length > 0 && totalWorkersInDay > 0

            return (
              <Box
                key={idx}
                minH="110px"
                border="1px solid"
                borderColor={isToday ? 'blue.300' : 'gray.100'}
                bg={isSelected ? 'blue.500' : 'transparent'}
                color={isSelected ? 'white' : 'black'}
                p={1}
                // Меняем курсор в зависимости от месяца
                cursor={isCurrentMonth ? 'pointer' : 'default'}
                transition="0.1s"
                // Отключаем эффект ховера для чужого месяца
                _hover={isCurrentMonth ? { bg: isSelected ? 'blue.600' : 'gray.50' } : undefined}
                onClick={() => {
                  // 🛑 ДОБАВЛЕНО: Прерываем клик, если день из другого месяца
                  if (!isCurrentMonth) return

                  if (isDayPopulated) {
                    // ИСПРАВЛЕНО: Берем id из первой смены текущего дня (или подставьте нужное поле id рабочего дня)
                    const workdayId = dayShifts[0]?.objectWorkdayId || dayShifts[0]?.id
                    setSelectedWorkday(workdayId)
                    setOpenOneDayDialog(true)
                  } else {
                    // Если день пустой или там 0 людей — работает обычный выбор дат
                    handleDateClick(day)
                  }
                }}
                opacity={isCurrentMonth ? 1 : 0.3}
              >
                <Text fontWeight={isToday ? 'bold' : 'medium'} fontSize="sm">
                  {format(day, 'd')}
                </Text>

                {/* Вывод назначенных смен в ячейке дня (только если есть люди) */}
                {isDayPopulated && (
                  <VStack align="stretch" gap={1} mt={1}>
                    {dayShifts.map((shift) => {
                      // ИСПРАВЛЕНО: Пропускаем рендер бейджа, если в этой смене 0 сотрудников
                      if ((shift.totalWorkers || 0) === 0) return null

                      return (
                        <Badge
                          key={shift.id}
                          colorPalette={isSelected ? 'whiteAlpha' : 'orange'}
                          fontSize="2xs"
                          variant="solid"
                          // Меняем курсор бейджа для чужого месяца
                          cursor={isCurrentMonth ? 'pointer' : 'default'}
                          onClick={(e) => {
                            e.stopPropagation() // ИСПРАВЛЕНО: Предотвращает ложный клик по Box

                            // Блокируем клик по бейджу, если месяц чужой
                            if (isCurrentMonth) {
                              handleShiftClick(e, shift)
                            }
                          }}
                        >
                          {`В смене: ${shift.totalWorkers}`}
                        </Badge>
                      )
                    })}
                  </VStack>
                )}
              </Box>
            )
          })}
        </SimpleGrid>

        {/* Нижняя всплывающая синяя панель действий */}
        {selectedDates.length > 0 && (
          <HStack justify="space-between" p={4} bg="blue.900" color="white" borderRadius="lg">
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" opacity={0.8}>
                Выбрано дней: {selectedDates.length}
              </Text>
              <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                {selectedDates
                  .sort((a, b) => a - b)
                  .map((d) => format(d, 'dd.MM'))
                  .join(', ')}
              </Text>
            </VStack>
            <HStack>
              <Button colorPalette="blue" size="md" onClick={handleOpenCreateDialog}>
                Назначить смену
              </Button>
              <Button variant="whiteAlpha" onClick={() => setSelectedDates([])}>
                Сброс
              </Button>
            </HStack>
          </HStack>
        )}
      </VStack>
    </>
  )
}
