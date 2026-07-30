'use client'

import { Box, Card, Container, Grid, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import { FaCalendarAlt, FaClock, FaMoneyCheckAlt, FaUserCheck } from 'react-icons/fa'

const icons = {
  schedule: FaCalendarAlt,
  time: FaClock,
  employees: FaUserCheck,
  payroll: FaMoneyCheckAlt,
}

export function HomeAutomation({ title, description, items = [] }) {
  return (
    <Box bg="gray.50" py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <Stack gap={4} align="center" textAlign="center" mb={16}>
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
            xl: 'repeat(4, 1fr)',
          }}
          gap={6}
        >
          {items.map((item) => {
            const IconComponent = icons[item.icon]

            return (
              <Card.Root
                key={item.title}
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

                    <Heading size="md" lineHeight="1.3">
                      {item.title}
                    </Heading>

                    <Text color="gray.600" lineHeight="1.8">
                      {item.description}
                    </Text>
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
