import { siteConfig } from '@/lib/seo/siteConfig'
import { features } from '@/lib/seo/content/features'
import solutions from '@/lib/seo/content/solutions'
import { useCases } from '@/lib/seo/content/use-cases'

export default function sitemap() {
  const now = new Date()

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },

    {
      url: `${siteConfig.url}/features`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    {
      url: `${siteConfig.url}/solutions`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    {
      url: `${siteConfig.url}/use-cases`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    ...Object.values(features).map((feature) => ({
      url: `${siteConfig.url}/features/${feature.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),

    ...Object.values(solutions).map((solution) => ({
      url: `${siteConfig.url}/solutions/${solution.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),

    ...Object.values(useCases).map((useCase) => ({
      url: `${siteConfig.url}/use-cases/${useCase.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),

    {
      url: `${siteConfig.url}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${siteConfig.url}/cookie-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
