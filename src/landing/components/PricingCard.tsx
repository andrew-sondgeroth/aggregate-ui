interface PricingCardProps {
  tier: string
  price: string
  limit: string
  features: string[]
  highlighted?: boolean
}

export default function PricingCard({ tier, price, limit, features, highlighted }: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl border p-10 sm:p-12 flex flex-col ${
        highlighted
          ? 'border-[var(--color-accent-blue)] bg-[var(--color-bg-card)] shadow-xl shadow-[var(--color-accent-blue)]/15 relative scale-[1.03]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-card)]'
      }`}
    >
      {highlighted && (
        <div className="inline-flex self-start rounded-full bg-[var(--color-accent-blue)]/15 px-4 py-1.5 text-xs font-semibold text-[var(--color-accent-blue)] uppercase tracking-wider mb-8">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{tier}</h3>
      <div className="mt-6">
        <span className="text-6xl font-bold text-[var(--color-text-primary)]">{price}</span>
        <span className="ml-2 text-lg text-[var(--color-text-muted)]">/month</span>
      </div>
      <div className="mt-4 text-base text-[var(--color-text-secondary)]">{limit}</div>

      <ul className="mt-12 space-y-5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-base text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-accent-green)] mt-0.5 flex-shrink-0">&#10003;</span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href="#"
        className={`mt-12 block text-center rounded-xl px-8 py-4 text-lg font-semibold transition ${
          highlighted
            ? 'bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] text-white hover:brightness-110 shadow-lg shadow-[var(--color-accent-blue)]/20'
            : 'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-glow)]'
        }`}
      >
        Get Started
      </a>
    </div>
  )
}
