import { auth } from '@/configs/auth'
import { AuthSessionSync } from '@/providers/authSessionSync/provider'
import { Provider } from '@/providers/chakraProvider/provider'
import { SessionProviderContainer } from '@/providers/sessionProvider/provider'
import { QueryProvider } from '@/providers/queryProvider/provider'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata = {
  metadataBase: new URL('https://uchop.ru'),
  applicationName: 'Uchop',
  icons: '/favicon.png',
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
                {children}
              </AuthSessionSync>
            </QueryProvider>
          </SessionProviderContainer>
        </Provider>
      </body>
    </html>
  )
}
