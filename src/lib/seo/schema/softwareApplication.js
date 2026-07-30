import { siteConfig } from '../siteConfig'

export function softwareApplication() {
  return {
    '@type': 'SoftwareApplication',

    '@id': `${siteConfig.url}#software-application`,

    name: siteConfig.name,

    applicationCategory: 'BusinessApplication',

    operatingSystem: 'Web',

    url: siteConfig.url,

    offers: {
      '@type': 'Offer',

      price: '0',

      priceCurrency: 'RUB',
    },

    publisher: {
      '@id': `${siteConfig.url}#organization`,
    },
  }
}
