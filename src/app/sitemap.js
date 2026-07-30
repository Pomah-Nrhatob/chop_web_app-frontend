import { siteConfig } from '@/lib/seo/siteConfig'
import { features } from '@/lib/seo/content/features'
import solutions from '@/lib/seo/content/solutions'

export default function sitemap() {
  const now = new Date()

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },

    {
      url: `${siteConfig.url}/features`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    {
      url: `${siteConfig.url}/solutions`,
      lastModified: now,
      changeFrequency: 'weekly',
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
  ]
}
