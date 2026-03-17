import { memo } from 'react'
import { useTranslatedContent } from '../lib/useTranslation.ts'
import type { UiStrings } from '../types'

export interface ResourceContent {
  title: string
  desc: string
  [key: string]: unknown
}

interface ResourceCardProps {
  icon: string
  content: Record<string, ResourceContent>
  url?: string
  lang: string
  ui: UiStrings
}

/**
 * ResourceCard — shared card for free resources and career shortcuts.
 * Used by SavesPage and MorePage (replaces the near-identical SaveCard / GemCard pair).
 */
const ResourceCard = memo(function ResourceCard({ icon, content, url, lang, ui }: ResourceCardProps) {
  const id = content.en?.title
  const [c, translating, wasTranslated] = useTranslatedContent<ResourceContent>(content, lang, id)

  return (
    <div className={`content-card${translating ? ' translating' : ''}`}>
      <div className="content-card-header">
        <span className="content-card-icon">{icon}</span>
        <span className="content-card-title">{c?.title}</span>
      </div>
      <p className="content-card-body">{c?.desc}</p>
      {wasTranslated && (
        <span className="auto-translated-badge">{ui.autoTranslated || '🌐 Auto-translated'}</span>
      )}
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ marginTop: 10 }}>
          🔗 <span>{ui.openLink}</span> →
        </a>
      )}
    </div>
  )
})

export default ResourceCard
