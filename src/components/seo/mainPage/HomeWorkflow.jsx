import NextLink from 'next/link'

import { Badge, Box, Button, Card, Container, Grid, Heading, Stack, Text } from '@chakra-ui/react'

export function HomeWorkflow({ badge, title, description, steps = [], button }) {
  return (
    <Box bg="white" py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <Stack gap={4} align="center" textAlign="center" mb={16}>
          {badge && (
            <Badge colorPalette="blue" px={4} py={2} rounded="full">
              {badge}
            </Badge>
          )}

          <Heading as="h2" fontSize={{ base: '3xl', md: '5xl' }}>
            {title}
          </Heading>

          <Text maxW="720px" color="gray.600" lineHeight="1.8" fontSize={{ base: 'md', md: 'lg' }}>
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
          {steps.map((step, index) => (
            <Box key={step.number} position="relative">
              {index < steps.length - 1 && (
                <Box
                  display={{ base: 'none', xl: 'block' }}
                  position="absolute"
                  top="28px"
                  left="calc(100% - 12px)"
                  w="24px"
                  h="2px"
                  bg="gray.200"
                  zIndex={0}
                />
              )}

              <Card.Root
                h="100%"
                position="relative"
                zIndex={1}
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
                    <Box
                      w="56px"
                      h="56px"
                      rounded="full"
                      bg="blue.500"
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="lg"
                    >
                      {step.number}
                    </Box>

                    <Heading size="md" lineHeight="1.3">
                      {step.title}
                    </Heading>

                    <Text color="gray.600" lineHeight="1.8">
                      {step.description}
                    </Text>
                  </Stack>
                </Card.Body>
              </Card.Root>
            </Box>
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
