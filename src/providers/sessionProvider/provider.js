import { SessionProvider } from 'next-auth/react'

export function SessionProviderContainer({ children, session }) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
