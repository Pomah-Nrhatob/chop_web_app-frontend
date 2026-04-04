'use client'

import { Button, Stack, SimpleGrid, Text, Flex } from '@chakra-ui/react'
import { FormField } from '@/components/ui/FormField'
import { useObjectForm } from '../hooks.js/useObjectForm'

export default function ObjectForm({ onSuccess, initialData }) {
  const { isLoading, register, handleSubmit, errors, onSubmit, isEditing } = useObjectForm(
    onSuccess,
    initialData
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Text fontWeight="bold" color="blue.600" fontSize="sm">
          ДАННЫЕ {isEditing && `(РЕДАКТИРОВАНИЕ)`}
        </Text>

        <SimpleGrid columns={2} gap={4}>
          <FormField
            label="Название"
            placeholder="Больница"
            register={register('title')}
            error={errors.title}
            disabled={isLoading}
          />
        </SimpleGrid>

        <Text fontWeight="bold" color="blue.600" fontSize="sm" mt={4}>
          ДОПОЛНИТЕЛЬНО
        </Text>

        <SimpleGrid columns={1} gap={4}>
          <FormField
            label="Описание"
            type="textarea"
            placeholder="Недостроенный корпус..."
            register={register('description')}
            error={errors.description}
            disabled={isLoading}
          />
        </SimpleGrid>

        <Flex justify="flex-end" mt={6}>
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
