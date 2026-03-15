import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AppProvider } from './context/AppContext.jsx'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

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
