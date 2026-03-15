'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // 1. Импорт
import { useState } from 'react' // 2. Импорт
import { ColorModeProvider } from './color-mode'
import { Toaster } from '@/providers/chakraProvider/toaster'

export function Provider(props) {
  // 3. Создаем клиент один раз на стороне браузера
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      })
  )

  return (
    // 4. Оборачиваем всё в QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
        <Toaster />
      </ChakraProvider>
    </QueryClientProvider>
  )
}
