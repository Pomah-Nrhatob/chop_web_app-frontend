import { siteConfig } from './siteConfig'

export function openGraph({ title, description, pathname, image }) {
  return {
    title,

    description,

    url: `${siteConfig.url}${pathname}`,

    siteName: siteConfig.name,

    locale: siteConfig.locale,

    type: 'website',

    images: [
      {
        url: image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.defaultOgImage}`,
      },
    ],
  }
}
