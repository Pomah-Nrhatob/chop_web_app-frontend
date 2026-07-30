'use client'

import { Badge, Box, Card, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { FaBolt, FaCloud, FaClock, FaMobileAlt, FaShieldAlt, FaUsers } from 'react-icons/fa'

const icons = {
  fast: FaBolt,
  devices: FaMobileAlt,
  time: FaClock,
  company: FaUsers,
  cloud: FaCloud,
  security: FaShieldAlt,
}

export function HomeBenefits({ title, description, items = [] }) {
  return (
    <Box bg="gray.50" py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <Stack gap={4} align="center" textAlign="center" mb={16}>
          <Badge colorPalette="blue" px={4} py={2} rounded="full">
            Преимущества
          </Badge>

          <Heading as="h2" fontSize={{ base: '3xl', md: '5xl' }}>
            {title}
          </Heading>

          <Text maxW="760px" color="gray.600" lineHeight="1.8" fontSize={{ base: 'md', md: 'lg' }}>
            {description}
          </Text>
        </Stack>

        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(3, 1fr)',
          }}
          gap={6}
        >
          {items.map((benefit) => {
            const IconComponent = icons[benefit.icon]

            return (
              <Card.Root
                key={benefit.title}
                h="100%"
                bg="white"
                borderColor="gray.200"
                transition="all .25s"
                _hover={{
                  shadow: 'xl',
                  borderColor: 'blue.200',
                  transform: 'translateY(-4px)',
                }}
              >
                <Card.Body p={8}>
                  <Stack gap={6}>
                    <HStack
                      w="60px"
                      h="60px"
                      rounded="2xl"
                      bg="blue.50"
                      color="blue.500"
                      justify="center"
                    >
                      {IconComponent && <IconComponent size={24} aria-hidden="true" />}
                    </HStack>

                    <Stack gap={3}>
                      <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="blue.500"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                      >
                        Почему выбирают
                      </Text>

                      <Heading size="md" lineHeight="1.3">
                        {benefit.title}
                      </Heading>

                      <Text color="gray.600" lineHeight="1.8">
                        {benefit.description}
                      </Text>
                    </Stack>
                  </Stack>
                </Card.Body>
              </Card.Root>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}
