import Link from 'next/link'

import { Box, Button, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react'

import { features } from '@/lib/seo/content/features'

export default function FeatureRelatedFeatures({ currentSlug }) {
  const items = Object.values(features).filter((feature) => feature.slug !== currentSlug)

  return (
    <Box py={{ base: 16, md: 24 }} bg="gray.50">
      <Container maxW="7xl">
        <Stack spacing={12}>
          <Stack spacing={4} textAlign="center">
            <Heading size="xl">Какие еще возможности есть в Uchop</Heading>

            <Text color="gray.600" maxW="720px" mx="auto">
              Uchop объединяет все инструменты для управления сотрудниками, рабочими объектами и
              сменами в одной системе. Ознакомьтесь с другими возможностями платформы.
            </Text>
          </Stack>

          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2,1fr)',
            }}
            gap={6}
          >
            {items.map((feature) => (
              <Box
                key={feature.slug}
                bg="white"
                borderWidth="1px"
                borderColor="gray.200"
                rounded="2xl"
                p={8}
              >
                <Stack spacing={5}>
                  <Heading size="md">{feature.hero.h1}</Heading>

                  <Text color="gray.600" noOfLines={3}>
                    {feature.hero.subtitle}
                  </Text>

                  <Link href={`/features/${feature.slug}`}>
                    <Button variant="ghost" colorScheme="blue">
                      Подробнее →
                    </Button>
                  </Link>
                </Stack>
              </Box>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}
