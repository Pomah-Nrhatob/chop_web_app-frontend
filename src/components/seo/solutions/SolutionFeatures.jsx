import NextLink from 'next/link'

import { Box, Button, Container, Grid, Heading, Image, Stack, Text } from '@chakra-ui/react'

export default function SolutionFeatures({
  title = 'Используемые возможности Uchop',
  subtitle,
  features = [],
}) {
  if (!features.length) {
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
              {title}
            </Heading>

            {subtitle && (
              <Text
                maxW="720px"
                color="gray.600"
                fontSize={{
                  base: 'md',
                  md: 'lg',
                }}
              >
                {subtitle}
              </Text>
            )}
          </Stack>

          <Stack gap="24">
            {features.map((feature, index) => {
              const reverse = index % 2 === 1

              return (
                <Grid
                  key={feature.slug}
                  templateColumns={{
                    base: '1fr',
                    lg: '1fr 1fr',
                  }}
                  gap={{
                    base: 10,
                    lg: 16,
                  }}
                  alignItems="center"
                >
                  <Box order={{ base: 2, lg: reverse ? 2 : 1 }}>
                    <Stack gap="6" maxW="520px">
                      <Heading
                        as="h3"
                        fontSize={{
                          base: '2xl',
                          md: '3xl',
                        }}
                      >
                        {feature.hero.h1}
                      </Heading>

                      <Text
                        color="gray.600"
                        fontSize={{
                          base: 'md',
                          md: 'lg',
                        }}
                        lineHeight="1.8"
                      >
                        {feature.hero.subtitle}
                      </Text>

                      <Button asChild w="fit-content" size="lg">
                        <NextLink href={`/features/${feature.slug}`}>Подробнее</NextLink>
                      </Button>
                    </Stack>
                  </Box>

                  <Box
                    order={{ base: 1, lg: reverse ? 1 : 2 }}
                    bg="white"
                    rounded="3xl"
                    p="4"
                    shadow="xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Image
                      src={feature.sections[0].image}
                      alt={feature.hero.h1}
                      w="full"
                      rounded="2xl"
                    />
                  </Box>
                </Grid>
              )
            })}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
