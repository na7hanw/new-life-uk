/**
 * DocumentScanner
 *
 * Lets users photograph or upload an official document (BRP, letter, form)
 * and extract the text via Tesseract.js OCR — entirely in the browser,
 * nothing sent to any server.
 *
 * Security:
 * - MIME type checked against an explicit allowlist (not just a prefix match)
 * - File size capped at MAX_FILE_MB
 * - Blob URLs are revoked when the component resets or unmounts
 * - OCR output is rendered as plain text (<pre>), never via innerHTML
 * - PDF page 1 is rendered to an offscreen canvas before OCR (pdfjs-dist,
 *   loaded lazily so it does not bloat the initial bundle)
 *
 * After extraction, users can translate the text to their language using
 * the existing translate.ts pipeline.
 */
import { useRef, useState, useEffect, type ChangeEvent, type DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.tsx'
import { useOCR } from '../lib/useOCR.ts'
import { translate } from '../lib/translate.ts'
import { renderPDFFirstPage } from '../lib/renderPDFPage.ts'
import MachineTranslationBanner from '../components/MachineTranslationBanner.tsx'
import styles from './DocumentScanner.module.css'

const MAX_FILE_MB = 10
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

/** Explicit MIME allowlist — prevents relying solely on a user-controlled field. */
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/bmp',
  'image/tiff',
])
const ALLOWED_PDF_TYPE = 'application/pdf'

function isAllowedFile(file: File): 'image' | 'pdf' | null {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return 'image'
  if (file.type === ALLOWED_PDF_TYPE) return 'pdf'
  return null
}

