export default function Hero() {
  return (
    <section className="relative py-32 sm:py-44 text-center">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-[var(--color-accent-blue)]/15 to-[var(--color-accent-purple)]/15 rounded-full blur-[120px] -z-10" />

      <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-2 text-sm text-[var(--color-text-secondary)]">
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
        REST API — 80+ searchable fields
      </div>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
        <span className="bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] bg-clip-text text-transparent">
          Location Intelligence
        </span>
        <br />
        <span className="text-[var(--color-text-primary)]">API</span>
      </h1>

      <p className="mt-8 text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
        Census, weather, tax, crime, and cost-of-living data for any US ZIP code — one API call.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#pricing"
          className="rounded-xl bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--color-accent-blue)]/25 transition hover:brightness-110"
        >
          Get API Key
        </a>
        <a
          href="#demo"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-8 py-3.5 text-base font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-border-glow)]"
        >
          Try Live Demo
        </a>
      </div>

      <div className="mt-16 mx-auto max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 text-left font-mono text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-3 w-3 rounded-full bg-[var(--color-accent-red)]/60" />
          <span className="h-3 w-3 rounded-full bg-[var(--color-accent-amber)]/60" />
          <span className="h-3 w-3 rounded-full bg-[var(--color-accent-green)]/60" />
        </div>
        <code>
          <span className="text-[var(--color-accent-purple)]">curl</span>{' '}
          <span className="text-[var(--color-accent-green)]">
            /api/v1/location-profile?zip=90210
          </span>{' '}
          <span className="text-[var(--color-text-muted)]">\</span>
          <br />
          {'  '}<span className="text-[var(--color-accent-blue)]">-H</span>{' '}
          <span className="text-[var(--color-accent-amber)]">"X-API-Key: your-key"</span>
        </code>
      </div>
    </section>
  )
}
