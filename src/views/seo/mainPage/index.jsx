import { HomeAutomation } from '@/components/seo/mainPage/HomeAutomation'
import { HomeBenefits } from '@/components/seo/mainPage/HomeBenefits'
import { HomeCTA } from '@/components/seo/mainPage/HomeCTA'
import { HomeFaq } from '@/components/seo/mainPage/HomeFaq'
import { HomeFeatures } from '@/components/seo/mainPage/HomeFeatures'
import { HomeHero } from '@/components/seo/mainPage/HomeHero'
import { HomeSolutions } from '@/components/seo/mainPage/HomeSolutions'
import { HomeWorkflow } from '@/components/seo/mainPage/HomeWorkflow'

import home from '@/lib/seo/content/mainPage'

import { createMetadata } from '@/lib/seo/createMetadata'
import { generateSchema } from '@/lib/seo/generateSchema'
import { organization } from '@/lib/seo/schema/organization'
import { softwareApplication } from '@/lib/seo/schema/softwareApplication'
import { website } from '@/lib/seo/schema/website'

export function generateMetadata() {
  return createMetadata({
    title: home.seo.title,
    description: home.seo.description,
    pathname: '/',
  })
}

export default function HomePage() {
  const schema = generateSchema(organization(), website(), softwareApplication())

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schema,
        }}
      />

      <HomeHero {...home.hero} />

      <HomeAutomation {...home.automation} />

      <HomeWorkflow {...home.workflow} />

      <HomeFeatures {...home.features} />

      <HomeSolutions {...home.solutions} />

      <HomeBenefits {...home.benefits} />

      <HomeFaq {...home.faq} />

      <HomeCTA {...home.cta} />
    </>
  )
}
