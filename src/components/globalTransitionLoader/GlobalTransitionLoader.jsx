// components/GlobalTransitionLoader.tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTransition, useEffect } from 'react'
import { Box, Flex, Spinner } from '@chakra-ui/react'
import { useGlobalLoaderStore } from '@/shared/store/globalLoaderStore'

export default function GlobalTransitionLoader({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()
  const { isGlobalLoading, startGlobalLoading, stopGlobalLoading } = useGlobalLoaderStore()

  // Сбрасываем лоадер после завершения перехода
  useEffect(() => {
    if (!isPending) {
      stopGlobalLoading()
    }
  }, [isPending, stopGlobalLoading])

  // Переопределение router.push через startTransition
  const push = (href) => {
    startGlobalLoading()
    startTransition(() => {
      router.push(href)
    })
  }

  const replace = (href) => {
    startGlobalLoading()
    startTransition(() => {
      router.replace(href)
    })
  }

  // Делаем router доступным через контекст, если нужно
  // Либо используем только TransitionLink

  return (
    <>
      {children}
      {isGlobalLoading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.3)"
          zIndex={9999}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      )}
    </>
  )
}
