import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocationProfile } from '../../shared/hooks/useLocationProfile'
import ZipInput from '../../shared/components/ZipInput'
import ProfileCard from '../../shared/components/ProfileCard'
import DataSourceBadge from '../../shared/components/DataSourceBadge'
import { formatCurrency, formatPercent, formatNumber, formatTemp, formatRate } from '../../shared/utils/formatters'
import type { LocationProfileResponse } from '../../api/types'

const TABS = ['Area', 'Climate', 'Tax', 'Crime', 'Cost', 'Voting'] as const
type Tab = (typeof TABS)[number]

export default function LiveDemo() {
  const [activeTab, setActiveTab] = useState<Tab>('Area')
  const { data, loading, error, fetchProfile } = useLocationProfile()

  return (
    <section id="demo" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="text-center mb-[64px]">
        <p className="text-[13px] font-semibold tracking-[0.25em] uppercase text-[var(--color-gold)] mb-[16px]">
          Live Demo
        </p>
        <h2 className="font-[var(--font-display)] text-[34px] sm:text-[40px] lg:text-[48px] text-[var(--color-text)] leading-[1.15]">
          Try it live
        </h2>
        <p className="mt-[20px] text-[16px] text-[var(--color-text-sub)] leading-[1.7] max-w-[480px] mx-auto">
          Enter any US ZIP code to see a real API response across all data sources.
        </p>
      </div>

      <div className="flex justify-center">
        <ZipInput onSubmit={fetchProfile} loading={loading} />
      </div>

      {error && (
        <div className="mt-[24px] text-[var(--color-red)] text-[14px]">{error}</div>
      )}

      {data && (
        <div className="mt-[48px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-[28px] py-[20px] border-b border-[var(--color-border)] bg-[var(--color-bg-alt)]">
            <div className="flex items-center gap-4">
              <span className="font-[var(--font-mono)] text-[14px] font-medium text-[var(--color-gold)]">ZIP {data.zip}</span>
              <span className="text-[12px] text-[var(--color-text-dim)]">{data.generated_at}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(data.data_sources).map(([name, status]) => (
                <DataSourceBadge key={name} name={name} status={status} />
              ))}
            </div>
          </div>

          <div className="flex border-b border-[var(--color-border)]">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 px-4 py-[16px] text-[14px] font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-[var(--color-gold)]'
                    : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-sub)]'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--color-gold)]" />
                )}
              </button>
            ))}
          </div>

          <div className="p-[28px]">
            {activeTab === 'Area' && <AreaTab data={data} />}
            {activeTab === 'Climate' && <ClimateTab data={data} />}
            {activeTab === 'Tax' && <TaxTab data={data} />}
            {activeTab === 'Crime' && <CrimeTab data={data} />}
            {activeTab === 'Cost' && <CostTab data={data} />}
            {activeTab === 'Voting' && <VotingTab data={data} />}
          </div>

          <div className="px-[28px] pb-[20px] flex items-center justify-end gap-4">
            <Link
              to={`/explore?zip=${data.zip}`}
              className="text-[13px] text-[var(--color-text-sub)] hover:text-[var(--color-gold)] transition"
            >
              View on map &rarr;
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

function AreaTab({ data }: { data: LocationProfileResponse }) {
  const area = data.area
  if (!area) return <Unavailable name="Census" />
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
      <ProfileCard label="Population" value={formatNumber(area.population.total_population)} />
      <ProfileCard label="Median Age" value={area.demographics.median_age.toFixed(1)} />
      <ProfileCard label="Median Income" value={formatCurrency(area.economic.median_household_income)} />
      <ProfileCard label="Home Value" value={formatCurrency(area.housing.median_home_value)} />
      <ProfileCard label="Median Rent" value={formatCurrency(area.housing.median_gross_rent)} />
      <ProfileCard label="Unemployment" value={formatPercent(area.economic.unemployment_rate)} />
      <ProfileCard label="Bachelor's+" value={formatPercent(area.education.bachelors_or_higher_percent)} />
      <ProfileCard label="Owner Occupied" value={formatPercent(area.housing.owner_occupied_percent)} />
      <ProfileCard label="Broadband" value={formatPercent(area.internet_access.broadband_percent)} />
      <ProfileCard label="Work From Home" value={formatPercent(area.economic.work_from_home_percent)} />
      <ProfileCard label="Gini Index" value={area.income_distribution.gini_index.toFixed(4)} subtext="Income inequality" />
      <ProfileCard label="Community Risk" value={area.community_risk.risk_tier} subtext={`Score: ${area.community_risk.risk_score.toFixed(1)}/100`} />
    </div>
  )
}

