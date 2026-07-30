import { siteConfig } from '@/lib/seo/siteConfig'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/bc/',
        '/login',
        '/registration',
        '/forgot-password',
        '/reset-password',
        '/request-verify-email',
        '/api/',
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
