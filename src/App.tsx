import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { lazy, Suspense, useState, useEffect } from 'react'
import ErrorBoundary from './shared/components/ErrorBoundary'
import NotFound from './shared/components/NotFound'
import LandingPage from './landing/LandingPage'

const ExplorePage = lazy(() => import('./explore/ExplorePage'))
const SearchPage = lazy(() => import('./search/SearchPage'))

function Nav() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://aggregateapi-production.up.railway.app'
  const location = useLocation()
  const isExplore = location.pathname === '/explore'
  const isSearch = location.pathname === '/search'
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const linkClass = "hover:text-[var(--color-text)] transition"

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg-base)]/80 backdrop-blur-2xl border-b border-[var(--color-border)]" aria-label="Main navigation">
      <div style={{ maxWidth: '1080px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '64px', paddingRight: '64px' }} className="h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Aggregate API home">
          <span className="h-8 w-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-bg-base)] font-bold text-sm" aria-hidden="true">A</span>
          <span className="font-semibold text-[var(--color-text)] tracking-tight">Aggregate API</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8 text-[14px] text-[var(--color-text-sub)]">
          <a href="/#features" className={linkClass}>Features</a>
          <a href="/#demo" className={linkClass}>Demo</a>
          <a href="/#pricing" className={linkClass}>Pricing</a>
          <Link to="/explore" className={`${linkClass} ${isExplore ? 'text-[var(--color-gold)]' : ''}`}>Explore</Link>
          <Link to="/search" className={`${linkClass} ${isSearch ? 'text-[var(--color-gold)]' : ''}`}>Search</Link>
          <a href={`${apiBaseUrl}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className={linkClass}>Docs</a>
          <a href="/#pricing" className="ml-2 rounded-lg bg-[var(--color-gold)] px-5 py-2 font-semibold text-[var(--color-bg-base)] text-[14px] hover:brightness-110 transition">
            Get API Key
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 text-[var(--color-text-sub)] hover:text-[var(--color-text)] transition"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--color-border)] bg-[var(--color-bg-base)]/95 backdrop-blur-xl">
          <div className="flex flex-col px-8 py-4 gap-4 text-[15px] text-[var(--color-text-sub)]">
            <a href="/#features" className={linkClass} onClick={() => setMobileOpen(false)}>Features</a>
            <a href="/#demo" className={linkClass} onClick={() => setMobileOpen(false)}>Demo</a>
            <a href="/#pricing" className={linkClass} onClick={() => setMobileOpen(false)}>Pricing</a>
            <Link to="/explore" className={`${linkClass} ${isExplore ? 'text-[var(--color-gold)]' : ''}`}>Explore</Link>
            <Link to="/search" className={`${linkClass} ${isSearch ? 'text-[var(--color-gold)]' : ''}`}>Search</Link>
            <a href={`${apiBaseUrl}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className={linkClass}>Docs</a>
            <a href="/#pricing" className="mt-2 rounded-lg bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-bg-base)] text-[14px] text-center hover:brightness-110 transition">
              Get API Key
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <div className="relative z-10">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Nav />
      <ErrorBoundary>
        <main id="main-content">
        <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-64px)] text-[var(--color-text-dim)]">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  )
}
