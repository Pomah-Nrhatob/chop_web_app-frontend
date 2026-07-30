import NextLink from 'next/link'

import { Box, Button, Card, Container, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'

import { solutions } from '@/lib/seo/content/solutions'

export default function SolutionRelated({ currentSlug }) {
  const relatedSolutions = Object.values(solutions).filter(
    (solution) => solution.slug !== currentSlug
  )

  if (!relatedSolutions.length) {
    return null
  }

  return (
    <Box as="section" bg="gray.50" borderBottomWidth="1px" borderColor="gray.200">
      <Container
        maxW="7xl"
        py={{
          base: 16,
          md: 24,
        }}
      >
        <Stack gap="12">
          <Stack align="center" textAlign="center" gap="4" maxW="3xl" mx="auto">
            <Heading
              as="h2"
              fontSize={{
                base: '3xl',
                md: '4xl',
              }}
            >
              Другие отраслевые решения
            </Heading>

            <Text
              maxW="720px"
              color="gray.600"
              fontSize={{
                base: 'md',
                md: 'lg',
              }}
            >
              Узнайте, как Uchop помогает компаниям из других отраслей автоматизировать управление
              сотрудниками, объектами и рабочими процессами.
            </Text>
          </Stack>

          <SimpleGrid
            columns={{
              base: 1,
              md: 2,
              lg: 3,
            }}
            gap="6"
          >
            {relatedSolutions.map((solution) => (
              <Card.Root key={solution.slug} variant="outline" h="100%">
                <Card.Body>
                  <Stack gap="5" h="100%" align="flex-start">
                    <Heading as="h3" size="md" lineHeight="1.4">
                      {solution.hero.h1}
                    </Heading>

                    <Text flex="1" color="gray.600" lineHeight="1.8">
                      {solution.hero.subtitle}
                    </Text>

                    <Button asChild variant="outline">
                      <NextLink href={`/solutions/${solution.slug}`}>Подробнее</NextLink>
                    </Button>
                  </Stack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  )
}
