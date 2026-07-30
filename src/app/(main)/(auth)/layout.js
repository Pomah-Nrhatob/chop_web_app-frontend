import { Header } from '@/widgets/header'

export default function SeoLayout({ children }) {
  return (
    <>
      <Header />

      <main className="auth-bg flex min-h-screen items-center justify-center">{children}</main>
    </>
  )
}
