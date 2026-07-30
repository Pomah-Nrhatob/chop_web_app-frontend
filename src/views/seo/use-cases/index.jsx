import Link from 'next/link'

import { Box, Button, Container, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'

import { breadcrumb } from '@/lib/seo/schema/breadcrumb'
import { softwareApplication } from '@/lib/seo/schema/softwareApplication'
import { breadcrumbs } from '@/lib/seo/breadcrumbs'
import { createMetadata } from '@/lib/seo/createMetadata'
import { generateSchema } from '@/lib/seo/generateSchema'

import UseCaseHero from '@/components/seo/use-cases/UseCaseHero'
import UseCaseCTA from '@/components/seo/use-cases/UseCaseCTA'

import useCasesContent from '@/lib/seo/content/use-cases/index-page'
import { useCases, useCaseIcons } from '@/lib/seo/content/use-cases'

export function generateMetadata() {
  return createMetadata({
    title: useCasesContent.seo.title,
    description: useCasesContent.seo.description,
    pathname: '/use-cases',
  })
}

export default function UseCasesPage() {
  const schema = generateSchema(
    softwareApplication(),
    breadcrumb(
      breadcrumbs({
        section: {
          label: 'Сценарии использования',
          href: '/use-cases',
        },
      })
    )
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <UseCaseHero {...useCasesContent.hero} />

      <Box bg="gray.50">
        <Container
          maxW="7xl"
          py={{
            base: 16,
            md: 24,
          }}
        >
          <Stack gap={24}>
            {Object.values(useCases).map((useCase, index) => {
              const reverse = index % 2 === 1
              const UseCaseIcon = useCaseIcons[useCase.slug]

              return (
                <Grid
                  key={useCase.slug}
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
                  <Box
                    order={{
                      base: 2,
                      lg: reverse ? 2 : 1,
                    }}
                  >
                    <Stack gap={6} maxW="520px">
                      <Heading size="xl">{useCase.hero.h1}</Heading>

                      <Text fontSize="lg" color="gray.600" lineHeight="1.9">
                        {useCase.hero.subtitle}
                      </Text>

                      <Button asChild alignSelf="flex-start">
                        <Link href={`/use-cases/${useCase.slug}`}>Подробнее</Link>
                      </Button>
                    </Stack>
                  </Box>

                  <Flex
                    order={{
                      base: 1,
                      lg: reverse ? 1 : 2,
                    }}
                    justify="center"
                    align="center"
                    minH={{
                      base: '160px',
                      lg: '260px',
                    }}
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
                      <UseCaseIcon />
                    </Box>
                  </Flex>
                </Grid>
              )
            })}
          </Stack>
        </Container>
      </Box>

      <UseCaseCTA {...useCasesContent.cta} />
    </>
  )
}
