'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, Dialog, HStack, Text, VStack, Box, IconButton } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { MdClose } from 'react-icons/md'
import { useGeneratorReportQueryStore } from '@/features/report/store/useGeneratorReportQueryStore'
import { useGetReportSecurity } from '@/features/report/api/use-get-report-security'
import SelectSecurity from '@/features/dictionary/components/selectWithSearch/SelectSecurity'
import SelectYearMonth from '@/widgets/report-generator/ui/SelectYearMonth'
import SelectDateRange from '@/widgets/report-generator/ui/SelectDateRange'
import { LuDownload, LuFileText, LuFileSpreadsheet } from 'react-icons/lu'
import { TbReportAnalytics } from 'react-icons/tb'

const PdfViewer = dynamic(() => import('./PdfViewer'), {
  ssr: false,
})

const dayToTimestamp = (value, type = 'start') => {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)

  const date =
    type === 'end'
      ? new Date(year, month - 1, day, 23, 59, 59)
      : new Date(year, month - 1, day, 0, 0, 0)

  return Math.floor(date.getTime() / 1000)
}

export default function SecurityReportGenerator({
  open: controlledOpen,
  onOpenChange = null,
  hideTrigger = false,

  itemId = null,
  year = null,
  month = null,
}) {
  // const [open, setOpen] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)

  const [internalOpen, setInternalOpen] = useState(false)

  const open = controlledOpen ?? internalOpen

  const handleOpenChange = (details) => {
    if (onOpenChange) {
      onOpenChange(details.open)
    } else {
      setInternalOpen(details.open)
    }

    if (!details.open) {
      resetToDefaults()
      clearReports()
    }
  }

  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false

    return window.matchMedia('(max-width: 768px)').matches
  }

  const handlePdfAction = () => {
    if (!pdfReport.data) return

    if (isMobileDevice()) {
      openFileInNewTab(pdfReport.data)
      return
    }

    downloadFile(pdfReport.data)
  }

  const openFileInNewTab = (file) => {
    if (!file?.url) return

    window.open(file.url, '_blank', 'noopener,noreferrer')
  }

  const queryClient = useQueryClient()
  const { queryParams, setQueryParams, resetToDefaults } = useGeneratorReportQueryStore()

  useEffect(() => {
    if (!open) return

    const nextParams = {}

    if (itemId) {
      nextParams.itemId = itemId
    }

    if (year && month) {
      nextParams.periodType = 'month'
      nextParams.year = year
      nextParams.month = month
      nextParams.startDay = null
      nextParams.endDay = null
    }

    if (Object.keys(nextParams).length) {
      setQueryParams(nextParams)
    }
  }, [open, itemId, year, month, setQueryParams])

  const reportQuery = useMemo(() => {
    if (queryParams.periodType === 'range') {
      return {
        startDay: dayToTimestamp(queryParams.startDay, 'start'),
        endDay: dayToTimestamp(queryParams.endDay, 'end'),
      }
    }

    return {
      year: queryParams.year,
      month: queryParams.month,
    }
  }, [queryParams])

  const canGenerateReport =
    Boolean(queryParams.itemId) &&
    (Boolean(reportQuery.year && reportQuery.month) ||
      Boolean(reportQuery.startDay && reportQuery.endDay))

  const pdfReport = useGetReportSecurity({
    securityId: queryParams.itemId,
    query: {
      ...reportQuery,
      format: 'pdf',
    },
    enabled: false,
  })

  const excelReport = useGetReportSecurity({
    securityId: queryParams.itemId,
    query: {
      ...reportQuery,
      format: 'excel',
    },
    enabled: false,
  })

  const clearReports = () => {
    const pdfUrl = pdfReport.data?.url
    const excelUrl = excelReport.data?.url

    queryClient.removeQueries({
      queryKey: ['report-object'],
    })

    setPdfGenerated(false)

    setTimeout(() => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
      if (excelUrl) URL.revokeObjectURL(excelUrl)
    }, 0)
  }

  const handleGeneratePdf = async () => {
    const result = await pdfReport.refetch()

    if (result.data?.isPdf) {
      setPdfGenerated(true)
    }
  }

  const handleDownloadExcel = async () => {
    if (!pdfGenerated) return

    const result = await excelReport.refetch()

    if (result.data?.isExcel) {
      downloadFile(result.data)
    }
  }

  const downloadFile = (file) => {
    if (!file?.url) return

    const link = document.createElement('a')
    link.href = file.url
    link.download = file.fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details) => {
        handleOpenChange(details)

        if (!details.open) {
          resetToDefaults()
          clearReports()
        }
      }}
    >
      {!hideTrigger && (
        <Dialog.Trigger asChild>
          <IconButton size={{ base: 'xs', md: 'sm' }} px={2}>
            <TbReportAnalytics />
            Сформировать отчет
          </IconButton>
        </Dialog.Trigger>
      )}

      <Dialog.Backdrop />

      <Dialog.Positioner
        display="flex"
        alignItems={{ base: 'center', md: 'flex-start' }}
        justifyContent="center"
        p={{ base: 3, md: 6 }}
      >
        <Dialog.Content w="full" maxW="1000px" maxH="calc(100dvh - 24px)" overflow="hidden">
          <Dialog.Header>
            <Dialog.Title>Генерация отчета сотрудника</Dialog.Title>
          </Dialog.Header>

          <Dialog.Body overflowY="auto">
            <VStack align="stretch" gap={5}>
              <HStack maxW="44rem" wrap="wrap" gap={3} align="end">
                <Box w="100%">
                  <SelectSecurity
                    isDisabled={itemId ? true : false}
                    title="Выбор охранника"
                    multiple={false}
                    showSelectedList={false}
                    value={queryParams.itemId ? [queryParams.itemId] : []}
                    onChange={(value) => {
                      clearReports()
                      setQueryParams({
                        itemId: value[0] ?? null,
                      })
                    }}
                    placeholder="Выберите охранника"
                    inputOnTop
                  />
                </Box>

                <SelectYearMonth />
                <Text color="red" fontSize={18}>
                  ИЛИ
                </Text>
                <SelectDateRange />
              </HStack>

              <HStack wrap="wrap" gap={3}>
                <Button
                  colorScheme="red"
                  onClick={handleGeneratePdf}
                  loading={pdfReport.isFetching}
                  disabled={!canGenerateReport}
                >
                  <LuFileText />
                  Сформировать PDF
                </Button>

                <Button
                  variant="outline"
                  onClick={handlePdfAction}
                  disabled={!pdfReport.data?.isPdf}
                >
                  <LuDownload />
                  Скачать PDF
                </Button>

                <Button
                  colorScheme="green"
                  variant="outline"
                  onClick={handleDownloadExcel}
                  loading={excelReport.isFetching}
                  disabled={!pdfGenerated}
                >
                  <LuFileSpreadsheet />
                  Скачать Excel
                </Button>
              </HStack>

              {!canGenerateReport && (
                <Text color="red.500">
                  Выберите объект и период отчета. В качестве периода выберете месяц или интервал
                  дней
                </Text>
              )}

              {open && pdfReport.data?.isPdf && (
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  overflow="hidden"
                  height={{
                    base: 'calc(100dvh - 280px)',
                    md: '700px',
                  }}
                  minH={{ base: '360px', md: '500px' }}
                >
                  <PdfViewer fileUrl={pdfReport.data.url} />
                </Box>
              )}
            </VStack>
          </Dialog.Body>

          <Dialog.CloseTrigger asChild>
            <IconButton variant="ghost" position="absolute" top="3" right="3" aria-label="Закрыть">
              <MdClose />
            </IconButton>
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
