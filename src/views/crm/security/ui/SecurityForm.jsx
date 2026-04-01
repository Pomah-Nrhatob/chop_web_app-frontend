'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Stack, Field, SimpleGrid, Textarea, Text, Flex } from '@chakra-ui/react'
import { createSecuritySchema } from '@/features/security/model/create-security-schema'
import { usePostSecurity } from '@/features/security/api/use-post-security'
import { useUpdateSecurity } from '@/features/security/api/use-update-security'

export default function SecurityForm({ onSuccess, initialData }) {
  const isEditing = !!initialData
  const { mutate: create, isPending: isCreating } = usePostSecurity()
  const { mutate: update, isPending: isUpdating } = useUpdateSecurity()

  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createSecuritySchema),

    defaultValues: initialData || {
      hasLicense: false,
      statusId: '',
      surname: '',
      name: '',
      patronymic: '',
      age: undefined,
      shiftSalary: undefined,
      healthStatus: '',
      chronicDiseases: '',
      personality: '',
    },
  })

  const onSubmit = (formData) => {
    const options = {
      onSuccess: () => {
        resetForm()
        if (onSuccess) onSuccess()
      },
    }

    if (isEditing) {
      update({ id: initialData.id, data: formData }, options)
    } else {
      create(formData, options)
    }
  }

  const selectStyle = {
    width: '100%',
    padding: '8.5px 12px',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    backgroundColor: isLoading ? '#F7FAFC' : 'white',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    outline: 'none',
    fontSize: '16px',
    color: 'inherit',
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Text fontWeight="bold" color="blue.600" fontSize="sm">
          ЛИЧНЫЕ ДАННЫЕ {isEditing && `(РЕДАКТИРОВАНИЕ)`}
        </Text>

        <SimpleGrid columns={2} gap={4}>
          <Field.Root invalid={!!errors.surname}>
            <Field.Label>Фамилия</Field.Label>
            <Input {...register('surname')} placeholder="Иванов" disabled={isLoading} />
            <Field.ErrorText>{errors.surname?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.name}>
            <Field.Label>Имя</Field.Label>
            <Input {...register('name')} placeholder="Олег" disabled={isLoading} />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Отчество</Field.Label>
            <Input {...register('patronymic')} placeholder="Иванович" disabled={isLoading} />
          </Field.Root>

          <Field.Root invalid={!!errors.age}>
            <Field.Label>Возраст</Field.Label>
            <Input
              type="number"
              {...register('age', { valueAsNumber: true })}
              placeholder="42"
              disabled={isLoading}
            />
            <Field.ErrorText>{errors.age?.message}</Field.ErrorText>
          </Field.Root>
        </SimpleGrid>

        <Text fontWeight="bold" color="blue.600" fontSize="sm" mt={4}>
          СЛУЖБА
        </Text>
        <SimpleGrid columns={2} gap={4}>
          <Field.Root invalid={!!errors.shiftSalary}>
            <Field.Label>Зарплата за смену</Field.Label>
            <Input
              type="number"
              {...register('shiftSalary', { valueAsNumber: true })}
              placeholder="2000"
              disabled={isLoading}
            />
            <Field.ErrorText>{errors.shiftSalary?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.statusId}>
            <Field.Label>Статус охранника</Field.Label>
            <select
              {...register('statusId', { valueAsNumber: true })}
              disabled={isLoading}
              style={selectStyle}
            >
              <option value="" disabled hidden>
                Выберите статус...
              </option>
              <option value={1}>Активен</option>
              <option value={2}>Отпуск</option>
              <option value={3}>Уволен</option>
            </select>
            <Field.ErrorText>{errors.statusId?.message}</Field.ErrorText>
          </Field.Root>
        </SimpleGrid>

        <Field.Root>
          <Flex align="center" gap={3} p={2} bg="gray.50" borderRadius="md">
            <input
              type="checkbox"
              {...register('hasLicense')}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              id="lic"
              disabled={isLoading}
            />
            <label htmlFor="lic" style={{ cursor: 'pointer', fontWeight: '500' }}>
              Есть действующая лицензия
            </label>
          </Flex>
        </Field.Root>

        <Text fontWeight="bold" color="blue.600" fontSize="sm" mt={4}>
          ДОПОЛНИТЕЛЬНО
        </Text>
        <SimpleGrid columns={1} gap={4}>
          <Field.Root>
            <Field.Label>Состояние здоровья</Field.Label>
            <Input {...register('healthStatus')} placeholder="Здоров" disabled={isLoading} />
          </Field.Root>

          <Field.Root>
            <Field.Label>Хронические заболевания</Field.Label>
            <Input {...register('chronicDiseases')} placeholder="Нет" disabled={isLoading} />
          </Field.Root>

          <Field.Root invalid={!!errors.personality}>
            <Field.Label>Характеристика</Field.Label>
            <Textarea
              {...register('personality')}
              placeholder="Опишите личные качества..."
              rows={3}
              disabled={isLoading}
            />
            <Field.ErrorText>{errors.personality?.message}</Field.ErrorText>
          </Field.Root>
        </SimpleGrid>

        <Flex justify="flex-end" mt={6} gap={3}>
          <Button
            type="submit"
            colorPalette={isEditing ? 'orange' : 'blue'}
            size="lg"
            loading={isLoading}
            loadingText="Сохранение..."
            width="full"
          >
            {isEditing ? 'Обновить данные' : 'Добавить в базу данных'}
          </Button>
        </Flex>
      </Stack>
    </form>
  )
}
