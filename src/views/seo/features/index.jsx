import Link from 'next/link'

import { Box, Button, Container, Grid, Heading, Image, Stack, Text } from '@chakra-ui/react'

import { breadcrumb } from '@/lib/seo/schema/breadcrumb'
import { softwareApplication } from '@/lib/seo/schema/softwareApplication'
import { breadcrumbs } from '@/lib/seo/breadcrumbs'
import { createMetadata } from '@/lib/seo/createMetadata'
import { generateSchema } from '@/lib/seo/generateSchema'

import FeatureHero from '@/components/seo/features/FeatureHero'
import FeatureCTA from '@/components/seo/features/FeatureCTA'

import featuresContent from '@/lib/seo/content/features/index-page.js'

export function generateMetadata() {
  return createMetadata({
    title: featuresContent.seo.title,
    description: featuresContent.seo.description,
    pathname: '/features',
  })
}

export default function FeaturesPage() {
  const schema = generateSchema(
    softwareApplication(),
    breadcrumb(
      breadcrumbs({
        section: {
          label: 'Функции',
          href: '/features',
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

      <FeatureHero {...featuresContent.hero} />

      <Box bg="gray.50">
        <Container maxW="7xl" py={{ base: 16, md: 24 }}>
          <Stack spacing={24}>
            {featuresContent.features.map((feature, index) => {
              const reverse = index % 2 === 1

              return (
                <Grid
                  key={feature.slug}
                  templateColumns={{ base: '1fr', lg: '1fr 1fr' }}
                  gap={{ base: 10, lg: 16 }}
                  alignItems="center"
                >
                  <Box order={{ base: 2, lg: reverse ? 2 : 1 }}>
                    <Stack spacing={6} maxW="520px">
                      <Heading size="xl">{feature.hero.h1}</Heading>

                      <Text fontSize="lg" color="gray.600" lineHeight="1.9">
                        {feature.hero.subtitle}
                      </Text>

                      <Link href={`/features/${feature.slug}`}>
                        <Box display="inline-block">
                          <Button colorScheme="blue">Подробнее</Button>
                        </Box>
                      </Link>
                    </Stack>
                  </Box>

                  <Box
                    order={{ base: 1, lg: reverse ? 1 : 2 }}
                    bg="white"
                    rounded="3xl"
                    p={4}
                    shadow="2xl"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Image
                      src={feature.sections[0].image}
                      alt={feature.hero.h1}
                      w="100%"
                      rounded="2xl"
                    />
                  </Box>
                </Grid>
              )
            })}
          </Stack>
        </Container>
      </Box>

      <FeatureCTA {...featuresContent.cta} />
    </>
  )
}
