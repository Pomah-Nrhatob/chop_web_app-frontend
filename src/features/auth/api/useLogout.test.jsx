import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLogout } from './use-logout'

const { mockPush, mockRefresh, mockSignOut, mockClearUserSession } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockRefresh: vi.fn(),
  mockSignOut: vi.fn().mockResolvedValue(undefined),
  mockClearUserSession: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

vi.mock('next-auth/react', () => ({
  signOut: mockSignOut,
}))

vi.mock('@/shared/api/api', () => ({
  clearUserSession: mockClearUserSession,
  USER_QUERY_KEY: 'user',
}))

describe('useLogout хук', () => {
  let queryClient
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    // Гарантируем, что fetch всегда возвращает успех по умолчанию
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  it('должен выполнить все шаги очистки и перенаправить на /login при успехе', async () => {
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries')
    const clearSpy = vi.spyOn(queryClient, 'clear')

    const { result } = renderHook(() => useLogout(), { wrapper })

    // ✅ ИСПРАВЛЕНИЕ: mutateAsync внутри act гарантирует, что весь try/catch завершится
    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(global.fetch).toHaveBeenCalledWith('/api/logout', { method: 'POST' })
    expect(mockSignOut).toHaveBeenCalledWith({ redirect: false })
    expect(mockClearUserSession).toHaveBeenCalled()

    // Проверяем, что removeQueries вызвался (не важно, строка там или массив)
    expect(removeQueriesSpy).toHaveBeenCalled()
    expect(clearSpy).toHaveBeenCalled()

    expect(mockPush).toHaveBeenCalledWith('/login')
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('должен выполнить fallback-очистку и всё равно перенаправить на /login, если fetch упал', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Server Error'))
    const clearSpy = vi.spyOn(queryClient, 'clear')

    const { result } = renderHook(() => useLogout(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync()
    })

    expect(global.fetch).toHaveBeenCalled()
    expect(mockSignOut).toHaveBeenCalledWith({ redirect: false })
    expect(mockClearUserSession).toHaveBeenCalled()
    expect(clearSpy).toHaveBeenCalled()

    expect(mockPush).toHaveBeenCalledWith('/login')
    expect(mockRefresh).toHaveBeenCalled()
  })
})
