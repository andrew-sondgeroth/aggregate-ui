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
    <section id="pricing" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="text-center mb-[64px]">
        <p className="text-[13px] font-semibold tracking-[0.25em] uppercase text-[var(--color-gold)] mb-[16px]">
          Pricing
        </p>
        <h2 className="font-[var(--font-display)] text-[34px] sm:text-[40px] lg:text-[48px] text-[var(--color-text)] leading-[1.15]">
          Simple, transparent pricing
        </h2>
        <p className="mt-[20px] text-[16px] text-[var(--color-text-sub)] leading-[1.7]">
          Start free. Scale as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className={`relative rounded-2xl border p-[32px] flex flex-col transition-all duration-300 ${
              t.highlighted
                ? 'border-[var(--color-gold)]/40 bg-[var(--color-bg-card)] shadow-2xl shadow-[var(--color-gold)]/5 ring-1 ring-[var(--color-gold)]/10'
                : 'border-[var(--color-border)] bg-[var(--color-bg-card)] hover:border-[var(--color-border-hover)]'
            }`}
          >
            <div className="flex items-center gap-3 mb-[4px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-dim)]">
                {t.tier}
              </p>
              {t.highlighted && (
                <span className="rounded-full bg-[var(--color-gold)] px-[12px] py-[3px] text-[10px] font-bold text-[var(--color-bg-base)] uppercase tracking-wider">
                  Popular
                </span>
              )}
            </div>

            <div className="mt-[24px]">
              <span className="font-[var(--font-display)] text-[48px] leading-[1] text-[var(--color-text)]">{t.price}</span>
              <span className="ml-[8px] text-[14px] text-[var(--color-text-dim)]">/month</span>
            </div>

            <p className="mt-[12px] text-[14px] text-[var(--color-text-sub)]">{t.limit}</p>

            <ul className="mt-[32px] space-y-[16px] flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-[12px] text-[14px] text-[var(--color-text-sub)]">
                  <span className="text-[var(--color-green)] mt-0.5 flex-shrink-0">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#"
              className={`mt-[32px] block text-center rounded-xl px-[24px] py-[16px] font-semibold text-[14px] transition ${
                t.highlighted
                  ? 'bg-[var(--color-gold)] text-[var(--color-bg-base)] hover:brightness-110 shadow-lg shadow-[var(--color-gold)]/15'
                  : 'border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-hover)]'
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
