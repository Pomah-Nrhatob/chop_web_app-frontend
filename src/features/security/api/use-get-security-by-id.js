import { useQueryClient } from '@tanstack/react-query'

export const useGetSecurityById = (id, filters) => {
  const queryClient = useQueryClient()

  // Ищем охранника в кэше основного списка
  const securities = queryClient.getQueryData(['securities', filters])

  return securities?.find((item) => item.id === id)
}
