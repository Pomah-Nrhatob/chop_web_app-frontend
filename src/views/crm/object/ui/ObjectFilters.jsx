'use client'

import { FilterField } from '@/components/ui/FilterField'
import { Box, SimpleGrid, Button } from '@chakra-ui/react'

export const ObjectFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <Box p={4} bg="gray.50" borderRadius="xl" border="1px solid" borderColor="gray.200">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <FilterField
          label="Поиск (название)"
          placeholder="Охрана..."
          value={filters.search}
          onChange={(val) => onFilterChange('search', val)}
        />

        <FilterField
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

        <Button variant="outline" gridColumn={{ lg: 'span 3' }} onClick={onReset}>
          Сбросить все фильтры
        </Button>
      </SimpleGrid>
    </Box>
  )
}
