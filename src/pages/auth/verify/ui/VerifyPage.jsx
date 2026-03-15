'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema } from '@/features/auth/model/forgot-password-schema'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  Spinner,
  Text,
  Center,
  VStack,
  Button,
  Input,
  Field,
  Stack,
  Heading,
} from '@chakra-ui/react'
import { useVerify } from '@/features/auth/api/use-verify'
import { useResendVerify } from '@/features/auth/api/use-resend-verify'

export const VerifyPage = () => {
  const params = useParams()
  const token = params?.token
  const [showResend, setShowResend] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const {
    mutate: verify,
    isPending: isVerifying,
    isError,
    onSuccess: onSuccessVerify,
    onError: onErrorVerify,
  } = useVerify()
  const {
    mutate: resend,
    isPending: isResending,
    onSuccess: onSuccessResend,
    onError: onErrorResend,
  } = useResendVerify()

  const called = useRef(false)

  useEffect(() => {
    if (token && !called.current) {
      verify(token, {
        onSuccessVerify,
        onErrorVerify,
      })
      called.current = true
    }
  }, [token, verify])

  const onSubmit = (data) => {
    resend(data, {
      onSuccessResend,
      onErrorResend,
    })
  }

  return (
    <Center minH="100vh">
      <VStack gap={6} w="full" maxW="md" p={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Верификация аккаунта
        </Text>

        {isVerifying && (
          <>
            <Spinner color="blue.500" size="xl" />
            <Text>Проверяем ваш токен...</Text>
          </>
        )}

        {isError && !showResend && (
          <VStack gap={4}>
            <Text color="red.500">Токен недействителен или просрочен.</Text>
            <Button colorPalette="blue" onClick={() => setShowResend(true)}>
              Запросить новое письмо
            </Button>
          </VStack>
        )}

        {showResend && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={4}>
              <Heading size="md">Введите email</Heading>
              <Field.Root invalid={!!errors.email}>
                <Field.Label>Email адрес</Field.Label>
                <Input {...register('email')} type="email" placeholder="ivanov@mail.ru" />
                <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
              </Field.Root>

              <Button type="submit" colorPalette="blue" loading={isResending} width="full" mt={2}>
                Отправить ссылку
              </Button>
            </Stack>
          </form>
        )}
      </VStack>
    </Center>
  )
}
