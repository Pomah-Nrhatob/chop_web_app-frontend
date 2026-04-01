'use client'

import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Stack, Field, Heading } from '@chakra-ui/react'
import { resetPasswordSchema } from '@/features/auth/model/reset-password-schema'
import { useResetPassword } from '@/features/auth/api/use-reset-password'

export const ResetPasswordPage = () => {
  const params = useParams()
  const token = params?.token

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const { mutate, isPending, onSuccess, onError } = useResetPassword()

  const onSubmit = (data) => {
    mutate(
      {
        newPassword: data.password,
        token,
      },
      onSuccess,
      onError
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {/* Поле Новый пароль */}
        <Field.Root invalid={!!errors.password}>
          <Field.Label>Новый пароль</Field.Label>
          <Input {...register('password')} type="password" placeholder="******" />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        {/* Поле Подтверждение */}
        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label>Повторите пароль</Field.Label>
          <Input {...register('confirmPassword')} type="password" placeholder="******" />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" colorPalette="blue" loading={isPending} width="full" mt={2}>
          Обновить пароль
        </Button>
      </Stack>
    </form>
  )
}
