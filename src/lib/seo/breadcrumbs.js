export function breadcrumbs({ section, slug, title }) {
  return [
    {
      name: 'Главная',
      href: '/',
    },

    {
      name: section.label,
      href: section.href,
    },

    {
      name: title,
      href: `${section.href}/${slug}`,
    },
  ]
}
