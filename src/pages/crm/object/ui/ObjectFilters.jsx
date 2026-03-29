'use client'

import { Box, SimpleGrid, Field, Input, Button } from '@chakra-ui/react'

export const ObjectFilters = ({ filters, onFilterChange, onReset }) => {
  const selectStyle = {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    height: '40px',
    background: 'white',
    fontSize: '14px',
    width: '100%',
  }

  return (
    <Box p={4} bg="gray.50" borderRadius="xl" border="1px solid" borderColor="gray.200">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <Field.Root>
          <Field.Label fontSize="xs">Поиск (название)</Field.Label>
          <Input
            placeholder="Охрана..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            bg="white"
          />
        </Field.Root>
        <Field.Root>
          <Field.Label fontSize="xs">Сортировка: дата</Field.Label>
          <select
            value={filters.sortBy === 'createdAt' ? filters.sortOrder : ''}
            onChange={(e) =>
              onFilterChange('sort', { sortBy: 'createdAt', sortOrder: e.target.value })
            }
            style={selectStyle}
          >
            <option value="" disabled>
              Выберите...
            </option>
            <option value="desc">Сначала новые</option>
            <option value="asc">Сначала старые</option>
          </select>
        </Field.Root>
        <Field.Root>
          <Field.Label fontSize="xs">Сортировка: название</Field.Label>
          <select
            value={filters.sortBy === 'title' ? filters.sortOrder : ''}
            onChange={(e) => onFilterChange('sort', { sortBy: 'title', sortOrder: e.target.value })}
            style={selectStyle}
          >
            <option value="" disabled>
              Выберите...
            </option>
            <option value="asc">А → Я</option>
            <option value="desc">Я → А</option>
          </select>
        </Field.Root>

        <Button variant="outline" gridColumn={{ lg: 'span 3' }} onClick={onReset}>
          Сбросить все фильтры
        </Button>
      </SimpleGrid>
    </Box>
  )
}
