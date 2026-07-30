'use client'

import NextLink from 'next/link'

import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import {
  FaArrowRight,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaMoneyCheckAlt,
  FaUsers,
} from 'react-icons/fa'

const icons = {
  company: FaBuilding,
  employees: FaUsers,
  schedule: FaCalendarAlt,
  monitoring: FaClock,
  payroll: FaMoneyCheckAlt,
}

export function HomeFeatures({
  title,
  description,
  items = [],
  itemButtonLabel = 'Подробнее',
  button,
}) {
  return (
    <Box bg="gray.50" py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <Stack gap={4} align="center" textAlign="center" mb={16}>
          <Badge colorPalette="blue" px={4} py={2} rounded="full">
            Возможности
          </Badge>

          <Heading as="h2" fontSize={{ base: '3xl', md: '4xl' }}>
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
          {items.map((feature) => {
            const IconComponent = icons[feature.icon]

            return (
              <Card.Root
                key={feature.href}
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
                  <Stack gap={6} h="100%">
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

                    <Stack gap={3} flex="1">
                      <Text
                        fontSize="xs"
                        fontWeight="600"
                        color="blue.500"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                      >
                        Возможность
                      </Text>

                      <Heading size="md" lineHeight="1.3">
                        {feature.title}
                      </Heading>

                      <Text color="gray.600" lineHeight="1.8">
                        {feature.description}
                      </Text>
                    </Stack>

                    <Button
                      variant="ghost"
                      colorPalette="blue"
                      justifyContent="flex-start"
                      alignSelf="flex-start"
                      rightIcon={<FaArrowRight />}
                      asChild
                    >
                      <NextLink href={feature.href}>{itemButtonLabel}</NextLink>
                    </Button>
                  </Stack>
                </Card.Body>
              </Card.Root>
            )
          })}
        </Grid>

        {button && (
          <Stack mt={12} align="center">
            <Button size="lg" colorPalette="blue" asChild>
              <NextLink href={button.href}>{button.label}</NextLink>
            </Button>
          </Stack>
        )}
      </Container>
    </Box>
  )
}
