'use client'

import { FilterField } from '@/components/ui/FilterField'
import { Box, SimpleGrid, Button, HStack } from '@chakra-ui/react'

export const ObjectFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={3} w="full">
      <FilterField
        label="Поиск (название)"
        placeholder="Название объекта..."
        value={filters.search}
        onChange={(val) => onFilterChange('search', val)}
      />

      <FilterField
        placeholder="Название по..."
        label="Сортировка: дата"
        type="select"
        value={filters.sortBy === 'createdAt' ? filters.sortOrder : ''}
        onChange={(val) => onFilterChange({ sortBy: 'createdAt', sortOrder: val })}
        options={[
          { label: 'Выберите...', value: '', disabled: true },
          { label: 'Сначала новые', value: 'desc' },
          { label: 'Сначала старые', value: 'asc' },
        ]}
      />

      <FilterField
        placeholder="Название по..."
        label="Сортировка: название"
        type="select"
        value={filters.sortBy === 'title' ? filters.sortOrder : ''}
        onChange={(val) => onFilterChange({ sortBy: 'title', sortOrder: val })}
        options={[
          { label: 'Выберите...', value: '', disabled: true },
          { label: 'А → Я', value: 'asc' },
          { label: 'Я → А', value: 'desc' },
        ]}
      />

      <HStack gridColumn="1 / -1" justify="flex-end" mt={3}>
        <Button variant="outline" onClick={onReset}>
          Сбросить все фильтры
        </Button>
      </HStack>
    </SimpleGrid>
  )
}
