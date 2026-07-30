import allSolutions from './index'

export default {
  seo: {
    title: 'Отраслевые решения для управления персоналом | Uchop',
    description:
      'Uchop помогает компаниям из разных отраслей автоматизировать управление сотрудниками, графиками смен, рабочим временем и заработной платой.',
  },

  hero: {
    eyebrow: 'Отраслевые решения',
    h1: 'Uchop подходит для бизнеса в разных сферах',
    subtitle:
      'Используйте Uchop для управления сотрудниками, объектами, графиками работы и учетом рабочего времени независимо от отрасли.',
    primaryAction: {
      label: 'Попробовать бесплатно',
      href: '/registration',
    },
    secondaryAction: {
      label: 'Все функции',
      href: '/features',
    },
  },

  solutions: Object.values(allSolutions),

  cta: {
    title: 'Автоматизируйте управление персоналом',
    description:
      'Попробуйте Uchop бесплатно и управляйте сотрудниками, графиками работы и рабочим временем в одной системе.',
    primaryAction: {
      label: 'Начать бесплатно',
      href: '/registration',
    },
    secondaryAction: {
      label: 'Связаться с нами',
      href: '/contacts',
    },
  },
}
