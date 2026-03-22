/**
 * DocumentScanner
 *
 * Lets users photograph or upload an official document (BRP, letter, form)
 * and extract the text via Tesseract.js OCR — entirely in the browser,
 * nothing sent to any server.
 *
 * After extraction, users can translate the text to their language using
 * the existing translate.ts pipeline.
 */
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.tsx'
import { useOCR } from '../lib/useOCR.ts'
import { translate } from '../lib/translate.ts'
import MachineTranslationBanner from '../components/MachineTranslationBanner.tsx'
import styles from './DocumentScanner.module.css'

const MAX_FILE_MB = 10
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

export default function DocumentScanner() {
  const navigate = useNavigate()
  const { lang, ui, ab } = useApp()
  const { result, progress, stage, loading, error, run, cancel } = useOCR()

  const [preview, setPreview]         = useState<string | null>(null)
  const [translation, setTranslation] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)
  const [copyLabel, setCopyLabel]     = useState('Copy text')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return // silently ignore non-image drops
    }
    if (file.size > MAX_FILE_BYTES) {
      alert(`Please choose an image smaller than ${MAX_FILE_MB} MB.`)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    setTranslation(null)
    setCopyLabel('Copy text')
    run(file)
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
    setPreview(null)
    setTranslation(null)
    setCopyLabel('Copy text')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const displayText = translation ?? result?.text ?? ''

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
      {!preview && !loading && (
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
          <p className={styles.dropSub}>JPG, PNG, HEIC · max {MAX_FILE_MB} MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputChange}
            className={styles.hiddenInput}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      )}

      {/* ── Image preview ─────────────────────────────────────── */}
      {preview && (
        <div className={styles.previewWrap}>
          <img src={preview} alt="Document preview" className={styles.preview} />
          {!loading && (
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
      {error && (
        <div className={styles.errorBox}>
          <span>⚠️ {error}</span>
          <button onClick={handleReset}>Try again</button>
        </div>
      )}

      {/* ── Results ──────────────────────────────────────────── */}
      {result && !loading && (
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
      {!result && !loading && (
        <div className={styles.tips}>
          <div className={styles.tipsTitle}>📸 Tips for best results</div>
          <ul className={styles.tipsList}>
            <li>Hold the camera steady and wait for it to focus</li>
            <li>Use good lighting — avoid shadows across the text</li>
            <li>Lay the document flat on a dark surface</li>
            <li>Make sure all text is inside the frame</li>
            <li>If the result is wrong, try a closer or better-lit photo</li>
          </ul>
        </div>
      )}
    </article>
  )
}
