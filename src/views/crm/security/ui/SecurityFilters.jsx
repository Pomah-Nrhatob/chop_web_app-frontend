'use client'

import { FilterField } from '@/components/ui/FilterField'
import { Button, HStack, SimpleGrid } from '@chakra-ui/react'

export const SecurityFilters = ({ filters, onFilterChange, onReset }) => {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={3} w="full">
      <FilterField
        size="sm"
        label="Поиск"
        placeholder="Иванов..."
        value={filters.search}
        onChange={(val) => onFilterChange('search', val)}
      />
      <FilterField
        size="sm"
        label="Ставка до"
        type="number"
        placeholder="5000"
        value={filters.maxShiftSalary}
        onChange={(val) => onFilterChange('maxShiftSalary', val)}
      />
      <FilterField
        size="sm"
        label="Статус"
        type="select"
        placeholder="Все статусы"
        value={filters.statusId}
        onChange={(val) => onFilterChange('statusId', val)}
        options={[
          { label: 'Все статусы', value: '' },
          { label: 'Активен', value: '1' },
          { label: 'Уволен', value: '3' },
        ]}
      />
      <FilterField
        size="sm"
        label="Лицензия"
        type="select"
        placeholder="Все"
        value={filters.hasLicense}
        onChange={(val) => onFilterChange('hasLicense', val)}
        options={[
          { label: 'Все', value: '' },
          { label: 'С лицензией', value: 'true' },
          { label: 'Без лицензии', value: 'false' },
        ]}
      />
      <FilterField
        size="sm"
        label="ФИО"
        type="select"
        placeholder="Сортировка"
        value={filters.sortBy === 'surname' ? filters.sortOrder : ''}
        onChange={(val) =>
          onFilterChange('sort', {
            sortBy: 'surname',
            sortOrder: val,
          })
        }
        options={[
          { label: 'Не выбрано', value: '' },
          { label: 'А → Я', value: 'asc' },
          { label: 'Я → А', value: 'desc' },
        ]}
      />
      <FilterField
        size="sm"
        label="Ставка"
        type="select"
        placeholder="Сортировка"
        value={filters.sortBy === 'shiftSalary' ? filters.sortOrder : ''}
        onChange={(val) =>
          onFilterChange('sort', {
            sortBy: 'shiftSalary',
            sortOrder: val,
          })
        }
        options={[
          { label: 'Не выбрано', value: '' },
          { label: 'Дешевле', value: 'asc' },
          { label: 'Дороже', value: 'desc' },
        ]}
      />

      <HStack gridColumn="1 / -1" justify="flex-end" mt={3}>
        <Button size="sm" variant="outline" onClick={onReset}>
          Сбросить фильтры
        </Button>
      </HStack>
    </SimpleGrid>
  )
}
