export default function Hero() {
  return (
    <section className="relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[var(--color-gold)]/6 rounded-full blur-[180px] pointer-events-none" />

      <div
        className="relative"
        style={{ paddingTop: '160px', paddingBottom: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
      >
        <div className="rise">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-5 py-2 text-[13px] font-medium tracking-widest uppercase text-[var(--color-text-sub)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
            REST API &middot; 80+ searchable fields
          </span>
        </div>

        <h1 style={{ marginTop: '48px' }} className="rise rise-d1">
          <span className="block font-[var(--font-display)] text-[48px] sm:text-[64px] lg:text-[80px] leading-[1.05] text-[var(--color-text)]">
            Location Intelligence
          </span>
          <span className="block font-[var(--font-display)] italic text-[48px] sm:text-[64px] lg:text-[80px] leading-[1.05] text-[var(--color-gold)] mt-1">
            API
          </span>
        </h1>

        <p
          className="text-[18px] text-[var(--color-text-sub)] leading-[1.7] rise rise-d2"
          style={{ marginTop: '32px', maxWidth: '540px' }}
        >
          Census, weather, tax, crime, cost&#8209;of&#8209;living, and voting data
          for any US ZIP code — one API call.
        </p>

        <div style={{ marginTop: '48px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }} className="rise rise-d3">
          <a
            href="#pricing"
            className="rounded-xl bg-[var(--color-gold)] px-9 py-4 text-[16px] font-semibold text-[var(--color-bg-base)] shadow-lg shadow-[var(--color-gold)]/15 hover:brightness-110 transition"
          >
            Get API Key
          </a>
          <a
            href="#demo"
            className="rounded-xl border border-[var(--color-border)] px-9 py-4 text-[16px] font-semibold text-[var(--color-text)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-alt)] transition"
          >
            Try Live Demo
          </a>
        </div>

        <div
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] overflow-hidden text-left rise rise-d4"
          style={{ marginTop: '80px', width: '100%', maxWidth: '520px' }}
        >
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[var(--color-border)]">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span style={{ marginLeft: '16px' }} className="text-[12px] text-[var(--color-text-dim)] font-[var(--font-mono)]">terminal</span>
          </div>
          <div className="px-6 py-5 font-[var(--font-mono)] text-[14px] text-[var(--color-text-sub)] leading-[1.8]">
            <span className="text-[var(--color-gold)]">$</span>{' '}
            <span className="text-[var(--color-blue)]">curl</span>{' '}
            <span className="text-[var(--color-green)]">/api/v1/location-profile?zip=90210</span>{' '}
            <span className="text-[var(--color-text-dim)]">\</span>
            <br />
            {'    '}<span className="text-[var(--color-cyan)]">-H</span>{' '}
            <span className="text-[var(--color-amber)]">"X-API-Key: your-key"</span>
          </div>
        </div>
      </div>
    </section>
  )
}
