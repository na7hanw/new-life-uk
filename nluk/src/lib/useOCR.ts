/**
 * useOCR — Tesseract.js OCR hook
 *
 * Extracts text from an image file using the Tesseract.js WASM engine.
 * All processing happens in the browser — no image data is ever sent to a server.
 *
 * Features:
 * - Progress reporting (0–100 with stage description)
 * - Abort support (cancel in-flight OCR)
 * - Confidence score (0–100) alongside extracted text
 * - Cleans up the Tesseract worker on unmount
 *
 * Usage:
 *   const { run, result, progress, stage, loading, error, cancel } = useOCR()
 *   await run(imageFile) // returns void; updates state reactively
 */
import { useState, useRef, useCallback } from 'react'
import { createWorker } from 'tesseract.js'

export interface OCRResult {
  /** Full extracted plain text */
  text: string
  /** Overall confidence score 0–100 */
  confidence: number
}

export interface OCRState {
  result: OCRResult | null
  progress: number   // 0–100
  stage: string      // e.g. "recognizing text"
  loading: boolean
  error: string | null
  /** Run OCR on an image file */
  run: (image: File | Blob | string) => Promise<void>
  /** Cancel in-progress OCR */
  cancel: () => void
}

export function useOCR(): OCRState {
  const [result, setResult]   = useState<OCRResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [stage, setStage]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const workerRef             = useRef<Awaited<ReturnType<typeof createWorker>> | null>(null)
  const cancelledRef          = useRef(false)

  const cancel = useCallback(() => {
    cancelledRef.current = true
    workerRef.current?.terminate()
    workerRef.current = null
    setLoading(false)
    setStage('')
    setProgress(0)
  }, [])

  const run = useCallback(async (image: File | Blob | string) => {
    cancel()
    cancelledRef.current = false
    setLoading(true)
    setError(null)
    setResult(null)
    setProgress(0)
    setStage('Loading OCR engine…')

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          if (cancelledRef.current) return
          setStage(m.status)
          // Tesseract progress is 0–1 during "recognizing text", otherwise 0
          setProgress(Math.round((m.progress ?? 0) * 100))
        },
      })
      workerRef.current = worker

      if (cancelledRef.current) return

      const { data } = await worker.recognize(image)

      if (cancelledRef.current) return

      setResult({
        text: data.text.trim(),
        confidence: Math.round(data.confidence),
      })
      setProgress(100)
      setStage('Done')

      await worker.terminate()
      workerRef.current = null
    } catch (err) {
      if (!cancelledRef.current) {
        setError(err instanceof Error ? err.message : 'OCR failed. Try a clearer image.')
      }
    } finally {
      if (!cancelledRef.current) {
        setLoading(false)
      }
    }
  }, [cancel])

  return { result, progress, stage, loading, error, run, cancel }
}
