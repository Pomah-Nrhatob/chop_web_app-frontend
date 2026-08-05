import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// 1. Оборачиваем переменные в vi.hoisted, чтобы они инициализировались ДО выполнения vi.mock
const { mockPush, mockRefreshUser, mockToasterCreate } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockRefreshUser: vi.fn(),
  mockToasterCreate: vi.fn(),
}))

// 2. Теперь vi.mock могут безопасно использовать эти переменные
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('@/features/users/api/use-user', () => ({
  useUser: () => ({
    refreshUser: mockRefreshUser,
  }),
}))

vi.mock('@/providers/chakraProvider/toaster', () => ({
  toaster: {
    create: mockToasterCreate,
  },
}))

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}))

vi.mock('@/shared/api/auth/auth-api', () => ({
  authApi: {
    login: vi.fn(),
  },
}))

// Импортируем модули для управления их поведением в тестах
import { signIn } from 'next-auth/react'
import { authApi } from '@/shared/api/auth/auth-api'
import { useAuth } from './use-auth'

describe('useAuth хук (TanStack Mutation)', () => {
  let queryClient
  let wrapper

  // Перед каждым тестом создаем чистый экземпляр QueryClient
  beforeEach(() => {
    vi.clearAllMocks() // Очищаем историю вызовов функций-заглушек

    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false, // Отключаем повторные попытки при ошибках
        },
      },
    })

    // Обертка с провайдером TanStack Query
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  it('должен успешно авторизовать пользователя, показать тост и сделать редирект', async () => {
    const mockCredentials = { email: 'test@test.com', password: 'password123' }
    const mockUserData = { id: '1', email: 'test@test.com', token: 'jwt-token' }

    // Настраиваем цепочку успешных ответов API и NextAuth
    vi.mocked(authApi.login).mockResolvedValue(mockUserData)
    vi.mocked(signIn).mockResolvedValue({ error: null, status: 200 })

    // Рендерим хук
    const { result } = renderHook(() => useAuth(), { wrapper })

    // Вызываем мутацию (в TanStack Query для этого служит метод .mutate)
    result.current.mutate(mockCredentials)

    // Ждем, пока TanStack перейдет в статус 'success'
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Проверяем, что authApi.login вызвался с правильными параметрами
    expect(authApi.login).toHaveBeenCalledWith(mockCredentials)

    // Проверяем, что NextAuth.signIn вызвался со строкой userData из фронтенда
    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: mockCredentials.email,
      password: mockCredentials.password,
      userFromFrontend: JSON.stringify(mockUserData),
      redirect: false,
    })

    // Проверяем вызов Chakra тостера на onSuccess
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Вход выполнен успешно',
      type: 'success',
    })

    // Проверяем, что роутер перенаправил на главную страницу
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('должен обработать ошибку, если authApi.login выбросил исключение', async () => {
    const mockCredentials = { email: 'wrong@test.com', password: '123' }
    const apiError = {
      response: {
        data: { message: 'Неверный логин или пароль' },
      },
    }

    // Имитируем падение бэкенда
    vi.mocked(authApi.login).mockRejectedValue(apiError)

    const { result } = renderHook(() => useAuth(), { wrapper })

    result.current.mutate(mockCredentials)

    // Ждем, пока мутация завершится с ошибкой
    await waitFor(() => expect(result.current.isError).toBe(true))

    // Проверяем, что текст ошибки совпадает с логикой в catch-блоке
    expect(result.current.error.message).toBe('Неверный логин или пароль')

    // Проверяем, что показан тост об ошибке с правильным описанием
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка входа',
      description: 'Неверный логин или пароль',
      type: 'error',
    })

    // Убеждаемся, что NextAuth.signIn ДАЖЕ НЕ ВЫЗЫВАЛСЯ, так как упал первый запрос
    expect(signIn).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('должен обработать ошибку, если NextAuth вернул result.error', async () => {
    const mockCredentials = { email: 'test@test.com', password: 'password123' }

    vi.mocked(authApi.login).mockResolvedValue({ id: '1' })
    // API сработало, но NextAuth вернул флаг ошибки внутри объекта ответа
    vi.mocked(signIn).mockResolvedValue({ error: 'CredentialsSignin' })

    const { result } = renderHook(() => useAuth(), { wrapper })

    result.current.mutate(mockCredentials)

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error.message).toBe('Ошибка авторизации')
    expect(mockToasterCreate).toHaveBeenCalledWith({
      title: 'Ошибка входа',
      description: 'Ошибка авторизации',
      type: 'error',
    })
    expect(mockPush).not.toHaveBeenCalled()
  })
})
