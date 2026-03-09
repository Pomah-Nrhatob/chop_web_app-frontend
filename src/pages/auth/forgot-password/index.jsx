import { ForgotPasswordPage } from './ui/ForgotPasswordPage'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

export default function Page() {
  return (
    <Container maxW="md" py={12}>
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Восстановление</Heading>
          <Text color="fg.muted">Введите email для сброса пароля</Text>
        </Box>

        {/* Сама форма с инпутом и кнопкой */}
        <ForgotPasswordPage />

        <Text fontSize="sm" textAlign="center" color="fg.muted">
          Вспомнили пароль?{' '}
          <a href="/login" style={{ color: 'blue' }}>
            Войти
          </a>
        </Text>
      </VStack>
    </Container>
  )
}
