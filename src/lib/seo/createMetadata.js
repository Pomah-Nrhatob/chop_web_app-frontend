import { siteConfig } from './siteConfig'
import { openGraph } from './openGraph'

export function createMetadata({ title, description, pathname, image, noIndex = false }) {
  return {
    title: title ?? siteConfig.defaultTitle,

    description: description ?? siteConfig.defaultDescription,

    alternates: {
      canonical: `${siteConfig.url}${pathname}`,
    },

    openGraph: openGraph({
      title,
      description,
      pathname,
      image,
    }),

    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  }
}
