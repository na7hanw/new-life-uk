function QuickLinks({ links, label }) {
  if (!links?.length) return null
  return (
    <div className="quick-links-wrap">
      {label && <div className="section-label">{label}</div>}
      <div className="quick-links-row">
        {links.map(lk => (
          <a key={lk.url} href={lk.url} target="_blank" rel="noopener noreferrer" className="quick-link-pill">
            {lk.name} →
          </a>
        ))}
      </div>
    </div>
  )
}

export default QuickLinks
