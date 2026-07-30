import { createMetadata } from '@/lib/seo/createMetadata'
import Footer from '@/widgets/footer/Footer'
import { Header } from '@/widgets/header'

export const metadata = createMetadata({
  title: 'Uchop | Мой профиль',
  description: 'Личный кабинет Uchop для управления профилем.',
  pathname: '/profile',
  noIndex: true,
})

export default function SeoLayout({ children }) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  )
}
