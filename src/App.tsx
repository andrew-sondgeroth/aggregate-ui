import Hero from './landing/sections/Hero'
import Features from './landing/sections/Features'
import LiveDemo from './landing/sections/LiveDemo'
import CodeExample from './landing/sections/CodeExample'
import Pricing from './landing/sections/Pricing'
import Footer from './landing/sections/Footer'

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className} style={{ width: '100%' }}>
      <div style={{ maxWidth: '1080px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '64px', paddingRight: '64px' }}>
        {children}
      </div>
    </div>
  )
}

function Nav() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-bg-base)]/80 backdrop-blur-2xl border-b border-[var(--color-border)]">
      <div style={{ maxWidth: '1080px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '64px', paddingRight: '64px' }} className="h-[64px] flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-bg-base)] font-bold text-sm">A</span>
          <span className="font-semibold text-[var(--color-text)] tracking-tight">Aggregate API</span>
        </a>
        <div className="hidden sm:flex items-center gap-8 text-[14px] text-[var(--color-text-sub)]">
          <a href="#features" className="hover:text-[var(--color-text)] transition">Features</a>
          <a href="#demo" className="hover:text-[var(--color-text)] transition">Demo</a>
          <a href="#pricing" className="hover:text-[var(--color-text)] transition">Pricing</a>
          <a href={`${apiBaseUrl}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition">Docs</a>
          <a href="#pricing" className="ml-2 rounded-lg bg-[var(--color-gold)] px-5 py-2 font-semibold text-[var(--color-bg-base)] text-[14px] hover:brightness-110 transition">
            Get API Key
          </a>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div className="relative z-10">
      <Nav />
      <Container><Hero /></Container>
      <Container className="bg-[var(--color-bg-alt)]"><Features /></Container>
      <Container><LiveDemo /></Container>
      <Container className="bg-[var(--color-bg-alt)]"><CodeExample /></Container>
      <Container><Pricing /></Container>
      <Container className="bg-[var(--color-bg-alt)]"><Footer /></Container>
    </div>
  )
}
