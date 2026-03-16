import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { SAVES, APPS, GEMS } from '../data/saves.js'
import { t18, lsSet } from '../lib/utils.js'

export default function SavesPage() {
  const { subtab = 'apps' } = useParams()
  const navigate = useNavigate()
  const { lang, ui } = useApp()

  const handleSubtab = (id) => {
    lsSet('nluk_stab', id)
    navigate(`/saves/${id}`)
  }

  const renderCards = (items) =>
    items.map(item => {
      const c = t18(item.content, lang)
      return (
        <div key={c.title} className="content-card">
          <div className="content-card-header">
            <span className="content-card-icon">{item.icon}</span>
            <span className="content-card-title">{c.title}</span>
          </div>
          <p className="content-card-body">{c.desc}</p>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ marginTop: 10 }}>
              🔗 <span>{ui.openLink}</span> →
            </a>
          )}
        </div>
      )
    })

  return (
    <div className="page-enter">
      <div className="sub-tabs" role="tablist">
        {[
          { id: 'apps', label: `📲 ${ui.appsTab}` },
          { id: 'free', label: `🆓 ${ui.savesTab}` },
          { id: 'gems', label: `💎 ${ui.gemsTab}` },
        ].map(t => (
          <button key={t.id} className={`sub-tab ${subtab === t.id ? 'active' : ''}`}
            onClick={() => handleSubtab(t.id)} role="tab" aria-selected={subtab === t.id}>
            {t.label}
          </button>
        ))}
      </div>

      {subtab === 'apps' && (
        <>
          <div style={{ padding: '4px 20px 8px' }}>
            <p style={{ fontSize: '.9rem', color: 'var(--t2)', lineHeight: 1.55 }}>{ui.appsSub}</p>
          </div>
          {renderCards(APPS)}
        </>
      )}

      {subtab === 'free' && (
        <>
          <div style={{ padding: '4px 20px 8px' }}>
            <p style={{ fontSize: '.9rem', color: 'var(--t2)', lineHeight: 1.55 }}>{ui.savesSub}</p>
          </div>
          {renderCards(SAVES)}
        </>
      )}

      {subtab === 'gems' && (
        <>
          <div style={{ padding: '4px 20px 8px' }}>
            <p style={{ fontSize: '.9rem', color: 'var(--t2)', lineHeight: 1.55 }}>{ui.gemsSub}</p>
          </div>
          {renderCards(GEMS)}
        </>
      )}

      <div style={{ height: 8 }} />
    </div>
  )
}
