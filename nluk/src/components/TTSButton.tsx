import { useState, useEffect, useCallback } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import styles from './TTSButton.module.css'
import type { UiStrings } from '../types'

// Maps app language codes to BCP-47 voice tags preferred by Web Speech API
const LANG_VOICE: Record<string, string> = {
  en: 'en-GB',
  ar: 'ar-SA',
  fa: 'fa-IR',
  ur: 'ur-PK',
  am: 'am-ET',
  ti: 'ti-ET',
  so: 'so-SO',
  om: 'om-ET',
  uk: 'uk-UA',
  ro: 'ro-RO',
  pl: 'pl-PL',
  fr: 'fr-FR',
}

interface TTSButtonProps {
  lang: string
  title: string
  summary: string
  steps?: string[]
  ui?: Pick<UiStrings, 'ttsListen' | 'ttsStop'>
}

export default function TTSButton({ lang, title, summary, steps, ui = {} }: TTSButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const listenLabel = ui.ttsListen || 'Listen'
  const stopLabel   = ui.ttsStop   || 'Stop'

  // Stop speech on unmount
  useEffect(() => {
    return () => { if (supported) window.speechSynthesis.cancel() }
  }, [supported])

  // Keep speaking state in sync when synthesis ends naturally
  useEffect(() => {
    if (!supported) return
    const onEnd = () => setSpeaking(false)
    window.speechSynthesis.addEventListener?.('end', onEnd)
    return () => window.speechSynthesis.removeEventListener?.('end', onEnd)
  }, [supported])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()

    const text = [title, summary, ...(steps || [])].filter(Boolean).join('. ')
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = LANG_VOICE[lang] || 'en-GB'

    // Try to pick a matching voice; fall back to browser default
    const voices = window.speechSynthesis.getVoices()
    const match = voices.find(v => v.lang === utter.lang) ||
                  voices.find(v => v.lang.startsWith(utter.lang.split('-')[0]))
    if (match) utter.voice = match

    utter.onstart = () => setSpeaking(true)
    utter.onend   = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utter)
  }, [supported, lang, title, summary, steps])

  if (!supported) return null

  return (
    <button
      className={`${styles.ttsBtn} ${speaking ? styles.ttsSpeaking : ''}`}
      onClick={speaking ? stop : speak}
      aria-label={speaking ? stopLabel : listenLabel}
      title={speaking ? stopLabel : listenLabel}
    >
      {speaking
        ? <VolumeX size={18} strokeWidth={2} />
        : <Volume2 size={18} strokeWidth={2} />
      }
    </button>
  )
}
