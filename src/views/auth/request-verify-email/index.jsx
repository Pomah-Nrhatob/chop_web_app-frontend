import { createMetadata } from '@/lib/seo/createMetadata'
import RequestVerifyEmail from '@/views/auth/request-verify-email/ui/RequestVerifyEmail'
import React from 'react'

export const metadata = createMetadata({
  title: 'Uchop | Подтверждение аккаунта',
  description: 'Подтверждение аккаунта Uchop.',
  noIndex: true,
})

export default function Page() {
  return <RequestVerifyEmail />
}
