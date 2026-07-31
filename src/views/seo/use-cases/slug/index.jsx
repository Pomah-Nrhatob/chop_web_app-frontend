import { notFound } from 'next/navigation'

import { createMetadata } from '@/lib/seo/createMetadata'
import { generateSchema } from '@/lib/seo/generateSchema'

import { breadcrumb } from '@/lib/seo/schema/breadcrumb'
import { faq } from '@/lib/seo/schema/faq'
import { softwareApplication } from '@/lib/seo/schema/softwareApplication'

import { breadcrumbs } from '@/lib/seo/breadcrumbs'

import { useCases } from '@/lib/seo/content/use-cases'
import { features as allFeatures } from '@/lib/seo/content/features'

import UseCaseHero from '@/components/seo/use-cases/UseCaseHero'
import UseCaseWorkflow from '@/components/seo/use-cases/UseCaseWorkflow'
import UseCaseBenefits from '@/components/seo/use-cases/UseCaseBenefits'
import UseCaseFeatures from '@/components/seo/use-cases/UseCaseFeatures'
import UseCaseRelated from '@/components/seo/use-cases/UseCaseRelated'
import UseCaseFaq from '@/components/seo/use-cases/UseCaseFaq'
import UseCaseCTA from '@/components/seo/use-cases/UseCaseCTA'
import UseCaseProblems from '@/components/seo/use-cases/UseCaseProblems'

export function generateStaticParams() {
  return Object.values(useCases).map((useCase) => ({
    slug: useCase.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params

  const useCase = useCases[slug]

  if (!useCase) {
    return {}
  }

  return createMetadata({
    title: useCase.seo.title,
    description: useCase.seo.description,
    pathname: `/use-cases/${useCase.slug}`,
  })
}

export default async function OneUseCasePage({ params }) {
  const { slug } = await params

  const useCase = useCases[slug]

  if (!useCase) {
    notFound()
  }

  const featureItems = useCase.features.map((slug) => allFeatures[slug])

  const schema = generateSchema(
    softwareApplication(),
    breadcrumb(
      breadcrumbs({
        section: {
          label: 'Сценарии использования',
          href: '/use-cases',
        },
        slug: useCase.slug,
        title: useCase.hero.h1,
      })
    ),
    faq(useCase.faq)
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schema,
        }}
      />

      <UseCaseHero {...useCase.hero} />

      <UseCaseProblems {...useCase.problems} />

      <UseCaseWorkflow {...useCase.workflow} />

      <UseCaseFeatures features={featureItems} />

      <UseCaseBenefits {...useCase.benefits} />

      <UseCaseFaq items={useCase.faq} />

      <UseCaseRelated currentSlug={useCase.slug} />

      <UseCaseCTA {...useCase.cta} />
    </>
  )
}
