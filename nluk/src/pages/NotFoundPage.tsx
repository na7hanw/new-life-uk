import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.tsx'

export default function NotFoundPage() {
  const { ui } = useApp()

  return (
    <div className="page-enter" style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
        {ui.notFoundTitle || 'Page not found'}
      </h2>
      <p style={{ color: 'var(--t2)', marginBottom: 24, lineHeight: 1.6 }}>
        {ui.notFoundSub || "The page you're looking for doesn't exist."}
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
        {ui.notFoundHome || 'Go back home'}
      </Link>
    </div>
  )
}
