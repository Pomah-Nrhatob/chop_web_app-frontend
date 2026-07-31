import NextLink from 'next/link'
import { Box, Button, Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function NotFound() {
  return (
    <Box
      as="main"
      minH="calc(100vh - 80px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={{ base: 16, md: 24 }}
    >
      <Container maxW="2xl">
        <Stack gap={8} align="center" textAlign="center">
          <Heading position="absolute" inset={0} fontSize="160px" opacity={0.05} userSelect="none">
            404
          </Heading>

          <Stack gap={4}>
            <Heading size="2xl" lineHeight="1.2">
              Страница не найдена
            </Heading>

            <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.8">
              Возможно, страница была удалена, перемещена или вы перешли по неверной ссылке.
            </Text>
          </Stack>

          <Stack direction={{ base: 'column', sm: 'row' }} gap={4}>
            <Button size="lg" asChild>
              <NextLink href="/">На главную</NextLink>
            </Button>

            <Button variant="outline" size="lg" asChild>
              <NextLink href="/features">Возможности</NextLink>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
