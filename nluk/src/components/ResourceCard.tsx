import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
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
  badge?: string
  guideId?: string
}

/**
 * ResourceCard — shared card for free resources and career shortcuts.
 * Used by SavesPage and MorePage (replaces the near-identical SaveCard / GemCard pair).
 * When guideId is provided, a "See guide →" button navigates to the related guide.
 */
const ResourceCard = memo(function ResourceCard({ icon, content, url, lang, ui, badge, guideId }: ResourceCardProps) {
  const id = content.en?.title
  const [c, translating, wasTranslated] = useTranslatedContent<ResourceContent>(content, lang, id)
  const navigate = useNavigate()

  return (
    <div className={`content-card${translating ? ' translating' : ''}`}>
      <div className="content-card-header">
        <span className="content-card-icon">{icon}</span>
        <div>
          <span className="content-card-title">{c?.title}</span>
          {badge && <span className="pill pill-green" style={{ marginLeft: 6, fontSize: '.7rem', verticalAlign: 'middle' }}>{badge}</span>}
        </div>
      </div>
      <p className="content-card-body">{c?.desc}</p>
      {wasTranslated && (
        <span className="auto-translated-badge">{ui.autoTranslated || '🌐 Auto-translated'}</span>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: url || guideId ? 10 : 0 }}>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="link-btn">
            🔗 <span>{ui.openLink}</span> →
          </a>
        )}
        {guideId && (
          <button
            className="link-btn"
            style={{ border: 'none', cursor: 'pointer' }}
            onClick={() => navigate(`/guide/${guideId}`)}
            aria-label={`Open guide for ${c?.title || ''}`}
          >
            📖 See guide →
          </button>
        )}
      </div>
    </div>
  )
})

export default ResourceCard
