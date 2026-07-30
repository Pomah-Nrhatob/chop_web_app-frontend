import { createMetadata } from '@/lib/seo/createMetadata'
import { ResetPasswordPage } from './ui/ResetPasswordPage'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

export const metadata = createMetadata({
  title: 'Uchop | Восстановление пароля',
  description: 'Восстановление доступа к учетной записи Uchop.',
  noIndex: true,
})

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
