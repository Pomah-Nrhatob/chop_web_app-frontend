import { siteConfig } from '../siteConfig'

export function website() {
  return {
    '@type': 'WebSite',
    '@id': `${siteConfig.url}#website`,

    name: siteConfig.name,

    url: siteConfig.url,

    publisher: {
      '@id': `${siteConfig.url}#organization`,
    },
  }
}
