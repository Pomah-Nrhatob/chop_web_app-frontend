import NextLink from 'next/link'

import { Badge, Box, Button, Card, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react'

export function HomeSolutions({
  title,
  description,
  items = [],
  itemButtonLabel = 'Подробнее',
  button,
}) {
  return (
    <Box bg="white" py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <Stack gap={4} align="center" textAlign="center" mb={16}>
          <Badge colorPalette="blue" px={4} py={2} rounded="full">
            Решения
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
          {items.map((solution) => (
            <Card.Root
              key={solution.href}
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
                  <Stack gap={3} flex="1">
                    <Heading size="md" lineHeight="1.3">
                      {solution.title}
                    </Heading>

                    <Text color="gray.600" lineHeight="1.8">
                      {solution.description}
                    </Text>
                  </Stack>

                  <Button
                    variant="ghost"
                    colorPalette="blue"
                    justifyContent="flex-start"
                    alignSelf="flex-start"
                    asChild
                  >
                    <NextLink href={solution.href}>{itemButtonLabel} →</NextLink>
                  </Button>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
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
