'use client'

import { Table } from '@chakra-ui/react'

export const TableList = ({
  headers,
  items = [],
  isLoading,
  renderRow,
  emptyText = 'Данные не найдены',
}) => {
  return (
    <Table.Root size="sm" variant="outline" interactive>
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
        {isLoading && items.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={headers.length} textAlign="center" py={10} color="gray.500">
              Загрузка данных...
            </Table.Cell>
          </Table.Row>
        ) : items.length > 0 ? (
          items.map((item) => renderRow(item))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={headers.length} textAlign="center" py={10} color="gray.400">
              {emptyText}
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  )
}
