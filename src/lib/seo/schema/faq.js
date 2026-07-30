export function faq(items) {
  return {
    '@type': 'FAQPage',

    mainEntity: items.map((item) => ({
      '@type': 'Question',

      name: item.question,

      acceptedAnswer: {
        '@type': 'Answer',

        text: item.answer,
      },
    })),
  }
}
