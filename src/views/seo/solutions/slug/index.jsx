import { notFound } from 'next/navigation'

import { createMetadata } from '@/lib/seo/createMetadata'
import { generateSchema } from '@/lib/seo/generateSchema'

import { breadcrumb } from '@/lib/seo/schema/breadcrumb'
import { faq } from '@/lib/seo/schema/faq'
import { softwareApplication } from '@/lib/seo/schema/softwareApplication'

import { breadcrumbs } from '@/lib/seo/breadcrumbs'

import { solutions } from '@/lib/seo/content/solutions'

import SolutionHero from '@/components/seo/solutions/SolutionHero'
import SolutionChallenges from '@/components/seo/solutions/SolutionChallenges'
import SolutionOverview from '@/components/seo/solutions/SolutionOverview'
import SolutionWorkflow from '@/components/seo/solutions/SolutionWorkflow'
import SolutionBenefits from '@/components/seo/solutions/SolutionBenefits'
import SolutionFaq from '@/components/seo/solutions/SolutionFaq'
import SolutionCTA from '@/components/seo/solutions/SolutionCTA'
import SolutionFeatures from '@/components/seo/solutions/SolutionFeatures'
import SolutionRelated from '@/components/seo/solutions/SolutionRelated'

import { features as allFeatures } from '@/lib/seo/content/features'

export function generateStaticParams() {
  return Object.values(solutions).map((solution) => ({
    slug: solution.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params

  const solution = solutions[slug]

  if (!solution) {
    return {}
  }

  return createMetadata({
    title: solution.seo.title,
    description: solution.seo.description,
    pathname: `/solutions/${solution.slug}`,
  })
}

export default async function OneSolutionPage({ params }) {
  const { slug } = await params

  const solution = solutions[slug]

  const featureItems = solution.features.map((slug) => allFeatures[slug])

  if (!solution) {
    notFound()
  }

  const schema = generateSchema(
    softwareApplication(),
    breadcrumb(
      breadcrumbs({
        section: {
          label: 'Решения',
          href: '/solutions',
        },
        slug: solution.slug,
        title: solution.hero.h1,
      })
    ),
    faq(solution.faq)
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
        }}
      />

      <SolutionHero {...solution.hero} />

      <SolutionChallenges {...solution.challenges} />

      <SolutionOverview {...solution.overview} />

      <SolutionFeatures features={featureItems} />

      <SolutionWorkflow {...solution.workflow} />

      <SolutionBenefits {...solution.benefits} />

      <SolutionFaq items={solution.faq} />

      <SolutionRelated currentSlug={solution.slug} />

      <SolutionCTA {...solution.cta} />
    </>
  )
}
