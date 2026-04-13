import { auth } from '@/configs/auth'
import { AuthSessionSync } from '@/providers/authSessionSync/provider'
import { Provider } from '@/providers/chakraProvider/provider'
import { SessionProviderContainer } from '@/providers/sessionProvider/provider'
import { QueryProvider } from '@/providers/queryProvider/provider'
import { Header } from '@/widgets/header'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata = {
  title: 'Chop-CRM | Управление бизнесом',
  description: 'Управление бизнесом в твоем кармане',
}

export default async function RootLayout({ children }) {
  const session = await auth()

  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Provider>
          <SessionProviderContainer session={session}>
            <QueryProvider>
              <AuthSessionSync>
                <Header />
                {children}
              </AuthSessionSync>
            </QueryProvider>
          </SessionProviderContainer>
        </Provider>
      </body>
    </html>
  )
}
