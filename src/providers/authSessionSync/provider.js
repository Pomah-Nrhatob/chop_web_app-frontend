// src/providers/auth-session-sync.js
'use client'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { tokenRef } from '@/lib/auth-token-ref'

export function AuthSessionSync({ children }) {
  const { session, status } = useSession()
  const queryClient = useQueryClient()

  useEffect(() => {
    // Синхронизация токена
    tokenRef.current = session?.accessToken ?? null

    // Управление кэшем
    if (status === 'unauthenticated') {
      queryClient.removeQueries({ queryKey: ['user'] })
    }
    if (status === 'authenticated') {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  }, [session, status, queryClient])

  return <>{children}</>
}
