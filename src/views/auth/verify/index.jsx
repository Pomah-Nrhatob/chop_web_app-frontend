import { createMetadata } from '@/lib/seo/createMetadata'
import { VerifyPage } from './ui/VerifyPage'

export const metadata = createMetadata({
  title: 'Uchop | Подтверждение аккаунта',
  description: 'Подтверждение аккаунта Uchop.',
  noIndex: true,
})

export default function Page() {
  return <VerifyPage />
}
