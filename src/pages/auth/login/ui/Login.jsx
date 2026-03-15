'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Stack, Field, Group, InputElement, IconButton } from '@chakra-ui/react'
import { Link as ChakraLink } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'
import { loginSchema } from '@/features/auth/model/login-schema'
import { useAuth } from '@/features/auth/api/use-auth'

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const togglePassword = () => setShowPassword(!showPassword)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const { mutate, isPending, isError, reset, onSuccess, onError } = useAuth()

  const handleInputChange = () => {
    if (isError) reset()
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

        {/* Поле Пароль с ссылкой "Забыли пароль?" */}
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
          <ChakraLink
            as={NextLink}
            href="/forgot-password"
            fontSize="xs"
            color="blue.500"
            _hover={{ textDecoration: 'underline' }}
          >
            Забыли пароль?
          </ChakraLink>
        </Field.Root>

        <Button type="submit" colorPalette="blue" loading={isPending} width="full" mt={2}>
          Войти
        </Button>
      </Stack>
    </form>
  )
}
