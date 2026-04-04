'use client'

import { Button, Stack, SimpleGrid, Text } from '@chakra-ui/react'
import { FormField } from '@/components/ui/FormField'
import { useSecurityForm } from '../hooks/useSecurityForm'

export default function SecurityForm({ onSuccess, initialData }) {
  const { isLoading, register, handleSubmit, errors, onSubmit, isEditing } = useSecurityForm(
    onSuccess,
    initialData
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Text fontWeight="bold" color="blue.600" fontSize="sm">
          ЛИЧНЫЕ ДАННЫЕ {isEditing && `(РЕДАКТИРОВАНИЕ)`}
        </Text>

        <SimpleGrid columns={2} gap={4}>
          <FormField
            label="Фамилия"
            register={register('surname')}
            error={errors.surname}
            placeholder="Иванов"
            disabled={isLoading}
          />
          <FormField
            label="Имя"
            register={register('name')}
            error={errors.name}
            placeholder="Олег"
            disabled={isLoading}
          />
          <FormField
            label="Отчество"
            register={register('patronymic')}
            placeholder="Иванович"
            disabled={isLoading}
          />
          <FormField
            label="Возраст"
            type="number"
            register={register('age', { valueAsNumber: true })}
            error={errors.age}
            placeholder="42"
            disabled={isLoading}
          />
        </SimpleGrid>

        <Text fontWeight="bold" color="blue.600" fontSize="sm" mt={4}>
          СЛУЖБА
        </Text>
        <SimpleGrid columns={2} gap={4}>
          <FormField
            label="Зарплата за смену"
            type="number"
            register={register('shiftSalary', { valueAsNumber: true })}
            error={errors.shiftSalary}
            placeholder="2000"
            disabled={isLoading}
          />
          <FormField
            label="Статус охранника"
            type="select"
            register={register('statusId', { valueAsNumber: true })}
            error={errors.statusId}
            disabled={isLoading}
            options={[
              { label: 'Выберите статус...', value: '', disabled: true, hidden: true },
              { label: 'Активен', value: 1 },
              { label: 'Отпуск', value: 2 },
              { label: 'Уволен', value: 3 },
            ]}
          />
        </SimpleGrid>

        <FormField
          label="Есть действующая лицензия"
          type="checkbox"
          id="lic"
          register={register('hasLicense')}
          disabled={isLoading}
        />

        <Text fontWeight="bold" color="blue.600" fontSize="sm" mt={4}>
          ДОПОЛНИТЕЛЬНО
        </Text>
        <SimpleGrid columns={1} gap={4}>
          <FormField
            label="Состояние здоровья"
            register={register('healthStatus')}
            placeholder="Здоров"
            disabled={isLoading}
          />
          <FormField
            label="Хронические заболевания"
            register={register('chronicDiseases')}
            placeholder="Нет"
            disabled={isLoading}
          />
          <FormField
            label="Характеристика"
            type="textarea"
            rows={3}
            register={register('personality')}
            error={errors.personality}
            placeholder="Опишите личные качества..."
            disabled={isLoading}
          />
        </SimpleGrid>

        <Button
          type="submit"
          colorPalette={isEditing ? 'orange' : 'blue'}
          size="lg"
          loading={isLoading}
          width="full"
          mt={6}
        >
          {isEditing ? 'Обновить данные' : 'Добавить в базу данных'}
        </Button>
      </Stack>
    </form>
  )
}
