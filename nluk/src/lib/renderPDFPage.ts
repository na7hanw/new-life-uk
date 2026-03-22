/**
 * renderPDFPage
 *
 * Renders the first page of a PDF file to a PNG Blob using pdfjs-dist.
 * Everything runs in the browser — no file data is uploaded.
 *
 * pdfjs-dist is imported dynamically so its ~3 MB worker is only fetched
 * when the user actually selects a PDF, keeping the initial bundle lean.
 */

export async function renderPDFFirstPage(file: File): Promise<Blob> {
  const pdfjsLib = await import('pdfjs-dist')

  // Lazily set the worker source the first time we render a PDF
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString()
  }

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise

  const page = await pdf.getPage(1)

  // 2× scale gives Tesseract cleaner pixels to work with
  const viewport = page.getViewport({ scale: 2.0 })
  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height

  await page.render({ canvas, viewport }).promise

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas export failed'))
    }, 'image/png')
  })
}
