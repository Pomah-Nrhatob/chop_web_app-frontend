// components/TransitionLink.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Box } from '@chakra-ui/react'
import { useGlobalLoaderStore } from '@/shared/store/globalLoaderStore'

export default function TransitionLink({ href, children, onClick }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { startGlobalLoading } = useGlobalLoaderStore()

  const handleClick = () => {
    startGlobalLoading()
    onClick?.()
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <Box as="span" onClick={handleClick} cursor="pointer">
      {children}
    </Box>
  )
}
