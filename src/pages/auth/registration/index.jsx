import { RegisterForm } from '@/pages/auth/registration/ui/Registration'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

export default function RegistrationPage() {
  return (
    <Container maxW="md" py={12}>
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Регистрация</Heading>
          <Text color="fg.muted">Создайте аккаунт для доступа к системе</Text>
        </Box>

        {/* Наша умная форма из features */}
        <RegisterForm />

        <Text fontSize="sm" textAlign="center" color="fg.muted">
          Уже есть аккаунт?{' '}
          <a href="/login" style={{ color: 'blue' }}>
            Войти
          </a>
        </Text>
      </VStack>
    </Container>
  )
}
