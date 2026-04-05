import { useState, memo } from 'react'
import type { LocationProfileResponse } from '../../api/types'
import ProfileCard from '../../shared/components/ProfileCard'
import { formatCurrency, formatPercent, formatNumber, formatTemp, formatRate, safeFixed } from '../../shared/utils/formatters'

interface ProfileSummaryProps {
  data: LocationProfileResponse
}

const SECTION_ICONS: Record<string, string> = {
  'Area': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  'Climate': 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
  'Tax': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'Crime': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  'Cost of Living': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  'Voting': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  'Business': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const iconPath = SECTION_ICONS[title]

  return (
    <div className="mx-3 mt-3 first:mt-0 rounded-xl border border-[var(--color-border)] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold transition ${
          open
            ? 'bg-[var(--color-bg-card)] text-[var(--color-text)]'
            : 'bg-[var(--color-bg-alt)] text-[var(--color-text-sub)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-card)]'
        }`}
        aria-expanded={open}
        aria-label={`${title} section`}
      >
        {iconPath && (
          <svg className="w-4 h-4 shrink-0 text-[var(--color-text-dim)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
          </svg>
        )}
        <span className="flex-1 text-left">{title}</span>
        <svg className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 py-3 grid grid-cols-2 gap-3 bg-[var(--color-bg-base)]/50">
          {children}
        </div>
      )}
    </div>
  )
}

function Unavailable({ name }: { name: string }) {
  return (
    <div className="col-span-2 text-[13px] text-[var(--color-text-dim)] text-center py-2">
      {name} data unavailable
    </div>
  )
}

export default memo(function ProfileSummary({ data }: ProfileSummaryProps) {
  return (
    <div className="pb-3">
      {data.area ? (
        <Section title="Area" defaultOpen>
          <ProfileCard label="Population" value={formatNumber(data.area.population.total_population)} tooltip="Total number of people living in this ZIP code area (Census ACS estimate)" />
          <ProfileCard label="Median Age" value={safeFixed(data.area.demographics.median_age)} tooltip="The age where half the population is older and half is younger" />
          <ProfileCard label="Median Income" value={formatCurrency(data.area.economic.median_household_income)} tooltip="Median annual household income — half of households earn more, half earn less" />
          <ProfileCard label="Home Value" value={formatCurrency(data.area.housing.median_home_value)} tooltip="Median value of owner-occupied housing units" />
        </Section>
      ) : (
        <Section title="Area"><Unavailable name="Census" /></Section>
      )}

      {data.climate ? (
        <Section title="Climate">
          <ProfileCard label="Avg Temp" value={formatTemp(data.climate.annual_summary.avg_temp)} tooltip="Average annual temperature based on 30-year climate normals from the nearest NOAA weather station" />
          <ProfileCard label="Summer High" value={formatTemp(data.climate.annual_summary.summer_avg_high)} tooltip="Average daily high temperature during June, July, and August" />
          <ProfileCard label="Winter Low" value={formatTemp(data.climate.annual_summary.winter_avg_low)} tooltip="Average daily low temperature during December, January, and February" />
          <ProfileCard label="Annual Precip" value={`${safeFixed(data.climate.annual_summary.total_precipitation)}"`} tooltip="Total annual precipitation (rain + melted snow) in inches" />
        </Section>
      ) : (
        <Section title="Climate"><Unavailable name="Weather" /></Section>
      )}

      {data.tax ? (
        <Section title="Tax">
          <ProfileCard label="Sales Tax" value={formatPercent(data.tax.sales_tax.combined_rate)} tooltip="Combined state + county + city sales tax rate applied to purchases" />
          <ProfileCard label="Top Income Rate" value={formatPercent(data.tax.state_income_tax.top_marginal_rate)} tooltip="Highest marginal state income tax rate (0% if no state income tax)" />
          <ProfileCard label="Avg AGI" value={formatCurrency(data.tax.irs_income_stats?.avg_agi)} tooltip="Average adjusted gross income from IRS tax returns filed in this ZIP code" />
          <ProfileCard label="Eff. Fed Rate" value={formatPercent(data.tax.irs_income_stats?.effective_federal_rate)} tooltip="Average effective federal tax rate — total federal tax paid divided by AGI" />
        </Section>
      ) : (
        <Section title="Tax"><Unavailable name="Tax" /></Section>
      )}

      {data.crime ? (
        <Section title="Crime">
          <ProfileCard label="Total Crime" value={formatRate(data.crime.summary.total_crime_rate)} subtext="per 100k" tooltip="Combined violent and property crime incidents per 100,000 people (FBI UCR data, state-level)" />
          <ProfileCard label="Violent Crime" value={formatRate(data.crime.violent_crime.violent_crime_rate)} subtext="per 100k" tooltip="Violent crimes (murder, rape, robbery, aggravated assault) per 100,000 people" />
          <ProfileCard label="Property Crime" value={formatRate(data.crime.property_crime.property_crime_rate)} subtext="per 100k" tooltip="Property crimes (burglary, larceny, motor vehicle theft) per 100,000 people" />
          <ProfileCard label="Murder Rate" value={formatRate(data.crime.violent_crime.murder_rate)} subtext="per 100k" tooltip="Murder and non-negligent manslaughter per 100,000 people" />
        </Section>
      ) : (
        <Section title="Crime"><Unavailable name="Crime" /></Section>
      )}

      {data.cost ? (
        <Section title="Cost of Living">
          <ProfileCard label="Cost Index" value={safeFixed(data.cost.price_indices?.overall)} subtext="100 = national avg" tooltip="Regional price parity index — 100 is the national average. Higher means more expensive." />
          <ProfileCard label="Median Rent" value={formatCurrency(data.cost.housing_costs.median_gross_rent)} tooltip="Median monthly gross rent including utilities for renter-occupied units" />
          <ProfileCard label="Home Value" value={formatCurrency(data.cost.housing_costs.median_home_value)} tooltip="Median value of owner-occupied housing units in this area" />
          <ProfileCard label="Rent/Income" value={formatPercent(data.cost.affordability?.rent_to_income_ratio)} tooltip="Annual rent as a ratio of average adjusted gross income — lower is more affordable" />
        </Section>
      ) : (
        <Section title="Cost of Living"><Unavailable name="Cost" /></Section>
      )}

      {data.voting ? (
        <Section title="Voting">
          <ProfileCard label="Partisan Lean" value={data.voting.partisan_summary?.lean_label ?? 'N/A'} subtext={data.voting.partisan_summary ? `${data.voting.partisan_summary.partisan_lean > 0 ? '+' : ''}${data.voting.partisan_summary.partisan_lean.toFixed(1)}` : undefined} tooltip="Average partisan lean across recent presidential elections. Positive = Democratic, negative = Republican." />
          <ProfileCard label="Competitiveness" value={safeFixed(data.voting.partisan_summary?.competitive_index)} subtext="0 = safe, 100 = toss-up" tooltip="How competitive elections are in this area. 100 = perfectly split, 0 = one party dominates." />
          <ProfileCard label="Governor" value={data.voting.state_officials?.governor?.name ?? 'N/A'} subtext={data.voting.state_officials?.governor?.party} tooltip="Current state governor and their political party" />
          <ProfileCard label="Trifecta" value={data.voting.state_officials?.state_legislature?.trifecta ?? 'N/A'} tooltip="Whether one party controls the governorship and both legislative chambers, or if power is divided" />
        </Section>
      ) : (
        <Section title="Voting"><Unavailable name="Voting" /></Section>
      )}

      {data.business ? (
        <Section title="Business">
          <ProfileCard label="Establishments" value={formatNumber(data.business.summary.total_establishments)} tooltip="Total number of business establishments in this ZIP code (Census County Business Patterns)" />
          <ProfileCard label="Employees" value={formatNumber(data.business.summary.total_employees)} tooltip="Total number of employees across all establishments" />
          <ProfileCard label="Annual Payroll" value={formatCurrency(data.business.summary.total_annual_payroll)} tooltip="Total annual payroll across all establishments" />
          {data.business.top_industries?.[0] && (
            <ProfileCard label="Top Industry" value={data.business.top_industries[0].name} subtext={`${formatNumber(data.business.top_industries[0].employees)} employees`} tooltip="Largest industry by employment in this ZIP code" />
          )}
        </Section>
      ) : (
        <Section title="Business"><Unavailable name="Business" /></Section>
      )}
    </div>
  )
})
