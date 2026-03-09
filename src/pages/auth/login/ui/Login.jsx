'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Stack, Field, Flex } from '@chakra-ui/react' // Добавили Flex
import { Link as ChakraLink } from '@chakra-ui/react'
import NextLink from 'next/link'

import { loginSchema } from '@/features/auth/model/login-schema'
import { useAuth } from '@/features/auth/api/use-auth'

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const { mutate, isPending } = useAuth()

  const onSubmit = (data) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {/* Поле Email */}
        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input {...register('email')} type="email" placeholder="example@mail.com" />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        {/* Поле Пароль с ссылкой "Забыли пароль?" */}
        <Field.Root invalid={!!errors.password}>
          <Flex justify="space-between" align="baseline" mb={1} width="full">
            <Field.Label mb={0}>Пароль</Field.Label>
          </Flex>
          <Input {...register('password')} type="password" placeholder="******" />
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
