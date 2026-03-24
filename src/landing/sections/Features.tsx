const features = [
  {
    title: 'Census Data',
    color: 'var(--color-accent-blue)',
    icon: '📊',
    items: [
      'Population & demographics',
      'Median income & housing values',
      'Education & employment',
      'Community risk scoring',
    ],
  },
  {
    title: 'Weather & Climate',
    color: 'var(--color-accent-green)',
    icon: '🌤',
    items: [
      'Annual temperature summaries',
      'Monthly climate breakdowns',
      'Precipitation & snowfall',
      'Heating & cooling degree days',
    ],
  },
  {
    title: 'Tax Information',
    color: 'var(--color-accent-amber)',
    icon: '💰',
    items: [
      'Combined sales tax rates',
      'State income tax brackets',
      'Property & excise taxes',
      'IRS income statistics',
    ],
  },
  {
    title: 'Crime Statistics',
    color: 'var(--color-accent-red)',
    icon: '🛡',
    items: [
      'Violent crime rates',
      'Property crime rates',
      'Year-over-year trends',
      'Per-capita crime totals',
    ],
  },
  {
    title: 'Cost of Living',
    color: '#06b6d4',
    icon: '🏠',
    items: [
      'Fair market rents by bedroom',
      'Housing cost breakdowns',
      'Regional price indices',
      'Rent-to-income ratios',
    ],
  },
]

export default function Features() {
  return (
    <section className="px-6 sm:px-8 py-28 sm:py-36 bg-[var(--color-bg-secondary)]">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
          Five Data Sources, One Endpoint
        </h2>
        <p className="text-center text-lg text-[var(--color-text-secondary)] mb-20 max-w-2xl mx-auto leading-relaxed">
          Get a comprehensive location profile by combining data from five authoritative sources — all normalized and ready to use.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-8 transition-all duration-300 hover:border-[var(--color-border-glow)] hover:bg-[var(--color-bg-card-hover)]"
              style={{
                boxShadow: `0 0 0 0 ${f.color}`,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px -10px ${f.color}`
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${f.color}`
              }}
            >
              <div className="text-4xl mb-6">{f.icon}</div>
              <h3
                className="text-lg font-semibold mb-5"
                style={{ color: f.color }}
              >
                {f.title}
              </h3>
              <ul className="space-y-3.5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {f.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
