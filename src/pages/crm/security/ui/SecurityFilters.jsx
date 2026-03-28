'use client'

import { Box, SimpleGrid, Field, Input, Button } from '@chakra-ui/react'

export const SecurityFilters = ({ filters, onFilterChange, onReset }) => {
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
          <Field.Label fontSize="xs">Поиск (ФИО)</Field.Label>
          <Input
            placeholder="Иванов..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            bg="white"
          />
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs">Ставка до (₽)</Field.Label>
          <Input
            type="number"
            placeholder="5000"
            value={filters.maxShiftSalary}
            onChange={(e) => onFilterChange('maxShiftSalary', e.target.value)}
            bg="white"
          />
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs">Статус</Field.Label>
          <select
            value={filters.statusId}
            onChange={(e) => onFilterChange('statusId', e.target.value)}
            style={selectStyle}
          >
            <option value="">Все статусы</option>
            <option value="1">Активен</option>
            <option value="2">Отпуск</option>
            <option value="3">Уволен</option>
          </select>
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs">Лицензия</Field.Label>
          <select
            value={filters.hasLicense}
            onChange={(e) => onFilterChange('hasLicense', e.target.value)}
            style={selectStyle}
          >
            <option value="">Все</option>
            <option value="true">С лицензией</option>
            <option value="false">Без лицензии</option>
          </select>
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs">Сортировка: ФИО</Field.Label>
          <select
            value={filters.sortBy === 'surname' ? filters.sortOrder : ''}
            onChange={(e) =>
              onFilterChange('sort', { sortBy: 'surname', sortOrder: e.target.value })
            }
            style={selectStyle}
          >
            <option value="" disabled>
              Выберите...
            </option>
            <option value="asc">А → Я</option>
            <option value="desc">Я → А</option>
          </select>
        </Field.Root>

        <Field.Root>
          <Field.Label fontSize="xs">Сортировка: Ставка</Field.Label>
          <select
            value={filters.sortBy === 'shiftSalary' ? filters.sortOrder : ''}
            onChange={(e) =>
              onFilterChange('sort', { sortBy: 'shiftSalary', sortOrder: e.target.value })
            }
            style={selectStyle}
          >
            <option value="" disabled>
              Выберите...
            </option>
            <option value="asc">Дешевле</option>
            <option value="desc">Дороже</option>
          </select>
        </Field.Root>

        <Button variant="outline" gridColumn={{ lg: 'span 3' }} onClick={onReset}>
          Сбросить все фильтры
        </Button>
      </SimpleGrid>
    </Box>
  )
}
