'use client'

import { securityApi } from '@/shared/api/security/security-api'
import { useEffect, useState } from 'react'

export default function BcRootPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null) // Сброс ошибки

        const response = await securityApi.getSecurityList()

        // Проверка данных
        if (!response || !Array.isArray(response)) {
          throw new Error('Данные безопасности отсутствуют или имеют некорректный формат')
        }

        setData(response)
      } catch (err) {
        console.log(err)

        setError(err.message || 'Произошла ошибка при загрузке данных')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>

  return (
    <div>
      <h1>Добро пожаловать в CRM</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  )
}
