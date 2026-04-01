'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Stack, Field, Group, InputElement, IconButton } from '@chakra-ui/react'
import { registerSchema } from '@/features/auth/model/register-schema'
import { useRegister } from '@/features/auth/api/use-register'
import { useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => setShowPassword(!showPassword)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const {
    mutate,
    isPending,
    isError,
    reset: resetMutation,
    data,
    onSuccess,
    onError,
  } = useRegister()

  const handleInputChange = () => {
    if (isError || data) resetMutation()
  }

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess,
      onError,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {/* Поле Имя */}
        <Field.Root invalid={!!errors.name}>
          <Field.Label>Имя</Field.Label>
          <Input {...register('name', { onChange: handleInputChange })} placeholder="Введите имя" />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        {/* Поле Фамилия */}
        <Field.Root invalid={!!errors.surname}>
          <Field.Label>Фамилия</Field.Label>
          <Input
            {...register('surname', { onChange: handleInputChange })}
            placeholder="Введите фамилию"
          />
          <Field.ErrorText>{errors.surname?.message}</Field.ErrorText>
        </Field.Root>

        {/* Поле Email */}
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            {...register('email', { onChange: handleInputChange })}
            type="email"
            placeholder="example@mail.com"
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Пароль</Field.Label>
          <Group width="full">
            <Input
              {...register('password', { onChange: handleInputChange })}
              type={showPassword ? 'text' : 'password'}
              placeholder="******"
            />
            <InputElement placement="end" paddingEnd="2">
              <IconButton
                variant="ghost"
                size="sm"
                onClick={togglePassword}
                aria-label={showPassword ? 'Скрыть' : 'Показать'}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </IconButton>
            </InputElement>
          </Group>
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        {/* Поле Повтор пароля */}
        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label>Подтверждение пароля</Field.Label>
          <Group width="full">
            <Input
              {...register('confirmPassword', { onChange: handleInputChange })}
              type={showPassword ? 'text' : 'password'}
              placeholder="******"
            />
            <InputElement placement="end" paddingEnd="2">
              <IconButton
                variant="ghost"
                size="sm"
                onClick={togglePassword}
                aria-label={showPassword ? 'Скрыть' : 'Показать'}
              >
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </IconButton>
            </InputElement>
          </Group>
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
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
