import { siteConfig } from '../siteConfig'

export function organization() {
  return {
    '@type': 'Organization',

    name: siteConfig.name,

    url: siteConfig.url,

    '@id': `${siteConfig.url}#organization`,
  }
}
