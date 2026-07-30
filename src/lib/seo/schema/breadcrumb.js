import { siteConfig } from '../siteConfig'

export function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',

    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',

      position: index + 1,

      name: item.name,

      item: `${siteConfig.url}${item.href}`,
    })),
  }
}
