import Footer from '@/widgets/footer/Footer'
import { Header } from '@/widgets/header'

export default function SeoLayout({ children }) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  )
}
