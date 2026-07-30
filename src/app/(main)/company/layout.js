import { createMetadata } from '@/lib/seo/createMetadata'
import Footer from '@/widgets/footer/Footer'
import { Header } from '@/widgets/header'

export const metadata = createMetadata({
  title: 'Uchop | Мои компании',
  description: 'Личный кабинет Uchop для управления компаниями.',
  pathname: '/company',
  noIndex: true,
})

export default function Layout({ children }) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  )
}
