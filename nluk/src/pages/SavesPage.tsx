import { useApp } from '../context/AppContext.tsx'
import { SAVES } from '../data/saves.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'

export default function SavesPage() {
  const { lang, ui } = useApp()

  return (
    <div className="page-enter">
      <div style={{ padding: '16px 20px 8px' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{ui.savesTitle}</h2>
        <p style={{ fontSize: '.9rem', color: 'var(--t2)', marginTop: 4, lineHeight: 1.55 }}>{ui.savesSub}</p>
      </div>
      {SAVES.map(s => (
        <ResourceCard
          key={s.content.en.title}
          icon={s.icon}
          content={s.content as Record<string, ResourceContent>}
          url={s.url}
          lang={lang}
          ui={ui}
        />
      ))}
      <div style={{ height: 8 }} />
    </div>
  )
}
