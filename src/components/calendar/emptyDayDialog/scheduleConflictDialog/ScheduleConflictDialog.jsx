import {
  Badge,
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  Table,
  Text,
} from '@chakra-ui/react'
import { IoWarningOutline } from 'react-icons/io5'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function ScheduleConflictDialog({ open, conflict, onClose, onExitComplete }) {
  const rows = [
    ...(conflict?.vacations ?? []).map((item) => ({
      ...item,
      reason: 'VACATION',
    })),
    ...(conflict?.mainWorkdays ?? []).map((item) => ({
      ...item,
      reason: 'MAIN',
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose()
      }}
      onExitComplete={onExitComplete}
    >
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner
          alignItems={{ base: 'center', md: 'flex-start' }}
          justifyContent="center"
        >
          <Dialog.Content gap={3} w={{ base: '95%', md: '720px' }} maxW="720px" maxH="80vh">
            <Dialog.Header>
              <Flex gap={3} align="center">
                <IoWarningOutline size={28} />

                <Box>
                  <Dialog.Title>Невозможно создать расписание</Dialog.Title>

                  <Text fontSize="sm" color="gray.600" mt={1}>
                    Для некоторых сотрудников найдены конфликты расписания.
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Если вам нужен сотрудник в занятый день, можете выбрать тип дня "Подработка"
                  </Text>
                </Box>
              </Flex>
            </Dialog.Header>

            <Dialog.Body p={5}>
              <Box overflowY="auto" maxH="55vh">
                <Table.Root size="sm" stickyHeader>
                  <Table.Header>
                    <Table.Row bg="bg.subtle">
                      <Table.ColumnHeader>Сотрудник</Table.ColumnHeader>

                      <Table.ColumnHeader w="130px">Дата</Table.ColumnHeader>

                      <Table.ColumnHeader w="170px">Причина</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {rows.map((row, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{row.fullName}</Table.Cell>

                        <Table.Cell>
                          {format(new Date(row.date), 'dd.MM.yyyy', {
                            locale: ru,
                          })}
                        </Table.Cell>

                        <Table.Cell>
                          <Badge colorPalette={row.reason === 'VACATION' ? 'orange' : 'red'}>
                            {row.reason === 'VACATION' ? 'Отпуск' : 'Основная смена'}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Dialog.Body>

            <Dialog.Footer>
              <Button onClick={onClose}>Понятно</Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton pb={3} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
