const tiers = [
  {
    tier: 'Free',
    price: '$0',
    limit: '100 requests / day',
    features: ['All endpoints', 'Location profiles', 'Location search', 'Community support'],
  },
  {
    tier: 'Basic',
    price: '$29',
    limit: '1,000 requests / day',
    features: ['Everything in Free', 'Higher rate limits', 'Priority support', 'Usage analytics'],
    highlighted: true,
  },
  {
    tier: 'Pro',
    price: '$99',
    limit: '10,000 requests / day',
    features: ['Everything in Basic', 'Highest rate limits', 'Dedicated support', 'SLA guarantee'],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 sm:py-40">
      <div className="mb-20 animate-fade-up">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-gold)] mb-3">Pricing</p>
        <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[var(--color-text-primary)]">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-base text-[var(--color-text-secondary)]">
          Start free. Scale as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiers.map((t, i) => (
          <div
            key={t.tier}
            className={`animate-fade-up delay-${(i + 1) * 100} relative rounded-2xl border p-8 flex flex-col transition-all duration-300 ${
              t.highlighted
                ? 'border-[var(--color-accent-gold)]/50 bg-[var(--color-bg-card)] shadow-xl shadow-[var(--color-accent-gold)]/5 ring-1 ring-[var(--color-accent-gold)]/15'
                : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)]'
            }`}
          >
            {t.highlighted && (
              <div className="absolute -top-3 left-8">
                <span className="inline-flex rounded-full bg-[var(--color-accent-gold)] px-3 py-1 text-xs font-bold text-[var(--color-bg-primary)] uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
            )}
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{t.tier}</h3>
            <div className="mt-4">
              <span className="font-[var(--font-display)] text-5xl text-[var(--color-text-primary)]">{t.price}</span>
              <span className="ml-1.5 text-sm text-[var(--color-text-muted)]">/month</span>
            </div>
            <div className="mt-2 text-sm text-[var(--color-text-secondary)]">{t.limit}</div>

            <ul className="mt-8 space-y-3 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-accent-green)] mt-0.5 flex-shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#"
              className={`mt-8 block text-center rounded-xl px-6 py-3.5 font-semibold text-sm transition ${
                t.highlighted
                  ? 'bg-[var(--color-accent-gold)] text-[var(--color-bg-primary)] hover:brightness-110 shadow-md shadow-[var(--color-accent-gold)]/20'
                  : 'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-hover)]'
              }`}
            >
              Get Started
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
