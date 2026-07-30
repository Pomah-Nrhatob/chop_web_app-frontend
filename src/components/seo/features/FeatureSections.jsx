import NextImage from 'next/image'

import { Box, Container, Grid, GridItem, Heading, Stack, Text } from '@chakra-ui/react'

export default function FeatureSections({ sections = [] }) {
  if (!sections.length) {
    return null
  }

  return (
    <Box as="section" bg="white" borderBottomWidth="1px" borderColor="gray.200">
      <Container
        maxW="6xl"
        py={{
          base: 16,
          md: 24,
        }}
      >
        <Stack
          gap={{
            base: 20,
            md: 28,
          }}
        >
          {sections.map((section) => {
            const reverse = section.imagePosition === 'left'

            return (
              <Grid
                key={section.title}
                templateColumns={{
                  base: '1fr',
                  lg: 'repeat(2, 1fr)',
                }}
                gap={{
                  base: 10,
                  lg: 16,
                }}
                alignItems="center"
              >
                <GridItem order={{ base: 2, lg: reverse ? 2 : 1 }}>
                  <Stack gap="6">
                    <Heading
                      fontSize={{
                        base: '2xl',
                        md: '3xl',
                      }}
                      lineHeight="1.2"
                      color="gray.900"
                    >
                      {section.title}
                    </Heading>

                    <Text
                      color="gray.600"
                      fontSize={{
                        base: 'md',
                        md: 'lg',
                      }}
                      lineHeight="1.9"
                    >
                      {section.description}
                    </Text>
                  </Stack>
                </GridItem>

                <GridItem order={{ base: 1, lg: reverse ? 1 : 2 }}>
                  <Box
                    overflow="hidden"
                    rounded="2xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                    shadow="lg"
                  >
                    <NextImage
                      src={section.image}
                      alt={section.imageAlt}
                      width={1400}
                      height={900}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </Box>
                </GridItem>
              </Grid>
            )
          })}
        </Stack>
      </Container>
    </Box>
  )
}
