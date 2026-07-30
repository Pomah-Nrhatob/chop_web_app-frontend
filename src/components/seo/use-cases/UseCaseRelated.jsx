import NextLink from 'next/link'

import { Box, Button, Card, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react'

import { useCases } from '@/lib/seo/content/use-cases'

export default function UseCaseRelated({ currentSlug }) {
  const items = Object.values(useCases).filter((item) => item.slug !== currentSlug)

  if (!items.length) {
    return null
  }

  return (
    <Box
      as="section"
      py={{
        base: 16,
        md: 24,
      }}
      bg="gray.50"
    >
      <Container maxW="7xl">
        <Stack
          align="center"
          textAlign="center"
          gap="4"
          mb={{
            base: 10,
            md: 14,
          }}
        >
          <Heading
            fontSize={{
              base: '3xl',
              md: '4xl',
            }}
          >
            Другие сценарии использования
          </Heading>

          <Text
            maxW="700px"
            color="gray.600"
            lineHeight="1.8"
            fontSize={{
              base: 'md',
              md: 'lg',
            }}
          >
            Узнайте, какие еще задачи можно автоматизировать с помощью Uchop.
          </Text>
        </Stack>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(3, 1fr)',
          }}
          gap="6"
        >
          {items.map((item) => (
            <Card.Root
              key={item.slug}
              h="full"
              transition="all .2s"
              _hover={{
                shadow: 'md',
                borderColor: 'blue.300',
              }}
            >
              <Card.Body>
                <Stack gap="5" h="full" align="start">
                  <Heading size="md" lineHeight="1.3">
                    {item.hero.h1}
                  </Heading>

                  <Text color="gray.600" lineHeight="1.8" flex="1">
                    {item.hero.subtitle}
                  </Text>

                  <Button asChild variant="ghost" colorPalette="blue" px="0">
                    <NextLink href={`/use-cases/${item.slug}`}>Подробнее</NextLink>
                  </Button>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
