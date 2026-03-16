import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps { children?: ReactNode }

export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state = { hasError: false }

  static getDerivedStateFromError() { return { hasError: true } }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: 20, fontSize: '.95rem' }}>Please refresh the page to try again.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '12px 28px', borderRadius: 12, background: '#059669', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '.95rem' }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
