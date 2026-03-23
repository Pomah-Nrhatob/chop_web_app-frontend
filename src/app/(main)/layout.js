import { Header } from '@/widgets/header'

export default function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  )
}
