'use client'

import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function Error({ error, reset }) {
  console.error(error)

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={6}>
      <Container maxW="lg">
        <Stack gap={8} textAlign="center" align="center">
          <Text fontSize="7xl" fontWeight="black" color="red.500">
            ⚠️
          </Text>

          <Stack gap={4}>
            <Heading size="xl">Что-то пошло не так</Heading>

            <Text color="gray.600" lineHeight="1.8">
              Во время загрузки страницы произошла непредвиденная ошибка. Попробуйте повторить
              попытку или обновить страницу.
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
        </Stack>
      </Container>
    </Box>
  )
}
