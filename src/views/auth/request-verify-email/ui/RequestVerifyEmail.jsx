import VerifyEmailForm from '@/views/auth/request-verify-email/ui/VerifyEmailForm'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

export default function RequestVerifyEmail() {
  return (
    <Container maxW="md" py={12}>
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Подтверждение почты</Heading>
          <Text color="fg.muted">Введите почту для повторной отправки подтверждения</Text>
        </Box>

        <VerifyEmailForm />
      </VStack>
    </Container>
  )
}
