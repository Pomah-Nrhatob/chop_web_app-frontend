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

const getFileNameFromContentDisposition = (contentDisposition = '') => {
  if (!contentDisposition) return null

  const utf8FileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)

  if (utf8FileNameMatch?.[1]) {
    return decodeURIComponent(utf8FileNameMatch[1].trim())
  }

  const fileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i)

  if (fileNameMatch?.[1]) {
    return decodeURIComponent(fileNameMatch[1].trim())
  }

  return null
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
        const contentType = response.headers?.['content-type'] || ''
        const contentDisposition = response.headers?.['content-disposition'] || ''

        const extension = getExtensionFromContentType(contentType)
        const fileNameFromHeader = getFileNameFromContentDisposition(contentDisposition)
        const fileName = fileNameFromHeader || `report.${extension}`

        const fileBlob = new File([blob], fileName, {
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
          fileName,
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
