'use client'

import { Center, Spinner, Table, Text } from '@chakra-ui/react'

export const TableList = ({
  headers,
  items = [],
  isLoading,
  renderRow,
  emptyText = 'Данные не найдены',
}) => {
  if (isLoading && items.length === 0) {
    return (
      <Center minH="420px">
        <Spinner size="lg" thickness="3px" color="blue.500" />
      </Center>
    )
  }

  return (
    <Table.Root size="sm" interactive>
      <Table.Header>
        <Table.Row bg="gray.50">
          {headers.map((header, index) => (
            <Table.ColumnHeader key={index} textAlign={header.textAlign || 'start'}>
              {header.title}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {items.length > 0 ? (
          items.map((item) => renderRow(item))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={headers.length} textAlign="center" py={20}>
              <Text color="gray.400">{emptyText}</Text>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  )
}
