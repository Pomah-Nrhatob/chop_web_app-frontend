'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Stack, Field, Text } from '@chakra-ui/react' // Chakra 3.x
import { registerSchema } from '@/features/auth/model/register-schema'
import { useRegister } from '@/features/auth/api/use-register'

export const RegisterForm = () => {
  // 1. Инициализация формы с Zod-валидацией
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  // 2. Хук для запроса к NestJS
  const { mutate, isPending } = useRegister()

  // 3. Отправка данных
  const onSubmit = (data) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {/* Поле Имя */}
        <Field.Root invalid={!!errors.name}>
          <Field.Label>Имя</Field.Label>
          <Input {...register('name')} placeholder="Введите имя" />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        {/* Поле Фамилия */}
        <Field.Root invalid={!!errors.surname}>
          <Field.Label>Фамилия</Field.Label>
          <Input {...register('surname')} placeholder="Введите фамилию" />
          <Field.ErrorText>{errors.surname?.message}</Field.ErrorText>
        </Field.Root>

        {/* Поле Email */}
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input {...register('email')} type="email" placeholder="example@mail.com" />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        {/* Поле Пароль */}
        <Field.Root invalid={!!errors.password}>
          <Field.Label>Пароль</Field.Label>
          <Input {...register('password')} type="password" placeholder="******" />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          colorPalette="blue"
          loading={isPending} // Chakra автоматически задизейблит кнопку
          width="full"
          mt={4}
        >
          Зарегистрироваться
        </Button>
      </Stack>
    </form>
  )
}
