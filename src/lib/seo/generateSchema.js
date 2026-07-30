export function generateSchema(...schemas) {
  return {
    '@context': 'https://schema.org',

    '@graph': schemas.filter(Boolean),
  }
}
