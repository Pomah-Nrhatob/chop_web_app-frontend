'use client'

import { useResendVerify } from '@/features/auth/api/use-resend-verify'
import { resendVerifySchema } from '@/features/auth/model/resend-verify-schema'
import { Button, Field, Heading, Input, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

export default function VerifyEmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resendVerifySchema),
  })

  const { mutate, isPending, onSuccess } = useResendVerify()

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <Heading size="md">Повторная отправка письма подтверждения</Heading>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input {...register('email')} type="email" placeholder="ivanov@mail.ru" />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" colorPalette="blue" loading={isPending} width="full" mt={2}>
          Отправить письмо
        </Button>
      </Stack>
    </form>
  )
}
