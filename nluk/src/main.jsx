import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AppProvider } from './context/AppContext.jsx'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'system-ui', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: '#666', marginBottom: 20, fontSize: '.95rem' }}>Please refresh the page to try again.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 28px', borderRadius: 12, background: '#059669', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '.95rem' }}>
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <HashRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </HashRouter>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