function ClimateTab({ data }: { data: LocationProfileResponse }) {
  const climate = data.climate
  if (!climate) return <Unavailable name="Weather" />
  const annual = climate.annual_summary
  return (
    <div>
      <p className="text-[12px] text-[var(--color-text-dim)] mb-[20px] font-[var(--font-mono)]">
        Station: {climate.nearest_station.name} ({climate.nearest_station.distance_miles.toFixed(1)} mi)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        <ProfileCard label="Avg Temperature" value={formatTemp(annual.avg_temp)} />
        <ProfileCard label="Summer Avg High" value={formatTemp(annual.summer_avg_high)} />
        <ProfileCard label="Winter Avg Low" value={formatTemp(annual.winter_avg_low)} />
        <ProfileCard label="Temp Range" value={formatTemp(annual.temp_range)} />
        <ProfileCard label="Annual Precip" value={`${annual.total_precipitation.toFixed(1)}"`} />
        <ProfileCard label="Annual Snowfall" value={`${annual.total_snowfall.toFixed(1)}"`} />
        <ProfileCard label="Frost-Free Days" value={formatNumber(annual.frost_free_days)} />
        <ProfileCard label="Cooling Degree Days" value={formatNumber(annual.cooling_degree_days)} />
      </div>
    </div>
  )
}

function TaxTab({ data }: { data: LocationProfileResponse }) {
  const tax = data.tax
  if (!tax) return <Unavailable name="Tax" />
  return (
    <div>
      <p className="text-[12px] text-[var(--color-text-dim)] mb-[20px] font-[var(--font-mono)]">State: {tax.state}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        <ProfileCard label="Combined Sales Tax" value={formatPercent(tax.sales_tax.combined_rate)} />
        <ProfileCard label="State Sales Tax" value={formatPercent(tax.sales_tax.state_rate)} />
        <ProfileCard label="Has Income Tax" value={tax.state_income_tax.has_state_income_tax ? 'Yes' : 'No'} />
        <ProfileCard label="Top Marginal Rate" value={formatPercent(tax.state_income_tax.top_marginal_rate)} />
        <ProfileCard label="Gas Tax" value={`${tax.excise_tax.gas_tax_cents_per_gallon}¢/gal`} />
        <ProfileCard label="Has Estate Tax" value={tax.excise_tax.has_estate_tax ? 'Yes' : 'No'} />
        <ProfileCard label="Avg AGI" value={formatCurrency(tax.irs_income_stats.avg_agi)} />
        <ProfileCard label="Effective Fed Rate" value={formatPercent(tax.irs_income_stats.effective_federal_rate)} />
      </div>
    </div>
  )
}

