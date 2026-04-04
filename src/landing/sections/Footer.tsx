export default function Footer() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://aggregateapi-production.up.railway.app'

  return (
    <footer className="py-[80px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[32px]">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-lg bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-bg-base)] font-bold text-[14px]">A</span>
          <span className="font-semibold text-[var(--color-text)] tracking-tight">Aggregate API</span>
        </div>
        <div className="flex gap-[40px] text-[14px] text-[var(--color-text-dim)]">
          <a href={`${apiBaseUrl}/swagger-ui.html`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition">API Docs</a>
          <a href="#pricing" className="hover:text-[var(--color-text)] transition">Pricing</a>
          <a href="#demo" className="hover:text-[var(--color-text)] transition">Demo</a>
        </div>
      </div>
      <div className="mt-[48px] pt-[32px] border-t border-[var(--color-border)]">
        <p className="text-[12px] text-[var(--color-text-dim)]">
          &copy; {new Date().getFullYear()} Aggregate API. Data sourced from Census Bureau, NOAA, IRS, FBI UCR, and HUD.
        </p>
      </div>
    </footer>
  )
}
