'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Stack, Field, SimpleGrid, Textarea, Text, Flex } from '@chakra-ui/react'
import { createObjectSchema } from '@/features/object/model/create-object-schema'
import { usePostObject } from '@/features/object/api/use-post-object'
import { useUpdateObject } from '@/features/object/api/use-update-object'

export default function ObjectForm({ onSuccess, initialData }) {
  const isEditing = !!initialData
  const { mutate: create, isPending: isCreating } = usePostObject()
  const { mutate: update, isPending: isUpdating } = useUpdateObject()

  const isLoading = isCreating || isUpdating

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createObjectSchema),

    defaultValues: initialData || {
      title: '',
      description: '',
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
          ДАННЫЕ {isEditing && `(РЕДАКТИРОВАНИЕ)`}
        </Text>

        <SimpleGrid columns={2} gap={4}>
          <Field.Root invalid={!!errors.title}>
            <Field.Label>Название</Field.Label>
            <Input {...register('title')} placeholder="Больница" disabled={isLoading} />
            <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
          </Field.Root>
        </SimpleGrid>

        <Text fontWeight="bold" color="blue.600" fontSize="sm" mt={4}>
          ДОПОЛНИТЕЛЬНО
        </Text>
        <SimpleGrid columns={1} gap={4}>
          <Field.Root>
            <Field.Label>Описание</Field.Label>
            <Input
              {...register('description')}
              placeholder="Недостроенный корпус..."
              disabled={isLoading}
            />
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