function CrimeTab({ data }: { data: LocationProfileResponse }) {
  const crime = data.crime
  if (!crime) return <Unavailable name="Crime" />
  return (
    <div>
      <p className="text-[12px] text-[var(--color-text-dim)] mb-[20px] font-[var(--font-mono)]">
        {crime.state} — {crime.data_year} data | Population: {formatNumber(crime.summary.population)}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        <ProfileCard label="Total Crime Rate" value={formatRate(crime.summary.total_crime_rate)} subtext="per 100k" />
        <ProfileCard label="Violent Crime" value={formatRate(crime.violent_crime.violent_crime_rate)} subtext="per 100k" />
        <ProfileCard label="Property Crime" value={formatRate(crime.property_crime.property_crime_rate)} subtext="per 100k" />
        <ProfileCard label="Murder" value={formatRate(crime.violent_crime.murder_rate)} subtext="per 100k" />
        <ProfileCard label="Robbery" value={formatRate(crime.violent_crime.robbery_rate)} subtext="per 100k" />
        <ProfileCard label="Burglary" value={formatRate(crime.property_crime.burglary_rate)} subtext="per 100k" />
        <ProfileCard label="Larceny" value={formatRate(crime.property_crime.larceny_rate)} subtext="per 100k" />
        <ProfileCard label="Vehicle Theft" value={formatRate(crime.property_crime.motor_vehicle_theft_rate)} subtext="per 100k" />
      </div>
    </div>
  )
}

function CostTab({ data }: { data: LocationProfileResponse }) {
  const cost = data.cost
  if (!cost) return <Unavailable name="Cost" />
  return (
    <div>
      <p className="text-[12px] text-[var(--color-text-dim)] mb-[20px] font-[var(--font-mono)]">State: {cost.state}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        <ProfileCard label="Median Rent" value={formatCurrency(cost.housing_costs.median_gross_rent)} />
        <ProfileCard label="Home Value" value={formatCurrency(cost.housing_costs.median_home_value)} />
        <ProfileCard label="Monthly Housing" value={formatCurrency(cost.housing_costs.median_monthly_housing_cost)} />
        <ProfileCard label="Utilities" value={formatCurrency(cost.housing_costs.estimated_utility_cost)} subtext="estimated monthly" />
        <ProfileCard label="FMR 1-Bed" value={formatCurrency(cost.fair_market_rents.one_bedroom)} subtext="fair market rent" />
        <ProfileCard label="FMR 2-Bed" value={formatCurrency(cost.fair_market_rents.two_bedroom)} subtext="fair market rent" />
        <ProfileCard label="Cost Index" value={cost.price_indices.overall.toFixed(1)} subtext="100 = national avg" />
        <ProfileCard label="Rent/Income" value={formatPercent(cost.affordability.rent_to_income_ratio)} />
      </div>
    </div>
  )
}

function VotingTab({ data }: { data: LocationProfileResponse }) {
  const voting = data.voting
  if (!voting) return <Unavailable name="Voting" />
  const ps = voting.partisan_summary
  const cd = voting.districts.congressional_district
  return (
    <div>
      <p className="text-[12px] text-[var(--color-text-dim)] mb-[20px] font-[var(--font-mono)]">State: {voting.state}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        <ProfileCard label="Partisan Lean" value={ps.lean_label} subtext={`${ps.partisan_lean > 0 ? '+' : ''}${ps.partisan_lean.toFixed(1)}`} />
        <ProfileCard label="Trend" value={ps.trend_label} subtext={`${ps.dem_trend > 0 ? '+' : ''}${ps.dem_trend.toFixed(1)} Dem shift`} />
        <ProfileCard label="Competitiveness" value={ps.competitive_index.toFixed(1)} subtext="0 = safe, 100 = toss-up" />
        <ProfileCard label="Congress District" value={cd.district_name} subtext={`${cd.winner_party} (D ${formatPercent(cd.dem_pct)} / R ${formatPercent(cd.rep_pct)})`} />
        {voting.presidential_elections.slice(0, 2).map(e => (
          <ProfileCard key={e.year} label={`${e.year} Presidential`} value={`D ${formatPercent(e.dem_pct)} / R ${formatPercent(e.rep_pct)}`} />
        ))}
        <ProfileCard label="Governor" value={voting.state_officials.governor.name} subtext={voting.state_officials.governor.party} />
        <ProfileCard label="Trifecta" value={voting.state_officials.state_legislature.trifecta} />
      </div>
    </div>
  )
}

function Unavailable({ name }: { name: string }) {
  return (
    <div className="text-center py-[64px] text-[var(--color-text-dim)] text-[14px]">
      {name} data unavailable for this ZIP code
    </div>
  )
}
