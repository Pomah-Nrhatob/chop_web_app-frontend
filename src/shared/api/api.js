import axios from 'axios'
import { useUserStore } from '@/entities/user/model/store'

export const $api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true, // КРИТИЧНО: чтобы браузер сам слал Refresh-куку в NestJS
})

$api.interceptors.request.use((config) => {
  // Достаем актуальный токен из Zustand
  const token = useUserStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Здесь позже добавим интерцепторы для обработки 401 ошибки
