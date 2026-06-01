import { auth } from '@/configs/auth'
import { AuthSessionSync } from '@/providers/authSessionSync/provider'
import { Provider } from '@/providers/chakraProvider/provider'
import { SessionProviderContainer } from '@/providers/sessionProvider/provider'
import { QueryProvider } from '@/providers/queryProvider/provider'
import { Header } from '@/widgets/header'
import NextTopLoader from 'nextjs-toploader'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata = {
  title: 'Uchop | Управление бизнесом',
  icons: '/favicon.png',
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
                <NextTopLoader
                  color="#3182ce"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={3}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 10px #3182ce,0 0 5px #3182ce"
                />
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
