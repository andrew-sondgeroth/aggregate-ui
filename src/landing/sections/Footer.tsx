export default function Footer() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

  return (
    <footer className="border-t border-[var(--color-border)] py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Aggregate API
        </div>
        <div className="flex gap-6 text-sm">
          <a href={`${apiBaseUrl}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">
            API Docs
          </a>
          <a href="#pricing" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">
            Pricing
          </a>
          <a href="#demo" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition">
            Demo
          </a>
        </div>
      </div>
    </footer>
  )
}
