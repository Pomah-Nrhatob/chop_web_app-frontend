import { useQuery } from '@tanstack/react-query'
import { reportGeneratorApi } from '@/shared/api/reportGenerator/reportGenerator-api'
import { toaster } from '@/providers/chakraProvider/toaster'

const getExtensionFromContentType = (contentType = '') => {
  if (contentType.includes('pdf')) return 'pdf'
  if (contentType.includes('spreadsheetml') || contentType.includes('excel')) {
    return 'xlsx'
  }

  return 'file'
}

export const useGetReportSecurity = ({ securityId, query, enabled = true }) => {
  return useQuery({
    queryKey: ['report-security', securityId, query],
    enabled: Boolean(securityId) && enabled,

    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    retry: false,

    queryFn: async () => {
      try {
        const response = await reportGeneratorApi.getReportSecurity(query, securityId)

        const blob = response.data
        const contentType = response.headers?.['content-type']
        const extension = getExtensionFromContentType(contentType)

        const fileBlob = new Blob([blob], {
          type: contentType,
        })

        const fileUrl = URL.createObjectURL(fileBlob)

        return {
          blob: fileBlob,
          url: fileUrl,
          contentType,
          extension,
          isPdf: extension === 'pdf',
          isExcel: extension === 'xlsx',
          fileName: `report.${extension}`,
        }
      } catch (err) {
        toaster.create({
          title: 'Ошибка загрузки',
          description: err?.message || 'Не удалось загрузить отчет сотрудника',
          type: 'error',
        })

        throw err
      }
    },
  })
}
