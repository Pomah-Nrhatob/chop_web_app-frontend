'use client'

import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function Error({ error, reset }) {
  console.error(error)

  return (
    <Container maxW="lg" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Stack gap={8} align="center" textAlign="center" w="full">
        <Stack gap={3}>
          <Heading
            fontSize={{ base: '5xl', md: '7xl' }}
            lineHeight="1"
            color="gray.300"
            fontWeight="black"
          >
            500
          </Heading>

          <Heading size="xl">Произошла ошибка</Heading>

          <Text color="gray.600" lineHeight="1.8" maxW="420px">
            Во время выполнения операции произошла непредвиденная ошибка. Попробуйте повторить
            действие или обновить страницу.
          </Text>
        </Stack>

        <Stack direction={{ base: 'column', sm: 'row' }} gap={4}>
          <Button colorPalette="blue" onClick={reset}>
            Попробовать снова
          </Button>

          <Button variant="outline" onClick={() => window.location.reload()}>
            Обновить страницу
          </Button>
        </Stack>

        {process.env.NODE_ENV === 'development' && (
          <Text fontSize="sm" color="red.500" maxW="full" whiteSpace="pre-wrap">
            {error.message}
          </Text>
        )}
      </Stack>
    </Container>
  )
}
