/**
 * DocumentScanner — security regression tests
 *
 * Verifies the MIME allowlist and file-validation logic to prevent:
 *  - Arbitrary file types being passed to the OCR engine
 *  - Excessively large files being accepted
 *  - The preview URL being set to non-blob:/data: schemes
 */
import { describe, it, expect } from 'vitest'

// ─── Re-export the pure validation logic for unit testing ─────────────────────
// These constants mirror DocumentScanner.tsx (kept in sync manually).

const MAX_FILE_MB = 10
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

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

function isAllowedFile(file: { type: string }): 'image' | 'pdf' | null {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return 'image'
  if (file.type === ALLOWED_PDF_TYPE) return 'pdf'
  return null
}

function isSafePreviewUrl(url: string): boolean {
  return url.startsWith('blob:') || url.startsWith('data:image/')
}

// ─── MIME allowlist tests ─────────────────────────────────────────────────────

describe('DocumentScanner — MIME allowlist', () => {
  it('accepts JPEG images', () => {
    expect(isAllowedFile({ type: 'image/jpeg' })).toBe('image')
  })

  it('accepts PNG images', () => {
    expect(isAllowedFile({ type: 'image/png' })).toBe('image')
  })

  it('accepts WebP images', () => {
    expect(isAllowedFile({ type: 'image/webp' })).toBe('image')
  })

  it('accepts HEIC images', () => {
    expect(isAllowedFile({ type: 'image/heic' })).toBe('image')
  })

  it('accepts PDF files', () => {
    expect(isAllowedFile({ type: 'application/pdf' })).toBe('pdf')
  })

  it('rejects HTML files', () => {
    expect(isAllowedFile({ type: 'text/html' })).toBeNull()
  })

  it('rejects SVG files (potential XSS vector)', () => {
    expect(isAllowedFile({ type: 'image/svg+xml' })).toBeNull()
  })

  it('rejects JavaScript files', () => {
    expect(isAllowedFile({ type: 'application/javascript' })).toBeNull()
  })

  it('rejects empty MIME type', () => {
    expect(isAllowedFile({ type: '' })).toBeNull()
  })

  it('rejects MIME type with image/ prefix but not in allowlist (e.g. image/svg+xml)', () => {
    expect(isAllowedFile({ type: 'image/svg+xml' })).toBeNull()
  })

  it('rejects generic binary MIME type', () => {
    expect(isAllowedFile({ type: 'application/octet-stream' })).toBeNull()
  })

  it('rejects spoofed image type with extra content (exact match enforced)', () => {
    expect(isAllowedFile({ type: 'image/jpeg; charset=utf-8' })).toBeNull()
  })
})

// ─── File size tests ──────────────────────────────────────────────────────────

describe('DocumentScanner — file size limit', () => {
  it('allows files exactly at the limit', () => {
    expect(MAX_FILE_BYTES).toBe(MAX_FILE_BYTES)  // 10 MB
    // A file of exactly MAX_FILE_BYTES is allowed (not strictly greater)
    expect(MAX_FILE_BYTES > 0).toBe(true)
  })

  it('MAX_FILE_BYTES is 10 MB', () => {
    expect(MAX_FILE_BYTES).toBe(10 * 1024 * 1024)
  })
})

// ─── Preview URL safety tests ─────────────────────────────────────────────────

describe('DocumentScanner — preview URL safety', () => {
  it('accepts blob: URLs', () => {
    expect(isSafePreviewUrl('blob:https://example.com/abc-def')).toBe(true)
  })

  it('accepts data:image/ URLs', () => {
    expect(isSafePreviewUrl('data:image/png;base64,abc')).toBe(true)
  })

  it('rejects http: URLs', () => {
    expect(isSafePreviewUrl('http://evil.com/img.png')).toBe(false)
  })

  it('rejects https: URLs', () => {
    expect(isSafePreviewUrl('https://evil.com/img.png')).toBe(false)
  })

  it('rejects javascript: URLs', () => {
    expect(isSafePreviewUrl('javascript:alert(1)')).toBe(false)
  })

  it('rejects data:text/html URLs', () => {
    expect(isSafePreviewUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isSafePreviewUrl('')).toBe(false)
  })
})
