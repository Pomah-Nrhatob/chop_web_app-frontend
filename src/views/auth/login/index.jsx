import { createMetadata } from '@/lib/seo/createMetadata'
import { LoginForm } from '@/views/auth/login/ui/Login'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

export const metadata = createMetadata({
  title: 'Uchop | Вход',
  description: 'Войдите в личный кабинет Uchop.',
  noIndex: true,
})

export default function LoginPage() {
  return (
    <Container maxW="md" py={12}>
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Авторизация</Heading>
          <Text color="fg.muted">Войдите в систему</Text>
        </Box>

        <LoginForm />

        <Text fontSize="sm" textAlign="center" color="fg.muted">
          Нет аккаунта?{' '}
          <Link href="/registration" style={{ color: 'blue' }}>
            Зарегистрироваться
          </Link>
        </Text>
        <Text fontSize="sm" textAlign="center" color="fg.muted">
          Не подтвердили почту?{' '}
          <Link href="/request-verify-email" style={{ color: 'blue' }}>
            Отправить письмо подтверждения повторно
          </Link>
        </Text>
      </VStack>
    </Container>
  )
}
