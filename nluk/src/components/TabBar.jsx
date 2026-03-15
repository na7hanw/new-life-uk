function TabBar({ tabs, activeTab, onSwitch, isDetail, showLang }) {
  if (isDetail || showLang) return null
  return (
    <nav className="tab-bar" aria-label="Main navigation">
      <div role="tablist" style={{ display: 'contents' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => onSwitch(t.id)} role="tab" aria-selected={activeTab === t.id} aria-label={t.label}>
            {activeTab === t.id && <div className="tab-dot" />}
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default TabBar