export default function DocumentScanner() {
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()
  const { result, progress, stage, loading, error, run, cancel } = useOCR()

  const [preview, setPreview]         = useState<string | null>(null)
  const [translation, setTranslation] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)
  const [copyLabel, setCopyLabel]     = useState('Copy text')
  const [pdfPending, setPdfPending]   = useState(false)
  const [pdfError, setPdfError]       = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  // Revoke any outstanding blob URL when it is replaced or the component unmounts
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    }
  }, [])

  const setPreviewUrl = (url: string) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = url
    // Only accept blob: or data: URLs — never external URLs in an img src
    if (url.startsWith('blob:') || url.startsWith('data:image/')) {
      setPreview(url)
    }
  }

  const handleImage = (file: File) => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setTranslation(null)
    setCopyLabel('Copy text')
    setPdfError(null)
    run(file)
  }

  const handlePDF = async (file: File) => {
    setPdfPending(true)
    setPdfError(null)
    setTranslation(null)
    setCopyLabel('Copy text')
    try {
      const imageBlob = await renderPDFFirstPage(file)
      const url = URL.createObjectURL(imageBlob)
      setPreviewUrl(url)
      run(imageBlob)
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Could not render PDF. Try a clearer scan.')
    } finally {
      setPdfPending(false)
    }
  }

  const handleFile = (file: File) => {
    const fileType = isAllowedFile(file)
    if (!fileType) return   // silently ignore unsupported types
    if (file.size > MAX_FILE_BYTES) {
      alert(`Please choose a file smaller than ${MAX_FILE_MB} MB.`)
      return
    }
    if (fileType === 'pdf') {
      handlePDF(file)
    } else {
      handleImage(file)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''   // allow re-selecting the same file
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleTranslate = async () => {
    if (!result?.text || lang === 'en') return
    setTranslating(true)
    try {
      const translated = await translate(result.text, lang)
      setTranslation(translated || result.text)
    } finally {
      setTranslating(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyLabel('Copied ✓')
      setTimeout(() => setCopyLabel('Copy text'), 2000)
    } catch { /* ignore */ }
  }

  const handleReset = () => {
    cancel()
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    setPreview(null)
    setTranslation(null)
    setCopyLabel('Copy text')
    setPdfError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const displayText = translation ?? result?.text ?? ''

  const isBusy = loading || pdfPending

  return (
    <article className="page-enter">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>{ab} {ui.back}</button>
        <div className={styles.headerTitle}>
          <span aria-hidden="true">📷</span>
          <h2>Document Scanner</h2>
        </div>
        <p className={styles.headerSub}>
          Scan a letter, form, or document to read and translate its text.
          Everything stays on your device — nothing is uploaded.
        </p>
      </div>

      {/* ── Upload / Camera zone ──────────────────────────────── */}
      {!preview && !isBusy && (
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
          aria-label="Upload or take photo of document"
        >
          <span className={styles.dropIcon} aria-hidden="true">📄</span>
          <p className={styles.dropTitle}>Tap to take a photo or upload</p>
          <p className={styles.dropSub}>JPG, PNG, HEIC, PDF · max {MAX_FILE_MB} MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            onChange={handleInputChange}
            className={styles.hiddenInput}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      )}

      {/* ── PDF rendering pending ─────────────────────────────── */}
      {pdfPending && (
        <div className={styles.progressCard}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '25%' }} />
          </div>
          <div className={styles.progressStage}>Rendering PDF page 1…</div>
        </div>
      )}

      {/* ── Image preview ─────────────────────────────────────── */}
      {preview && (
        <div className={styles.previewWrap}>
          <img src={preview} alt="Document preview" className={styles.preview} />
          {!isBusy && (
            <button className={styles.resetBtn} onClick={handleReset} aria-label="Scan a different document">
              ✕ Scan different document
            </button>
          )}
        </div>
      )}

      {/* ── OCR progress ─────────────────────────────────────── */}
      {loading && (
        <div className={styles.progressCard}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressStage}>{stage || 'Processing…'} {progress > 0 ? `${progress}%` : ''}</div>
          <button className={styles.cancelBtn} onClick={cancel}>Cancel</button>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {(error || pdfError) && (
        <div className={styles.errorBox}>
          <span>⚠️ {error || pdfError}</span>
          <button onClick={handleReset}>Try again</button>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────── */}
      {result && !isBusy && (
        <>
          <div className="section-label">
            📝 Extracted Text
            {result.confidence > 0 && (
              <span className={styles.confidence}>
                {result.confidence}% confidence
              </span>
            )}
          </div>

          <div className={styles.resultCard}>
            <pre className={styles.resultText}>{displayText}</pre>

            <div className={styles.resultActions}>
              <button
                className={styles.actionBtn}
                onClick={() => handleCopy(displayText)}
              >
                📋 {copyLabel}
              </button>

              {lang !== 'en' && !translation && (
                <button
                  className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  onClick={handleTranslate}
                  disabled={translating}
                >
                  {translating ? (
                    <><span className="translating-spinner" /> Translating…</>
                  ) : (
                    `🌐 Translate to ${lang.toUpperCase()}`
                  )}
                </button>
              )}

              {translation && (
                <button
                  className={styles.actionBtn}
                  onClick={() => { setTranslation(null); setCopyLabel('Copy text') }}
                >
                  🔄 Show original
                </button>
              )}
            </div>
          </div>

          {lang !== 'en' && (
            <MachineTranslationBanner lang={lang} ui={ui} />
          )}
        </>
      )}

      {/* ── Tips ─────────────────────────────────────────────── */}
      {!result && !isBusy && (
        <div className={styles.tips}>
          <div className={styles.tipsTitle}>📸 Tips for best results</div>
          <ul className={styles.tipsList}>
            <li>Hold the camera steady and wait for it to focus</li>
            <li>Use good lighting — avoid shadows across the text</li>
            <li>Lay the document flat on a dark surface</li>
            <li>Make sure all text is inside the frame</li>
            <li>If the result is wrong, try a closer or better-lit photo</li>
            <li>For PDFs, only the first page is scanned</li>
          </ul>
        </div>
      )}
    </article>
  )
}
