import { Box, Button, Card, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

export default function UseCaseFeatures({ features }) {
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
            maxW="760px"
            fontSize={{
              base: '3xl',
              md: '4xl',
            }}
            lineHeight="1.2"
          >
            Какие возможности Uchop помогают решить эту задачу
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
            Автоматизация графиков строится сразу на нескольких возможностях системы. Вместе они
            позволяют полностью отказаться от ручного планирования.
          </Text>
        </Stack>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
          }}
          gap="6"
        >
          {features.map((feature) => (
            <Card.Root
              key={feature.slug}
              h="full"
              transition="all .2s"
              _hover={{
                shadow: 'md',
                borderColor: 'blue.300',
              }}
            >
              <Card.Body>
                <Stack align="start" gap="5" h="full">
                  <Heading size="md">{feature.hero.h1}</Heading>

                  <Text color="gray.600" lineHeight="1.8" flex="1">
                    {feature.hero.subtitle}
                  </Text>

                  <Button asChild variant="ghost" colorPalette="blue" px="0">
                    <NextLink href={`/features/${feature.slug}`}>Подробнее</NextLink>
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
