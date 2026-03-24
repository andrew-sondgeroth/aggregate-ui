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
    <section id="pricing" className="py-24 sm:py-32 border-t border-[var(--color-border)]">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">
          Simple Pricing
        </h2>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
          Start free. Scale as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className={`rounded-2xl border p-8 flex flex-col ${
              t.highlighted
                ? 'border-[var(--color-accent-blue)] bg-[var(--color-bg-card)] shadow-lg shadow-[var(--color-accent-blue)]/10 ring-1 ring-[var(--color-accent-blue)]/20'
                : 'border-[var(--color-border)] bg-[var(--color-bg-card)]'
            }`}
          >
            {t.highlighted && (
              <div className="inline-flex self-start rounded-full bg-[var(--color-accent-blue)]/15 px-3 py-1 text-xs font-semibold text-[var(--color-accent-blue)] uppercase tracking-wider mb-4">
                Most Popular
              </div>
            )}
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">{t.tier}</h3>
            <div className="mt-3">
              <span className="text-4xl font-bold text-[var(--color-text-primary)]">{t.price}</span>
              <span className="ml-1 text-[var(--color-text-muted)]">/month</span>
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
              className={`mt-8 block text-center rounded-xl px-6 py-3.5 font-semibold transition ${
                t.highlighted
                  ? 'bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] text-white hover:brightness-110'
                  : 'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)]'
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
