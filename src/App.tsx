import Hero from './landing/sections/Hero'
import Features from './landing/sections/Features'
import LiveDemo from './landing/sections/LiveDemo'
import CodeExample from './landing/sections/CodeExample'
import Pricing from './landing/sections/Pricing'
import Footer from './landing/sections/Footer'

function Nav() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-xl">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-lg bg-[var(--color-accent-gold)] flex items-center justify-center text-[var(--color-bg-primary)] font-bold text-sm">A</span>
          <span className="font-semibold text-[var(--color-text-primary)] tracking-tight">Aggregate API</span>
        </a>
        <div className="hidden sm:flex items-center gap-8 text-sm">
          <a href="#features" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">Features</a>
          <a href="#demo" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">Demo</a>
          <a href="#pricing" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">Pricing</a>
          <a href={`${apiBaseUrl}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">Docs</a>
          <a href="#pricing" className="rounded-lg bg-[var(--color-accent-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-bg-primary)] hover:brightness-110 transition">
            Get API Key
          </a>
        </div>
      </div>
    </nav>
  )
}

function SectionBreak() {
  return <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16"><hr className="border-[var(--color-border)]" /></div>
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center relative">
      <Nav />
      <div className="w-full max-w-[1280px] px-6 sm:px-10 lg:px-16">
        <Hero />
      </div>
      <SectionBreak />
      <div className="w-full bg-[var(--color-bg-secondary)]/40">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
          <Features />
        </div>
      </div>
      <SectionBreak />
      <div className="w-full max-w-[1280px] px-6 sm:px-10 lg:px-16">
        <LiveDemo />
      </div>
      <SectionBreak />
      <div className="w-full bg-[var(--color-bg-secondary)]/40">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
          <CodeExample />
        </div>
      </div>
      <SectionBreak />
      <div className="w-full max-w-[1280px] px-6 sm:px-10 lg:px-16">
        <Pricing />
      </div>
      <div className="w-full max-w-[1280px] px-6 sm:px-10 lg:px-16">
        <Footer />
      </div>
    </div>
  )
}
