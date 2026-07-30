import { notFound } from 'next/navigation'

// import FeatureSection from '@/components/features/FeatureSection';
// import FeatureFaq from '@/components/features/FeatureFaq';
// import FeatureCTA from '@/components/features/FeatureCTA';

import { breadcrumb } from '@/lib/seo/schema/breadcrumb'
import { faq } from '@/lib/seo/schema/faq'
import { softwareApplication } from '@/lib/seo/schema/softwareApplication'

import { generateSchema } from '@/lib/seo/generateSchema'
import FeatureHero from '@/components/seo/features/FeatureHero'
import { features } from '@/lib/seo/content/features'
import { createMetadata } from '@/lib/seo/createMetadata'
import { breadcrumbs } from '@/lib/seo/breadcrumbs'
import FeatureBenefits from '@/components/seo/features/FeatureBenefits'
import FeatureSections from '@/components/seo/features/FeatureSections'
import FeatureFaq from '@/components/seo/features/FeatureFaq'
import FeatureCTA from '@/components/seo/features/FeatureCTA'
import FeatureRelatedFeatures from '@/components/seo/features/FeatureRelatedFeatures'

export function generateStaticParams() {
  return Object.values(features).map((feature) => ({
    slug: feature.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const feature = features[slug]

  if (!feature) {
    return {}
  }

  return createMetadata({
    title: feature.seo.title,
    description: feature.seo.description,
    pathname: `/features/${feature.slug}`,
  })
}

export default async function OneFeaturePage({ params }) {
  const { slug } = await params
  const feature = features[slug]

  if (!feature) {
    notFound()
  }

  const schema = generateSchema(
    softwareApplication(),
    breadcrumb(
      breadcrumbs({
        section: {
          label: 'Функции',
          href: '/features',
        },
        slug: feature.slug,
        title: feature.hero.h1,
      })
    ),
    faq(feature.faq)
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <FeatureHero {...feature.hero} />

      <FeatureBenefits {...feature.benefits} />

      <FeatureSections sections={feature.sections} />

      <FeatureFaq items={feature.faq} />

      <FeatureRelatedFeatures currentSlug={feature.slug} />

      <FeatureCTA {...feature.cta} />
    </>
  )
}
