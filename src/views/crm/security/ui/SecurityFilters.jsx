'use client'

import { FilterField } from '@/components/ui/FilterField'
import { Box, SimpleGrid, Button } from '@chakra-ui/react'

export const SecurityFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <Box p={4} bg="gray.50" borderRadius="xl" border="1px solid" borderColor="gray.200">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
        <FilterField
          label="Поиск (ФИО)"
          placeholder="Иванов..."
          value={filters.search}
          onChange={(val) => onFilterChange('search', val)}
        />

        <FilterField
          label="Ставка до (₽)"
          type="number"
          placeholder="5000"
          value={filters.maxShiftSalary}
          onChange={(val) => onFilterChange('maxShiftSalary', val)}
        />

        <FilterField
          label="Статус"
          type="select"
          value={filters.statusId}
          onChange={(val) => onFilterChange('statusId', val)}
          options={[
            { label: 'Все статусы', value: '' },
            { label: 'Активен', value: '1' },
            { label: 'Отпуск', value: '2' },
            { label: 'Уволен', value: '3' },
          ]}
        />

        <FilterField
          label="Лицензия"
          type="select"
          value={filters.hasLicense}
          onChange={(val) => onFilterChange('hasLicense', val)}
          options={[
            { label: 'Все', value: '' },
            { label: 'С лицензией', value: 'true' },
            { label: 'Без лицензии', value: 'false' },
          ]}
        />

        <FilterField
          label="Сортировка: ФИО"
          type="select"
          value={filters.sortBy === 'surname' ? filters.sortOrder : ''}
          onChange={(val) => onFilterChange('sort', { sortBy: 'surname', sortOrder: val })}
          options={[
            { label: 'Выберите...', value: '', disabled: true, hidden: true },
            { label: 'А → Я', value: 'asc' },
            { label: 'Я → А', value: 'desc' },
          ]}
        />
        <FilterField
          label="Сортировка: Ставка"
          type="select"
          value={filters.sortBy === 'shiftSalary' ? filters.sortOrder : ''}
          onChange={(val) => onFilterChange('sort', { sortBy: 'shiftSalary', sortOrder: val })}
          options={[
            { label: 'Выберите...', value: '', disabled: true, hidden: true },
            { label: 'Дешевле', value: 'asc' },
            { label: 'Дороже', value: 'desc' },
          ]}
        />

        <Button variant="outline" gridColumn={{ lg: 'span 3' }} onClick={onReset}>
          Сбросить все фильтры
        </Button>
      </SimpleGrid>
    </Box>
  )
}
