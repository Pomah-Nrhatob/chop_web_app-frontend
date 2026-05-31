'use client'

import React, { useState } from 'react'
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Heading,
  Flex,
  Spinner,
  Select,
} from '@chakra-ui/react'
import { MdPeopleOutline, MdCheckCircle, MdPlayCircleFilled } from 'react-icons/md'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { LuChevronDown, LuChevronUp, LuEye, LuPencil } from 'react-icons/lu'
import { useParams } from 'next/navigation'
import { useGetCalendarSecurityWorkdays } from '@/features/calendar-security/api/use-get-calendar-workdays'
import { getYear, getMonth } from 'date-fns'

import { useGetDictionarySecurities } from '@/features/dictionary/api/use-get-dictionary-securities'
import { useGetDictionaryObjects } from '@/features/dictionary/api/use-get-dictionary-objects'
import SecurityList from '../../ui/SecurityList'
import EmptyDayDialogSecurities from '@/components/calendar/emptyDayDialog/EmptyDayDialogSecurities'
import OneDaySecurityDialog from '@/components/calendar/oneDayDialog/oneDaySecurityDialog'

export default function SecurityCalendar() {
  //
  const [calendarMode, setCalendarMode] = useState('view')
  const [expandedCells, setExpandedCells] = useState({})

  //

  const params = useParams()
  const securityId = Number(params.id)

  const [currentMonth, setCurrentMonth] = useState(new Date())

  const year = getYear(currentMonth)
  const month = getMonth(currentMonth) + 1

  const [selectedDates, setSelectedDates] = useState([])
  const [isListOpen, setIsListOpen] = useState(false)

  // СТЕЙТЫ ДЛЯ УПРАВЛЕНИЯ МОДАЛКАМИ
  const [openOneDayDialog, setOpenOneDayDialog] = useState(false)
  const [openEmptyDayDialog, setOpenEmptyDayDialog] = useState(false)
  const [emptyDayInfo, setEmptyDayInfo] = useState({})
  const [selectedWorkday, setSelectedWorkday] = useState(null)

  // Внутри компонента, после useState:
  // Массив месяцев для выпадающего списка
  const months = [
    { value: 1, label: 'Январь' },
    { value: 2, label: 'Февраль' },
    { value: 3, label: 'Март' },
    { value: 4, label: 'Апрель' },
    { value: 5, label: 'Май' },
    { value: 6, label: 'Июнь' },
    { value: 7, label: 'Июль' },
    { value: 8, label: 'Август' },
    { value: 9, label: 'Сентябрь' },
    { value: 10, label: 'Октябрь' },
    { value: 11, label: 'Ноябрь' },
    { value: 12, label: 'Декабрь' },
  ]

  // После других обработчиков добавь:
  const handleMonthChange = (e) => {
    const newMonth = Number(e.target.value) - 1 // JS months are 0-indexed
    setCurrentMonth(new Date(year, newMonth, 1))
  }

  const handleYearChange = (e) => {
    const newYear = Number(e.target.value)
    setCurrentMonth(new Date(newYear, month - 1, 1)) // month is 1-indexed here
  }

  // Генерация годов: от текущего -5 до текущего +5
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const { data: securityDictionary = [] } = useGetDictionarySecurities()
  const { data: objectsDictionary = [] } = useGetDictionaryObjects()

  // ДОБАВЛЕНО: Находим текущий объект в словаре по ID из URL
  const currentSecurity = securityDictionary.find((el) => el.id === securityId)

  // Получение смен текущего объекта с бэкенда
  const {
    data: serverShifts,
    isLoading,
    isError,
    isFetching,
  } = useGetCalendarSecurityWorkdays({
    securityId,
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

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
  const currentMonthDays = calendarDays.filter((day) => isSameMonth(day, monthStart))

  // Клик по ячейке дня: добавляет или удаляет дату из списка выделенных
  const handleDateClick = (day) => {
    setSelectedDates((prev) => {
      const exists = prev.find((d) => isSameDay(d, day))
      if (exists) {
        return prev.filter((d) => !isSameDay(d, day))
      }
      return [...prev, day]
    })
  }

  const handleDayCellClick = (day, isDayPopulated, dayShifts, isCurrentMonth) => {
    if (!isCurrentMonth) return

    // 👁 РЕЖИМ ПРОСМОТРА
    if (calendarMode === 'view') {
      if (isDayPopulated && dayShifts.length > 1) {
        // Если смен несколько → раскрываем/сворачиваем список внутри ячейки
        const dayKey = format(day, 'yyyy-MM-dd')
        setExpandedCells((prev) => ({ ...prev, [dayKey]: !prev[dayKey] }))
        return
      }

      // Если 1 смена → открываем модалку
      if (dayShifts[0]?.id) {
        setSelectedWorkday(dayShifts[0].id)
        setOpenOneDayDialog(true)
      }
      return
    }

    // ✏️ РЕЖИМ РЕДАКТИРОВАНИЯ
    // Клик по ячейке всегда выделяет/снимает выделение с даты
    handleDateClick(day)
  }

  const selectAllDays = () => {
    setSelectedDates(currentMonthDays)
  }

  const selectDaysWithoutShifts = () => {
    const emptyDays = currentMonthDays.filter((day) => {
      // Находим все смены охранника, привязанные к текущему дню
      const dayShifts = shifts.filter((shift) => isSameDay(shift.parsedDate, day))

      // День считается абсолютно ПУСТЫМ, если в этот день у охранника нет ни одной смены
      return dayShifts.length === 0
    })

    setSelectedDates(emptyDays)
  }

  // Клик строго по бейджу существующей смены
  const handleShiftClick = (e, shift) => {
    e.stopPropagation()
    // 🔒 В режиме редактирования полностью блокируем открытие модалки
    if (calendarMode === 'edit') return

    setSelectedWorkday(shift.id)
    setOpenOneDayDialog(true)
  }

  // Клик по кнопке «Назначить смену» в синей нижней панели
  const handleOpenCreateDialog = () => {
    setEmptyDayInfo({
      securityId: securityId, // Передаем ID охранника
      dates: selectedDates, // Массив выделенных дат
    })
    setOpenEmptyDayDialog(true)
  }

  // ✅ Лоадер в стиле CalendarAllObjects
  if (isLoading || isFetching) {
    return (
      <VStack align="stretch" gap={6} p={4} bg="white" borderRadius="xl" shadow="sm">
        {/* Заголовок (показывается даже при загрузке) */}
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
            {currentSecurity?.name} {currentSecurity?.surname}
          </Heading>
        </Box>

        {/* ✅ Центрированный спиннер */}
        <Box h="calc(75vh - 200px)" display="flex" alignItems="center" justifyContent="center">
          <Spinner size="lg" color="blue.500" thickness="3px" />
        </Box>
      </VStack>
    )
  }

  // ✅ Обработка ошибки
  if (isError) {
    return (
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
            {currentSecurity?.name} {currentSecurity?.surname}
          </Heading>
        </Box>
        <Flex h="200px" align="center" justify="center" color="red.500">
          <Text>Ошибка загрузки данных с сервера</Text>
        </Flex>
      </VStack>
    )
  }

  return (
    <>
      <OneDaySecurityDialog
        open={openOneDayDialog}
        setOpen={setOpenOneDayDialog}
        selectedWorkday={selectedWorkday}
        setSelectedWorkday={setSelectedWorkday}
      />
      {/* ДИАЛОГ МАССОВОГО СОЗДАНИЯ СМЕН ДЛЯ ВЫБРАННЫХ ДНЕЙ */}
      <EmptyDayDialogSecurities
        emptyDayInfo={emptyDayInfo}
        setEmptyDayInfo={setEmptyDayInfo}
        open={openEmptyDayDialog}
        setOpen={setOpenEmptyDayDialog}
        onSuccessAction={() => setSelectedDates([])}
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
            {currentSecurity.name}
          </Heading>
          <Heading size="lg" color="gray.800" mt={1}>
            {currentSecurity.surname}
          </Heading>
        </Box>
        {/* Выпадающий список объектов */}
        <Button
          variant="ghost"
          justifyContent="space-between"
          onClick={() => setIsListOpen(!isListOpen)}
        >
          {isListOpen ? 'Скрыть список охранников' : 'Открыть список охранников'}
          {isListOpen ? <LuChevronUp /> : <LuChevronDown />}
        </Button>

        {isListOpen && <SecurityList />}

        {/* Шапка календаря: Название месяца и пагинация по месяцам */}
        {/* Шапка календаря: улучшенная навигация */}
        <Box w="100%">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            gap={4}
            w="100%"
            pb={2}
            borderBottom="1px solid"
            borderColor="gray.100"
          >
            {/* 🔹 Левая часть: Месяц и год (выделено визуально) */}
            <VStack align="flex-start" gap={2} w={{ base: '100%', md: 'auto' }}>
              <HStack gap={2} wrap="wrap">
                {/* Выбор месяца */}
                <Box position="relative">
                  <Box
                    as="select"
                    value={month}
                    onChange={handleMonthChange}
                    px={3}
                    py={2}
                    fontSize="sm"
                    fontWeight="medium"
                    borderRadius="md"
                    border="2px solid"
                    borderColor="blue.200"
                    bg="blue.50"
                    color="blue.700"
                    _focus={{ outline: 'none', ring: '2px', ringColor: 'blue.500' }}
                    cursor="pointer"
                    appearance="none"
                    pr={8}
                  >
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </Box>
                  <Box
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    pointerEvents="none"
                    color="blue.500"
                  >
                    <LuChevronDown size={16} />
                  </Box>
                </Box>

                {/* Выбор года */}
                <Box position="relative">
                  <Box
                    as="select"
                    value={year}
                    onChange={handleYearChange}
                    px={3}
                    py={2}
                    fontSize="sm"
                    fontWeight="medium"
                    borderRadius="md"
                    border="2px solid"
                    borderColor="blue.200"
                    bg="blue.50"
                    color="blue.700"
                    _focus={{ outline: 'none', ring: '2px', ringColor: 'blue.500' }}
                    cursor="pointer"
                    appearance="none"
                    pr={8}
                    minW="75px"
                    textAlign="center"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Box>
                  <Box
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    pointerEvents="none"
                    color="blue.500"
                  >
                    <LuChevronDown size={16} />
                  </Box>
                </Box>

                {/* Кнопка «Сегодня» — компактная */}
                <Button
                  size="sm"
                  variant="ghost"
                  colorPalette="gray"
                  fontSize="xs"
                  px={2}
                  onClick={() => setCurrentMonth(new Date())}
                  title="Перейти к текущему месяцу"
                >
                  Сегодня
                </Button>
              </HStack>
            </VStack>

            {/* 🔹 Правая часть: Управление (сгруппировано) */}
            <HStack gap={1} wrap="wrap" justifyContent={{ base: 'flex-start', md: 'flex-end' }}>
              {/* Переключатель режима с иконками */}
              {/* 🔹 Переключатель режима: понятный и доступный */}
              {/* 🔹 Переключатель режима: интуитивно понятный */}
              <VStack align="flex-start" gap={0} w={{ base: '100%', md: 'auto' }}>
                <HStack gap={2} align="center" wrap="wrap">
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Режим:
                  </Text>

                  <Box
                    display="inline-flex"
                    borderRadius="full"
                    border="1px solid"
                    borderColor="gray.300"
                    bg="gray.100"
                    p="2px"
                    role="radiogroup"
                    aria-label="Выбор режима календаря"
                  >
                    {/* 👁 ПРОСМОТР */}
                    <Button
                      role="radio"
                      aria-checked={calendarMode === 'view'}
                      size="sm"
                      variant={calendarMode === 'view' ? 'solid' : 'ghost'}
                      colorPalette={calendarMode === 'view' ? 'blue' : 'gray'}
                      borderRadius="full"
                      px={{ base: 3, md: 4 }}
                      minW={{ base: '32px', md: '100px' }}
                      transition="all 0.15s"
                      onClick={() => {
                        setCalendarMode('view')
                        setSelectedDates([])
                      }}
                      leftIcon={<LuEye size={15} />}
                    >
                      <Box display={{ base: 'none', md: 'inline' }} fontWeight="medium">
                        Просмотр
                      </Box>
                    </Button>

                    {/* ✏️ РЕДАКТИРОВАНИЕ */}
                    <Button
                      role="radio"
                      aria-checked={calendarMode === 'edit'}
                      size="sm"
                      variant={calendarMode === 'edit' ? 'solid' : 'ghost'}
                      colorPalette={calendarMode === 'edit' ? 'orange' : 'gray'}
                      borderRadius="full"
                      px={{ base: 3, md: 4 }}
                      minW={{ base: '32px', md: '115px' }}
                      transition="all 0.15s"
                      onClick={() => setCalendarMode('edit')}
                      leftIcon={<LuPencil size={15} />}
                    >
                      <Box display={{ base: 'none', md: 'inline' }} fontWeight="medium">
                        Редактирование
                      </Box>
                    </Button>
                  </Box>
                </HStack>

                {/* ✅ Динамическая подсказка: сразу объясняет, что делает выбранный режим */}
                <Text fontSize="2xs" color="gray.500" mt={1} lineHeight="1.4" w="100%">
                  {calendarMode === 'view' ? '🔒 Просмотр.' : '✏️ Редактирование.'}
                </Text>
              </VStack>

              {/* Разделитель */}
              <Box display={{ base: 'none', md: 'block' }} w="1px" h="24px" bg="gray.200" />

              {/* Навигация по месяцам — компактные кнопки с иконками */}
              <HStack
                gap={0}
                borderRadius="md"
                overflow="hidden"
                border="1px solid"
                borderColor="gray.200"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  minW="auto"
                  w="32px"
                  h="32px"
                  p={0}
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  aria-label="Предыдущий месяц"
                  title="Предыдущий месяц"
                  borderRadius={0}
                  _first={{ borderRadius: 'md 0 0 md' }}
                >
                  <LuChevronUp size={18} />
                </Button>
                <Box w="1px" h="24px" bg="gray.200" />
                <Button
                  size="sm"
                  variant="ghost"
                  minW="auto"
                  w="32px"
                  h="32px"
                  p={0}
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  aria-label="Следующий месяц"
                  title="Следующий месяц"
                  borderRadius={0}
                  _last={{ borderRadius: '0 md md 0' }}
                >
                  <LuChevronDown size={18} />
                </Button>
              </HStack>
            </HStack>
          </Flex>

          {/* 🔹 Мобильная панель действий (показывается только на мобильных в режиме edit) */}
          {calendarMode === 'edit' && (
            <HStack gap={2} wrap="wrap" pt={2} justifyContent="flex-start">
              <Button size="xs" variant="outline" onClick={selectAllDays} flex={1}>
                Весь месяц
              </Button>
              <Button size="xs" variant="outline" onClick={selectDaysWithoutShifts} flex={1}>
                Без смен
              </Button>
            </HStack>
          )}
        </Box>

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
            const isCurrentMonth = isSameMonth(day, monthStart)
            const isDayPopulated = dayShifts.length > 0

            // ✅ СТИЛИ ВЫЧИСЛЯЕМ ЗДЕСЬ, внутри цикла .map()
            const borderColor =
              calendarMode === 'edit' && isSelected ? 'blue.500' : isToday ? 'blue.300' : 'gray.100'

            const borderWidth = calendarMode === 'edit' && isSelected ? '2px' : '1px'

            return (
              <Box
                key={idx}
                minH="110px"
                border={`${borderWidth} solid`}
                borderColor={borderColor}
                bg={isSelected ? 'blue.500' : 'transparent'}
                color={isSelected ? 'white' : 'black'}
                p={1}
                cursor={isCurrentMonth && calendarMode === 'edit' ? 'pointer' : 'default'}
                transition="0.1s"
                _hover={
                  isCurrentMonth && calendarMode === 'edit'
                    ? { bg: isSelected ? 'blue.600' : 'gray.50' }
                    : undefined
                }
                onClick={() => handleDayCellClick(day, isDayPopulated, dayShifts, isCurrentMonth)}
                opacity={isCurrentMonth ? 1 : 0.3}
              >
                <Text fontWeight={isToday ? 'bold' : 'medium'} fontSize="sm">
                  {format(day, 'd')}
                </Text>

                {isDayPopulated &&
                  (() => {
                    const dayKey = format(day, 'yyyy-MM-dd')
                    const isCellExpanded = !!expandedCells[dayKey]

                    // Агрегируем данные для отображения (если смен несколько)
                    const aggregated = dayShifts.reduce(
                      (acc, shift) => ({
                        totalWorkers: acc.totalWorkers + (shift.totalWorkers || 0),
                        startedCount: acc.startedCount + (shift.startedCount || 0),
                        finishedCount: acc.finishedCount + (shift.finishedCount || 0),
                      }),
                      { totalWorkers: 0, startedCount: 0, finishedCount: 0 }
                    )

                    // Прогресс и цветовая схема
                    const progress =
                      aggregated.totalWorkers > 0
                        ? (aggregated.startedCount / aggregated.totalWorkers) * 100
                        : 0
                    const colorScheme =
                      progress === 100 ? 'green' : progress >= 50 ? 'yellow' : 'orange'

                    return (
                      <VStack align="stretch" gap={1} mt={1}>
                        {/* Если смен > 1 и ячейка не раскрыта — показываем счётчик */}
                        {dayShifts.length > 1 && !isCellExpanded ? (
                          <Badge
                            colorPalette="blue"
                            variant="subtle"
                            fontSize="2xs"
                            fontWeight="medium"
                            cursor="pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedCells((prev) => ({ ...prev, [dayKey]: true }))
                            }}
                          >
                            Смен: {dayShifts.length}
                          </Badge>
                        ) : (
                          <>
                            {/* Контейнер с прокруткой для списка смен */}
                            <Box
                              maxH="140px"
                              overflowY="auto"
                              sx={{
                                '&::-webkit-scrollbar': { width: '4px' },
                                '&::-webkit-scrollbar-thumb': {
                                  bg: 'gray.300',
                                  borderRadius: 'full',
                                },
                              }}
                            >
                              <VStack align="stretch" gap={1.5}>
                                {dayShifts.map((shift) => {
                                  const foundObject = objectsDictionary?.find(
                                    (el) => el.id == shift.securityObjectId
                                  )
                                  const objectTitle = foundObject
                                    ? foundObject.title
                                    : `Объект #${shift.securityObjectId}`

                                  // ✅ Определяем, завершена ли смена
                                  const isShiftFinished =
                                    shift.isFinished ||
                                    ((shift.finishedCount || 0) >= (shift.totalWorkers || 0) &&
                                      (shift.totalWorkers || 0) > 0)

                                  // Прогресс и цветовая схема
                                  const shiftProgress =
                                    shift.totalWorkers > 0
                                      ? ((shift.startedCount || 0) / shift.totalWorkers) * 100
                                      : 0
                                  const shiftColor = isShiftFinished
                                    ? 'green'
                                    : shiftProgress === 100
                                      ? 'green'
                                      : shiftProgress >= 50
                                        ? 'yellow'
                                        : 'orange'

                                  return (
                                    <Box
                                      key={shift.id}
                                      p={2}
                                      borderRadius="md"
                                      bg={isSelected ? 'whiteAlpha.200' : `${shiftColor}.50`}
                                      border="1px solid"
                                      borderColor={
                                        isSelected ? 'whiteAlpha.400' : `${shiftColor}.300`
                                      }
                                      cursor={
                                        isCurrentMonth && calendarMode === 'view'
                                          ? 'pointer'
                                          : 'default'
                                      }
                                      _hover={
                                        isCurrentMonth && calendarMode === 'view'
                                          ? { shadow: 'md', bg: `${shiftColor}.100` }
                                          : undefined
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        if (isCurrentMonth && calendarMode === 'view') {
                                          handleShiftClick(e, shift)
                                        }
                                      }}
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
                                          {objectTitle.length > 20
                                            ? objectTitle.slice(0, 20) + '…'
                                            : objectTitle}
                                        </Text>

                                        {/* Строка 1: иконка старта + бейдж начатых */}
                                        <HStack justify="space-between">
                                          {/* Статус смены */}
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
                                            {isShiftFinished
                                              ? 'Завершена'
                                              : shift.isFinished
                                                ? 'Завершена'
                                                : 'Активна'}
                                          </Text>
                                        </HStack>
                                      </VStack>
                                    </Box>
                                  )
                                })}
                              </VStack>
                            </Box>

                            {/* Кнопка свернуть (если смен > 1 и раскрыто) */}
                            {dayShifts.length > 1 && isCellExpanded && (
                              <Button
                                size="xs"
                                variant="ghost"
                                colorPalette="gray"
                                fontSize="2xs"
                                px={1}
                                mt={-1}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setExpandedCells((prev) => ({ ...prev, [dayKey]: false }))
                                }}
                              >
                                Свернуть
                              </Button>
                            )}
                          </>
                        )}
                      </VStack>
                    )
                  })()}
              </Box>
            )
          })}
        </SimpleGrid>

        {/* Нижняя всплывающая синяя панель действий */}
        {selectedDates.length > 0 && calendarMode === 'edit' && (
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
              <Button colorScheme="blue" size="md" onClick={handleOpenCreateDialog}>
                Назначить смену
              </Button>
              <Button
                bg="white"
                color="red.600"
                _hover={{ bg: 'red.50', color: 'red.700' }}
                size="md"
                fontWeight="bold"
                onClick={() => setSelectedDates([])}
              >
                Очистить выбор
              </Button>
            </HStack>
          </HStack>
        )}
      </VStack>
    </>
  )
}
