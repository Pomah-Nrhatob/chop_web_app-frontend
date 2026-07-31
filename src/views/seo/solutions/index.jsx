import Link from 'next/link'

import { Box, Button, Container, Flex, Grid, Heading, Image, Stack, Text } from '@chakra-ui/react'

import { breadcrumb } from '@/lib/seo/schema/breadcrumb'
import { softwareApplication } from '@/lib/seo/schema/softwareApplication'
import { breadcrumbs } from '@/lib/seo/breadcrumbs'
import { createMetadata } from '@/lib/seo/createMetadata'
import { generateSchema } from '@/lib/seo/generateSchema'

import SolutionHero from '@/components/seo/solutions/SolutionHero'
import SolutionCTA from '@/components/seo/solutions/SolutionCTA'

import solutionsContent from '@/lib/seo/content/solutions/index-page'
import { solutionIcons } from '@/lib/seo/content/solutions'

export function generateMetadata() {
  return createMetadata({
    title: solutionsContent.seo.title,
    description: solutionsContent.seo.description,
    pathname: '/solutions',
  })
}

export default function SolutionsPage() {
  const schema = generateSchema(
    softwareApplication(),
    breadcrumb(
      breadcrumbs({
        section: {
          label: 'Решения',
          href: '/solutions',
        },
      })
    )
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schema,
        }}
      />

      <SolutionHero {...solutionsContent.hero} />

      <Box bg="gray.50">
        <Container maxW="7xl" py={{ base: 16, md: 24 }}>
          <Stack gap={24}>
            {solutionsContent.solutions.map((solution, index) => {
              const reverse = index % 2 === 1
              const SolutionIcon = solutionIcons[solution.slug]

              return (
                <Grid
                  key={solution.slug}
                  templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                  gap={{ base: 10, lg: 16 }}
                  alignItems="center"
                >
                  <Box order={{ base: 2, lg: reverse ? 2 : 1 }}>
                    <Stack gap={6} maxW="520px">
                      <Heading size="xl">{solution.hero.h1}</Heading>

                      <Text fontSize="lg" color="gray.600" lineHeight="1.9">
                        {solution.hero.subtitle}
                      </Text>

                      <Button asChild alignSelf="flex-start">
                        <Link href={`/solutions/${solution.slug}`}>Подробнее</Link>
                      </Button>
                    </Stack>
                  </Box>

                  <Flex
                    order={{ base: 1, lg: reverse ? 1 : 2 }}
                    justify="center"
                    align="center"
                    minH={{ base: '160px', lg: '260px' }}
                  >
                    <Box
                      color="blue.500"
                      opacity={0.15}
                      fontSize={{
                        base: '110px',
                        md: '150px',
                      }}
                      lineHeight="1"
                    >
                      <SolutionIcon />
                    </Box>
                  </Flex>
                </Grid>
              )
            })}
          </Stack>
        </Container>
      </Box>

      <SolutionCTA {...solutionsContent.cta} />
    </>
  )
}
