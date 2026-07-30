export function generateSchema(...schemas) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas.filter(Boolean),
  })
}
