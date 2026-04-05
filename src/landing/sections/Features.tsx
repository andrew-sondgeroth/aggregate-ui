const features = [
  {
    title: 'Census Data',
    accent: 'var(--color-blue)',
    icon: '📊',
    items: ['Population & demographics', 'Median income & housing values', 'Education & employment', 'Community risk scoring'],
  },
  {
    title: 'Weather & Climate',
    accent: 'var(--color-teal)',
    icon: '🌤',
    items: ['Annual temperature summaries', 'Monthly climate breakdowns', 'Precipitation & snowfall', 'Heating & cooling degree days'],
  },
  {
    title: 'Tax Information',
    accent: 'var(--color-gold)',
    icon: '💰',
    items: ['Combined sales tax rates', 'State income tax brackets', 'Property & excise taxes', 'IRS income statistics'],
  },
  {
    title: 'Crime Statistics',
    accent: 'var(--color-red)',
    icon: '🛡',
    items: ['Violent crime rates', 'Property crime rates', 'Year-over-year trends', 'Per-capita crime totals'],
  },
  {
    title: 'Cost of Living',
    accent: 'var(--color-cyan)',
    icon: '🏠',
    items: ['Fair market rents by bedroom', 'Housing cost breakdowns', 'Regional price indices', 'Rent-to-income ratios'],
  },
  {
    title: 'Voting & Elections',
    accent: 'var(--color-purple)',
    icon: '🗳',
    items: ['Presidential election history', 'Partisan lean & trends', 'Congressional district results', 'State officials & legislature'],
  },
  {
    title: 'Business Activity',
    accent: 'var(--color-amber)',
    icon: '🏢',
    items: ['Total establishments & employees', 'Annual payroll data', 'Industry sector breakdown', 'Top industries by employment'],
  },
]

export default function Features() {
  return (
    <section id="features" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="text-center mb-[64px]">
        <p className="text-[13px] font-semibold tracking-[0.25em] uppercase text-[var(--color-gold)] mb-[16px]">
          Data Sources
        </p>
        <h2 className="font-[var(--font-display)] text-[34px] sm:text-[40px] lg:text-[48px] text-[var(--color-text)] leading-[1.15]">
          Every data point, one endpoint
        </h2>
        <p className="mt-[20px] text-[16px] text-[var(--color-text-sub)] leading-[1.7] max-w-[540px] mx-auto">
          Comprehensive location profiles from authoritative federal sources — normalized and ready to use.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-[32px] transition-all duration-300 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card-hover)]"
          >
            <div
              className="absolute left-0 top-[32px] bottom-[32px] w-[3px] rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: f.accent }}
            />
            <div className="pl-[16px]">
              <div className="flex items-center gap-3 mb-[20px]">
                <span className="text-[24px]">{f.icon}</span>
                <h3 className="text-[15px] font-semibold" style={{ color: f.accent }}>
                  {f.title}
                </h3>
              </div>
              <ul className="space-y-[12px] text-[14px] text-[var(--color-text-sub)] leading-[1.6]">
                {f.items.map((item) => (
                  <li key={item} className="flex items-start gap-[10px]">
                    <span
                      className="mt-[8px] h-[4px] w-[4px] rounded-full flex-shrink-0"
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
