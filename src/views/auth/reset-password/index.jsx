import { ResetPasswordPage } from './ui/ResetPasswordPage'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

export default function Page() {
  return (
    <Container maxW="md" py={12}>
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Восстановление</Heading>
          <Text color="fg.muted">Введите новый пароль</Text>
        </Box>

        <ResetPasswordPage />
      </VStack>
    </Container>
  )
}
