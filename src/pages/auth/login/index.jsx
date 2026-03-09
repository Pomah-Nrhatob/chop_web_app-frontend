import { LoginForm } from '@/pages/auth/login/ui/Login'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

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
          <a href="/registration" style={{ color: 'blue' }}>
            Зарегистрироваться
          </a>
        </Text>
      </VStack>
    </Container>
  )
}
