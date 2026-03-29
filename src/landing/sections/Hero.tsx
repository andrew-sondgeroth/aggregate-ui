export default function Hero() {
  return (
    <section className="relative pt-24 sm:pt-36 pb-28 sm:pb-40 text-center">
      {/* Ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[var(--color-accent-gold)]/8 rounded-full blur-[160px] -z-10" />

      <div className="animate-fade-up">
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-2 text-xs font-medium tracking-wide text-[var(--color-text-secondary)] uppercase">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-green)] animate-pulse" />
          REST API &middot; 80+ searchable fields
        </div>
      </div>

      <h1 className="animate-fade-up delay-100">
        <span className="block font-[var(--font-display)] text-5xl sm:text-6xl lg:text-[5.5rem] leading-[1.05] tracking-tight text-[var(--color-text-primary)]">
          Location Intelligence
        </span>
        <span className="block font-[var(--font-display)] italic text-5xl sm:text-6xl lg:text-[5.5rem] leading-[1.05] text-[var(--color-accent-gold)] mt-1">
          API
        </span>
      </h1>

      <p className="animate-fade-up delay-200 mt-8 text-base sm:text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed">
        Census, weather, tax, crime, cost&#8209;of&#8209;living, and voting data for
        any US ZIP code — one API call.
      </p>

      <div className="animate-fade-up delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#pricing"
          className="rounded-xl bg-[var(--color-accent-gold)] px-8 py-3.5 text-base font-semibold text-[var(--color-bg-primary)] shadow-lg shadow-[var(--color-accent-gold)]/20 transition hover:brightness-110 hover:shadow-[var(--color-accent-gold)]/30"
        >
          Get API Key
        </a>
        <a
          href="#demo"
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-8 py-3.5 text-base font-semibold text-[var(--color-text-primary)] transition hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card)]"
        >
          Try Live Demo
        </a>
      </div>

      {/* Terminal mockup */}
      <div className="animate-fade-up delay-400 mt-16 mx-auto max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-hidden text-left">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--color-border)]">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-4 text-xs text-[var(--color-text-muted)] font-[var(--font-mono)]">terminal</span>
        </div>
        <div className="p-5 font-[var(--font-mono)] text-sm text-[var(--color-text-secondary)] leading-relaxed">
          <code>
            <span className="text-[var(--color-accent-gold)]">$</span>{' '}
            <span className="text-[var(--color-accent-blue)]">curl</span>{' '}
            <span className="text-[var(--color-accent-green)]">
              /api/v1/location-profile?zip=90210
            </span>{' '}
            <span className="text-[var(--color-text-muted)]">\</span>
            <br />
            {'    '}<span className="text-[var(--color-accent-cyan)]">-H</span>{' '}
            <span className="text-[var(--color-accent-amber)]">"X-API-Key: your-key"</span>
          </code>
        </div>
      </div>
    </section>
  )
}
