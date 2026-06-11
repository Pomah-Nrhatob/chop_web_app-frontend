'use client'

import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

export default function PdfViewer({ fileUrl }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
        touchAction: 'pan-x pan-y pinch-zoom',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={isMobile ? [] : [defaultLayoutPluginInstance]}
          defaultScale={isMobile ? SpecialZoomLevel.PageWidth : SpecialZoomLevel.PageWidth}
        />
      </Worker>
    </div>
  )
}
