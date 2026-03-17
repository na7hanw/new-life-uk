import { useApp } from '../context/AppContext.tsx'
import { SAVES } from '../data/saves.ts'
import ResourceCard from '../components/ResourceCard.tsx'
import type { ResourceContent } from '../components/ResourceCard.tsx'

export default function SavesPage() {
  const { lang, ui } = useApp()

  return (
    <div className="page-enter">
      <div className="page-hero">
        <h2 className="page-hero-title">{ui.savesTitle}</h2>
        <p className="page-hero-sub">{ui.savesSub}</p>
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
