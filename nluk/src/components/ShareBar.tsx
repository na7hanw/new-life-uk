import { useState, useRef, useEffect } from 'react'
import styles from './ShareBar.module.css'

function ShareBar({ title, ui }) {
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const url = window.location.href
  const text = `${title} — New Life UK\n${url}`

  useEffect(() => {
    return () => { if (copyTimer.current !== null) clearTimeout(copyTimer.current) }
  }, [])

  const share = (platform) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' — New Life UK')}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    }
    if (platform === 'copy') {
      navigator.clipboard?.writeText(url).then(() => {
        setCopied(true)
        if (copyTimer.current !== null) clearTimeout(copyTimer.current)
        copyTimer.current = setTimeout(() => { setCopied(false); copyTimer.current = null }, 2000)
      })
    } else {
      window.open(urls[platform], '_blank', 'noopener,noreferrer')
    }
  }
  return (
    <div className={styles.shareBar}>
      <button className={`${styles.shareBtn} ${styles.shareWhatsapp}`} onClick={() => share('whatsapp')} aria-label="Share on WhatsApp">💬 {ui.shareWhatsapp || 'WhatsApp'}</button>
      <button className={`${styles.shareBtn} ${styles.shareTelegram}`} onClick={() => share('telegram')} aria-label="Share on Telegram">✈️ {ui.shareTelegram || 'Telegram'}</button>
      <button className={`${styles.shareBtn} ${styles.shareFacebook}`} onClick={() => share('facebook')} aria-label="Share on Facebook">📘 {ui.shareFacebook || 'Facebook'}</button>
      <button className={`${styles.shareBtn} ${styles.shareCopy}`} onClick={() => share('copy')} aria-label="Copy link">🔗 {copied ? (ui.copied || 'Copied!') : (ui.shareCopy || 'Copy link')}</button>
    </div>
  )
}

export default ShareBar
