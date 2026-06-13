'use client'

import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

export default function PdfViewer({ fileUrl }) {
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const { ZoomOut, Zoom, ZoomIn } = slots

          if (isMobile) {
            return (
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  gap: '8px',
                  padding: '4px',
                }}
              >
                <ZoomOut />
                <Zoom />
                <ZoomIn />
              </div>
            )
          }

          return (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                width: '100%',
              }}
            >
              <slots.GoToPreviousPage />
              <slots.CurrentPageInput />
              <slots.NumberOfPages />
              <slots.GoToNextPage />

              <div style={{ flex: 1 }} />

              <ZoomOut />
              <Zoom />
              <ZoomIn />

              <div style={{ flex: 1 }} />

              <slots.EnterFullScreen />
              <slots.Download />
              <slots.Print />
            </div>
          )
        }}
      </Toolbar>
    ),
  })

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <Viewer
        fileUrl={fileUrl}
        plugins={[defaultLayoutPluginInstance]}
        defaultScale={isMobile ? 0.4 : SpecialZoomLevel.PageWidth}
      />
    </Worker>
  )
}
