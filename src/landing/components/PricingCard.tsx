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
      className={`rounded-xl border p-6 sm:p-8 flex flex-col ${
        highlighted
          ? 'border-[var(--color-accent-blue)] bg-[var(--color-bg-card)] shadow-lg shadow-[var(--color-accent-blue)]/10 relative'
          : 'border-[var(--color-border)] bg-[var(--color-bg-card)]'
      }`}
    >
      {highlighted && (
        <div className="text-xs font-semibold text-[var(--color-accent-blue)] uppercase tracking-wide mb-6">
          Most Popular
        </div>
      )}
      <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{tier}</h3>
      <div className="mt-4">
        <span className="text-4xl font-bold text-[var(--color-text-primary)]">{price}</span>
        <span className="ml-1 text-[var(--color-text-muted)]">/month</span>
      </div>
      <div className="mt-3 text-sm text-[var(--color-text-secondary)]">{limit}</div>

      <ul className="mt-8 space-y-4 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-accent-green)] mt-0.5 flex-shrink-0">&#10003;</span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href="#"
        className={`mt-8 block text-center rounded-lg px-6 py-3.5 font-semibold transition ${
          highlighted
            ? 'bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] text-white hover:brightness-110'
            : 'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-glow)]'
        }`}
      >
        Get Started
      </a>
    </div>
  )
}
