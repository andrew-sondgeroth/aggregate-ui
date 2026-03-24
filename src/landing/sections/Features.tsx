const features = [
  {
    title: 'Census Data',
    color: 'var(--color-accent-blue)',
    icon: '📊',
    items: ['Population & demographics', 'Median income & housing values', 'Education & employment', 'Community risk scoring'],
  },
  {
    title: 'Weather & Climate',
    color: 'var(--color-accent-green)',
    icon: '🌤',
    items: ['Annual temperature summaries', 'Monthly climate breakdowns', 'Precipitation & snowfall', 'Heating & cooling degree days'],
  },
  {
    title: 'Tax Information',
    color: 'var(--color-accent-amber)',
    icon: '💰',
    items: ['Combined sales tax rates', 'State income tax brackets', 'Property & excise taxes', 'IRS income statistics'],
  },
  {
    title: 'Crime Statistics',
    color: 'var(--color-accent-red)',
    icon: '🛡',
    items: ['Violent crime rates', 'Property crime rates', 'Year-over-year trends', 'Per-capita crime totals'],
  },
  {
    title: 'Cost of Living',
    color: '#06b6d4',
    icon: '🏠',
    items: ['Fair market rents by bedroom', 'Housing cost breakdowns', 'Regional price indices', 'Rent-to-income ratios'],
  },
]

export default function Features() {
  return (
    <section className="py-24 sm:py-32 border-t border-[var(--color-border)]">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)]">
          Five Data Sources, One Endpoint
        </h2>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto">
          Comprehensive location profiles from five authoritative sources — normalized and ready to use.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 transition-all duration-300 hover:border-[var(--color-border-glow)]"
          >
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: f.color }}>
              {f.title}
            </h3>
            <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
              {f.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
