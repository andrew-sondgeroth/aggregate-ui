export default function Footer() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  return (
    <footer className="border-t border-[var(--color-border)] py-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-lg bg-[var(--color-accent-gold)] flex items-center justify-center text-[var(--color-bg-primary)] font-bold text-sm">A</span>
          <span className="font-semibold text-[var(--color-text-primary)] tracking-tight">Aggregate API</span>
        </div>
        <div className="flex gap-8 text-sm">
          <a href={`${apiBaseUrl}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
            API Docs
          </a>
          <a href="#pricing" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
            Pricing
          </a>
          <a href="#demo" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition">
            Demo
          </a>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Aggregate API. Location data from Census Bureau, NOAA, IRS, FBI UCR, HUD.
        </p>
      </div>
    </footer>
  )
}
