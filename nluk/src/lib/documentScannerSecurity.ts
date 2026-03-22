/**
 * documentScannerSecurity
 *
 * Single source of truth for all file-validation constants and helpers used
 * by both the DocumentScanner component and its security regression tests.
 * Importing from one place prevents tests drifting from production logic.
 */

export const MAX_FILE_MB = 10
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024

/**
 * Explicit allowlist of accepted image MIME types.
 * SVG is intentionally excluded — it can embed scripts and is not a
 * document-scan format. Generic types like application/octet-stream are
 * excluded because they bypass format-specific validation.
 */
export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/bmp',
  'image/tiff',
])

export const ALLOWED_PDF_TYPE = 'application/pdf'

/**
 * Returns 'image', 'pdf', or null.
 * Performs an exact MIME type check against the allowlist — not a
 * prefix match — so types like "image/jpeg; charset=utf-8" are rejected.
 */
export function isAllowedFile(file: { type: string }): 'image' | 'pdf' | null {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return 'image'
  if (file.type === ALLOWED_PDF_TYPE) return 'pdf'
  return null
}

/**
 * Returns true only for blob: and data:image/ URLs.
 * Prevents an external http/https URL or a javascript: URI from being set
 * as an <img> src through the preview state.
 */
export function isSafePreviewUrl(url: string): boolean {
  return url.startsWith('blob:') || url.startsWith('data:image/')
}
