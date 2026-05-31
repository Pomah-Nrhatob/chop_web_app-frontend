'use client'

import { Table, HStack, Flex, Box, IconButton } from '@chakra-ui/react'
import { LuCalendar, LuInfo, LuPencil, LuTrash2 } from 'react-icons/lu'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // ✅ Для авто-скрытия на странице календаря

export const DataTableRow = ({
  goToCalendar,
  calendarHref,
  icon: Icon,
  title,
  subContent,
  onDetails,
  onEdit,
  onDelete,
  isDeleting,
  actionsColor = 'blue',
  // ✅ Новые пропсы для управления видимостью кнопок
  showEdit = true,
  showDelete = true,
  // ✅ Опционально: скрыть кнопки, если мы на странице календаря этого объекта
  hideOnCalendarPage = false,
}) => {
  const pathname = usePathname()

  // ✅ Авто-определение: если мы на странице календаря и включён флаг — скрываем
  const isCalendarPage = hideOnCalendarPage && pathname?.includes('/calendar/')

  // Итоговые флаги видимости
  const shouldShowEdit = showEdit && !isCalendarPage
  const shouldShowDelete = showDelete && !isCalendarPage

  return (
    <Table.Row _hover={{ bg: 'gray.50/50' }} transition="background 0.2s ease">
      <Table.Cell py={3}>
        <HStack gap={3}>
          <Flex
            align="center"
            justify="center"
            boxSize="32px"
            bg={`${actionsColor}.50`}
            color={`${actionsColor}.600`}
            borderRadius="md"
          >
            <Icon size={16} />
          </Flex>
          <Box>
            <Box fontWeight="medium" color="gray.800">
              {title}
            </Box>
            {subContent && (
              <HStack gap={2} mt={1}>
                {subContent}
              </HStack>
            )}
          </Box>
        </HStack>
      </Table.Cell>

      <Table.Cell textAlign="end">
        <HStack gap={1} justify="flex-end">
          {/* Календарь */}
          {calendarHref ? (
            <Link href={calendarHref} style={{ display: 'inline-flex' }}>
              <IconButton
                variant="ghost"
                size="sm"
                colorPalette="blue"
                title="Календарь"
                tabIndex={-1}
              >
                <LuCalendar size={16} />
              </IconButton>
            </Link>
          ) : (
            <IconButton
              variant="ghost"
              size="sm"
              colorPalette="blue"
              onClick={goToCalendar}
              title="Календарь"
            >
              <LuCalendar size={16} />
            </IconButton>
          )}

          {/* Детали — всегда показываем */}
          <IconButton
            variant="ghost"
            size="sm"
            colorPalette="blue"
            onClick={onDetails}
            title="Детали"
          >
            <LuInfo size={16} />
          </IconButton>

          {/* ✅ Редактировать — условный рендер */}
          {shouldShowEdit && (
            <IconButton
              variant="ghost"
              size="sm"
              colorPalette="orange"
              onClick={onEdit}
              title="Редактировать"
            >
              <LuPencil size={16} />
            </IconButton>
          )}

          {/* ✅ Удалить — условный рендер */}
          {shouldShowDelete && (
            <IconButton
              variant="ghost"
              size="sm"
              colorPalette="red"
              onClick={onDelete}
              loading={isDeleting}
              title="Удалить"
            >
              <LuTrash2 size={16} />
            </IconButton>
          )}
        </HStack>
      </Table.Cell>
    </Table.Row>
  )
}
