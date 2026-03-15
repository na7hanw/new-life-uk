import { useState } from 'react'

function ShareBar({ title, ui }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href
  const text = `${title} — New Life UK\n${url}`
  const share = (platform) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' — New Life UK')}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    }
    if (platform === 'copy') {
      navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    } else {
      window.open(urls[platform], '_blank', 'noopener,noreferrer')
    }
  }
  return (
    <div className="share-bar">
      <button className="share-btn share-whatsapp" onClick={() => share('whatsapp')} aria-label="Share on WhatsApp">💬 {ui.shareWhatsapp || 'WhatsApp'}</button>
      <button className="share-btn share-telegram" onClick={() => share('telegram')} aria-label="Share on Telegram">✈️ {ui.shareTelegram || 'Telegram'}</button>
      <button className="share-btn share-facebook" onClick={() => share('facebook')} aria-label="Share on Facebook">📘 {ui.shareFacebook || 'Facebook'}</button>
      <button className="share-btn share-copy" onClick={() => share('copy')} aria-label="Copy link">🔗 {copied ? (ui.copied || 'Copied!') : (ui.shareCopy || 'Copy link')}</button>
    </div>
  )
}

export default ShareBar
