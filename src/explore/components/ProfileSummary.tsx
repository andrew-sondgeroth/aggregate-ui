import { useState, memo } from 'react'
import type { LocationProfileResponse } from '../../api/types'
import ProfileCard from '../../shared/components/ProfileCard'
import { formatCurrency, formatPercent, formatNumber, formatTemp, formatRate, safeFixed } from '../../shared/utils/formatters'

interface ProfileSummaryProps {
  data: LocationProfileResponse
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 text-[12px] uppercase tracking-[0.15em] font-semibold text-[var(--color-text-sub)] hover:text-[var(--color-text)] transition"
        aria-expanded={open}
        aria-label={`${title} section`}
      >
        {title}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 grid grid-cols-2 gap-3">
          {children}
        </div>
      )}
    </div>
  )
}

function Unavailable({ name }: { name: string }) {
  return (
    <div className="px-5 pb-4 text-[13px] text-[var(--color-text-dim)]">
      {name} data unavailable
    </div>
  )
}

export default memo(function ProfileSummary({ data }: ProfileSummaryProps) {
  return (
    <div>
      {data.area ? (
        <Section title="Area">
          <ProfileCard label="Population" value={formatNumber(data.area.population.total_population)} />
          <ProfileCard label="Median Age" value={safeFixed(data.area.demographics.median_age)} />
          <ProfileCard label="Median Income" value={formatCurrency(data.area.economic.median_household_income)} />
          <ProfileCard label="Home Value" value={formatCurrency(data.area.housing.median_home_value)} />
        </Section>
      ) : (
        <Section title="Area"><Unavailable name="Census" /></Section>
      )}

      {data.climate ? (
        <Section title="Climate">
          <ProfileCard label="Avg Temp" value={formatTemp(data.climate.annual_summary.avg_temp)} />
          <ProfileCard label="Summer High" value={formatTemp(data.climate.annual_summary.summer_avg_high)} />
          <ProfileCard label="Winter Low" value={formatTemp(data.climate.annual_summary.winter_avg_low)} />
          <ProfileCard label="Annual Precip" value={`${safeFixed(data.climate.annual_summary.total_precipitation)}"`} />
        </Section>
      ) : (
        <Section title="Climate"><Unavailable name="Weather" /></Section>
      )}

      {data.tax ? (
        <Section title="Tax">
          <ProfileCard label="Sales Tax" value={formatPercent(data.tax.sales_tax.combined_rate)} />
          <ProfileCard label="Top Income Rate" value={formatPercent(data.tax.state_income_tax.top_marginal_rate)} />
          <ProfileCard label="Avg AGI" value={formatCurrency(data.tax.irs_income_stats?.avg_agi)} />
          <ProfileCard label="Eff. Fed Rate" value={formatPercent(data.tax.irs_income_stats?.effective_federal_rate)} />
        </Section>
      ) : (
        <Section title="Tax"><Unavailable name="Tax" /></Section>
      )}

      {data.crime ? (
        <Section title="Crime">
          <ProfileCard label="Total Crime" value={formatRate(data.crime.summary.total_crime_rate)} subtext="per 100k" />
          <ProfileCard label="Violent Crime" value={formatRate(data.crime.violent_crime.violent_crime_rate)} subtext="per 100k" />
          <ProfileCard label="Property Crime" value={formatRate(data.crime.property_crime.property_crime_rate)} subtext="per 100k" />
          <ProfileCard label="Murder Rate" value={formatRate(data.crime.violent_crime.murder_rate)} subtext="per 100k" />
        </Section>
      ) : (
        <Section title="Crime"><Unavailable name="Crime" /></Section>
      )}

      {data.cost ? (
        <Section title="Cost of Living">
          <ProfileCard label="Cost Index" value={safeFixed(data.cost.price_indices?.overall)} subtext="100 = national avg" />
          <ProfileCard label="Median Rent" value={formatCurrency(data.cost.housing_costs.median_gross_rent)} />
          <ProfileCard label="Home Value" value={formatCurrency(data.cost.housing_costs.median_home_value)} />
          <ProfileCard label="Rent/Income" value={formatPercent(data.cost.affordability?.rent_to_income_ratio)} />
        </Section>
      ) : (
        <Section title="Cost of Living"><Unavailable name="Cost" /></Section>
      )}

      {data.voting ? (
        <Section title="Voting">
          <ProfileCard label="Partisan Lean" value={data.voting.partisan_summary?.lean_label ?? 'N/A'} subtext={data.voting.partisan_summary ? `${data.voting.partisan_summary.partisan_lean > 0 ? '+' : ''}${data.voting.partisan_summary.partisan_lean.toFixed(1)}` : undefined} />
          <ProfileCard label="Competitiveness" value={safeFixed(data.voting.partisan_summary?.competitive_index)} subtext="0 = safe, 100 = toss-up" />
          <ProfileCard label="Governor" value={data.voting.state_officials?.governor?.name ?? 'N/A'} subtext={data.voting.state_officials?.governor?.party} />
          <ProfileCard label="Trifecta" value={data.voting.state_officials?.state_legislature?.trifecta ?? 'N/A'} />
        </Section>
      ) : (
        <Section title="Voting"><Unavailable name="Voting" /></Section>
      )}
    </div>
  )
})
