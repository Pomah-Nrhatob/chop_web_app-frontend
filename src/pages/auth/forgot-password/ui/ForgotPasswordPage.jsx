'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Stack, Field, Heading, Text } from '@chakra-ui/react'

// Схема должна валидировать только email
import { forgotPasswordSchema } from '@/features/auth/model/forgot-password-schema'
import { useForgotPassword } from '@/features/auth/api/use-forgot-password'

export const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const { mutate, isPending } = useForgotPassword()

  const onSubmit = (data) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <Heading size="md">Восстановление доступа</Heading>

        {/* Поле Email */}
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email адрес</Field.Label>
          <Input {...register('email')} type="email" placeholder="ivanov@mail.ru" />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" colorPalette="blue" loading={isPending} width="full" mt={2}>
          Отправить ссылку
        </Button>
      </Stack>
    </form>
  )
}
