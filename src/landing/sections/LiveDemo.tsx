import { useState } from 'react'
import { useLocationProfile } from '../../shared/hooks/useLocationProfile'
import ZipInput from '../components/ZipInput'
import ProfileCard from '../components/ProfileCard'
import DataSourceBadge from '../components/DataSourceBadge'
import { formatCurrency, formatPercent, formatNumber, formatTemp, formatRate } from '../../shared/utils/formatters'
import type { LocationProfileResponse } from '../../api/types'

const TABS = ['Area', 'Climate', 'Tax', 'Crime', 'Cost'] as const
type Tab = (typeof TABS)[number]

export default function LiveDemo() {
  const [activeTab, setActiveTab] = useState<Tab>('Area')
  const { data, loading, error, fetchProfile } = useLocationProfile()

  return (
    <section id="demo" className="px-6 sm:px-8 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          Try It Live
        </h2>
        <p className="text-center text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto">
          Enter any US ZIP code to see a real API response. Data is aggregated from five sources in real time.
        </p>

        <ZipInput onSubmit={fetchProfile} loading={loading} />

        {error && (
          <div className="mt-6 text-center text-[var(--color-accent-red)] text-sm">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-[var(--color-border)]">
              <div>
                <span className="text-lg font-semibold text-[var(--color-text-primary)]">
                  ZIP {data.zip}
                </span>
                <span className="ml-3 text-xs text-[var(--color-text-muted)]">
                  {data.generated_at}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.data_sources).map(([name, status]) => (
                  <DataSourceBadge key={name} name={name} status={status} />
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)]">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab
                      ? 'text-[var(--color-accent-blue)] border-b-2 border-[var(--color-accent-blue)] bg-[var(--color-bg-secondary)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5 sm:p-6">
              {activeTab === 'Area' && <AreaTab data={data} />}
              {activeTab === 'Climate' && <ClimateTab data={data} />}
              {activeTab === 'Tax' && <TaxTab data={data} />}
              {activeTab === 'Crime' && <CrimeTab data={data} />}
              {activeTab === 'Cost' && <CostTab data={data} />}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function AreaTab({ data }: { data: LocationProfileResponse }) {
  const area = data.area
  if (!area) return <Unavailable name="Census" />

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
      <ProfileCard
        label="Community Risk"
        value={area.community_risk.risk_tier}
        subtext={`Score: ${area.community_risk.risk_score.toFixed(1)}/100`}
      />
    </div>
  )
}

function ClimateTab({ data }: { data: LocationProfileResponse }) {
  const climate = data.climate
  if (!climate) return <Unavailable name="Weather" />

  const annual = climate.annual_summary
  return (
    <div>
      <div className="text-xs text-[var(--color-text-muted)] mb-4">
        Station: {climate.nearest_station.name} ({climate.nearest_station.distance_miles.toFixed(1)} mi)
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
      <div className="text-xs text-[var(--color-text-muted)] mb-4">
        State: {tax.state}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
      <div className="text-xs text-[var(--color-text-muted)] mb-4">
        {crime.state} — {crime.data_year} data | Population: {formatNumber(crime.summary.population)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
      <div className="text-xs text-[var(--color-text-muted)] mb-4">
        State: {cost.state}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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

function Unavailable({ name }: { name: string }) {
  return (
    <div className="text-center py-8 text-[var(--color-text-muted)]">
      {name} data unavailable for this ZIP code
    </div>
  )
}
