const features = [
  {
    title: 'Census Data',
    accent: 'var(--color-accent-blue)',
    icon: '📊',
    items: ['Population & demographics', 'Median income & housing values', 'Education & employment', 'Community risk scoring'],
  },
  {
    title: 'Weather & Climate',
    accent: 'var(--color-accent-teal)',
    icon: '🌤',
    items: ['Annual temperature summaries', 'Monthly climate breakdowns', 'Precipitation & snowfall', 'Heating & cooling degree days'],
  },
  {
    title: 'Tax Information',
    accent: 'var(--color-accent-gold)',
    icon: '💰',
    items: ['Combined sales tax rates', 'State income tax brackets', 'Property & excise taxes', 'IRS income statistics'],
  },
  {
    title: 'Crime Statistics',
    accent: 'var(--color-accent-red)',
    icon: '🛡',
    items: ['Violent crime rates', 'Property crime rates', 'Year-over-year trends', 'Per-capita crime totals'],
  },
  {
    title: 'Cost of Living',
    accent: 'var(--color-accent-cyan)',
    icon: '🏠',
    items: ['Fair market rents by bedroom', 'Housing cost breakdowns', 'Regional price indices', 'Rent-to-income ratios'],
  },
  {
    title: 'Voting & Elections',
    accent: 'var(--color-accent-purple)',
    icon: '🗳',
    items: ['Presidential election history', 'Partisan lean & trends', 'Congressional district results', 'State officials & legislature'],
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 border-t border-[var(--color-border)]">
      <div className="mb-16 animate-fade-up">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--color-accent-gold)] mb-3">Data Sources</p>
        <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl lg:text-5xl text-[var(--color-text-primary)]">
          Every data point, one endpoint
        </h2>
        <p className="mt-4 text-base text-[var(--color-text-secondary)] max-w-lg">
          Comprehensive location profiles from authoritative federal sources — normalized and ready to use.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`animate-fade-up delay-${(i + 1) * 100} group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-7 transition-all duration-300 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card-hover)]`}
          >
            {/* Accent left bar */}
            <div
              className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: f.accent }}
            />
            <div className="pl-3">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="text-base font-semibold" style={{ color: f.accent }}>
                  {f.title}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[var(--color-text-secondary)]">
                {f.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-[7px] h-1 w-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: f.accent }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
