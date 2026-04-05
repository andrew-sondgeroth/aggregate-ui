import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocationProfile } from '../../shared/hooks/useLocationProfile'
import ZipInput from '../../shared/components/ZipInput'
import ProfileCard from '../../shared/components/ProfileCard'
import DataSourceBadge from '../../shared/components/DataSourceBadge'
import { formatCurrency, formatPercent, formatNumber, formatTemp, formatRate, safeFixed } from '../../shared/utils/formatters'
import type { LocationProfileResponse } from '../../api/types'

const TABS = ['Area', 'Climate', 'Tax', 'Crime', 'Cost', 'Voting', 'Business'] as const
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
            {activeTab === 'Business' && <BusinessTab data={data} />}
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
      <ProfileCard label="Population" value={formatNumber(area.population.total_population)} tooltip="Total number of people living in this ZIP code area" />
      <ProfileCard label="Median Age" value={safeFixed(area.demographics.median_age)} tooltip="Half the population is older and half is younger than this age" />
      <ProfileCard label="Median Income" value={formatCurrency(area.economic.median_household_income)} tooltip="Median annual household income — half earn more, half earn less" />
      <ProfileCard label="Home Value" value={formatCurrency(area.housing.median_home_value)} tooltip="Median value of owner-occupied housing units" />
      <ProfileCard label="Median Rent" value={formatCurrency(area.housing.median_gross_rent)} tooltip="Median monthly gross rent including utilities" />
      <ProfileCard label="Unemployment" value={formatPercent(area.economic.unemployment_rate)} tooltip="Percentage of the labor force that is unemployed and seeking work" />
      <ProfileCard label="Bachelor's+" value={formatPercent(area.education.bachelors_or_higher_percent)} tooltip="Percentage of adults 25+ with a bachelor's degree or higher" />
      <ProfileCard label="Owner Occupied" value={formatPercent(area.housing.owner_occupied_percent)} tooltip="Percentage of housing units that are owner-occupied (vs. rented)" />
      <ProfileCard label="Broadband" value={formatPercent(area.internet_access.broadband_percent)} tooltip="Percentage of households with a broadband internet subscription" />
      <ProfileCard label="Work From Home" value={formatPercent(area.economic.work_from_home_percent)} tooltip="Percentage of workers who primarily work from home" />
      <ProfileCard label="Gini Index" value={safeFixed(area.income_distribution.gini_index, 4)} subtext="Income inequality" tooltip="Income inequality measure: 0 = perfectly equal, 1 = one person has all income" />
      <ProfileCard label="Community Risk" value={area.community_risk.risk_tier} subtext={`Score: ${safeFixed(area.community_risk.risk_score)}/100`} tooltip="Composite risk score based on poverty, unemployment, housing burden, and other socioeconomic factors" />
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
        Station: {climate.nearest_station.name} ({safeFixed(climate.nearest_station.distance_miles)} mi)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        <ProfileCard label="Avg Temperature" value={formatTemp(annual.avg_temp)} tooltip="Average annual temperature from 30-year climate normals" />
        <ProfileCard label="Summer Avg High" value={formatTemp(annual.summer_avg_high)} tooltip="Average daily high in June, July, and August" />
        <ProfileCard label="Winter Avg Low" value={formatTemp(annual.winter_avg_low)} tooltip="Average daily low in December, January, and February" />
        <ProfileCard label="Temp Range" value={formatTemp(annual.temp_range)} tooltip="Difference between the average daily high and low temperatures" />
        <ProfileCard label="Annual Precip" value={`${safeFixed(annual.total_precipitation)}"`} tooltip="Total annual rainfall plus melted snow in inches" />
        <ProfileCard label="Annual Snowfall" value={`${safeFixed(annual.total_snowfall)}"`} tooltip="Total annual snowfall in inches" />
        <ProfileCard label="Frost-Free Days" value={formatNumber(annual.frost_free_days)} tooltip="Number of days per year without freezing temperatures" />
        <ProfileCard label="Cooling Degree Days" value={formatNumber(annual.cooling_degree_days)} tooltip="Measure of how much cooling is needed — higher means hotter summers" />
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
        <ProfileCard label="Combined Sales Tax" value={formatPercent(tax.sales_tax.combined_rate)} tooltip="Total sales tax rate including state, county, and city components" />
        <ProfileCard label="State Sales Tax" value={formatPercent(tax.sales_tax.state_rate)} tooltip="State-level sales tax rate before local additions" />
        <ProfileCard label="Has Income Tax" value={tax.state_income_tax.has_state_income_tax ? 'Yes' : 'No'} tooltip="Whether this state levies a personal income tax" />
        <ProfileCard label="Top Marginal Rate" value={formatPercent(tax.state_income_tax.top_marginal_rate)} tooltip="Highest marginal state income tax bracket rate" />
        <ProfileCard label="Gas Tax" value={`${tax.excise_tax.gas_tax_cents_per_gallon}¢/gal`} tooltip="State excise tax on gasoline in cents per gallon" />
        <ProfileCard label="Has Estate Tax" value={tax.excise_tax.has_estate_tax ? 'Yes' : 'No'} tooltip="Whether this state levies an estate or inheritance tax" />
        <ProfileCard label="Avg AGI" value={formatCurrency(tax.irs_income_stats?.avg_agi)} tooltip="Average adjusted gross income from IRS returns in this ZIP code" />
        <ProfileCard label="Effective Fed Rate" value={formatPercent(tax.irs_income_stats?.effective_federal_rate)} tooltip="Average effective federal tax rate — total tax paid / AGI" />
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
        <ProfileCard label="Total Crime Rate" value={formatRate(crime.summary.total_crime_rate)} subtext="per 100k" tooltip="Combined violent + property crime incidents per 100,000 people" />
        <ProfileCard label="Violent Crime" value={formatRate(crime.violent_crime.violent_crime_rate)} subtext="per 100k" tooltip="Murder, rape, robbery, and aggravated assault per 100,000 people" />
        <ProfileCard label="Property Crime" value={formatRate(crime.property_crime.property_crime_rate)} subtext="per 100k" tooltip="Burglary, larceny-theft, and motor vehicle theft per 100,000 people" />
        <ProfileCard label="Murder" value={formatRate(crime.violent_crime.murder_rate)} subtext="per 100k" tooltip="Murder and non-negligent manslaughter per 100,000 people" />
        <ProfileCard label="Robbery" value={formatRate(crime.violent_crime.robbery_rate)} subtext="per 100k" tooltip="Taking property by force or threat of force per 100,000 people" />
        <ProfileCard label="Burglary" value={formatRate(crime.property_crime.burglary_rate)} subtext="per 100k" tooltip="Unlawful entry to commit theft or felony per 100,000 people" />
        <ProfileCard label="Larceny" value={formatRate(crime.property_crime.larceny_rate)} subtext="per 100k" tooltip="Theft of property without force or breaking in per 100,000 people" />
        <ProfileCard label="Vehicle Theft" value={formatRate(crime.property_crime.motor_vehicle_theft_rate)} subtext="per 100k" tooltip="Theft or attempted theft of a motor vehicle per 100,000 people" />
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
        <ProfileCard label="Median Rent" value={formatCurrency(cost.housing_costs.median_gross_rent)} tooltip="Median monthly gross rent including utilities" />
        <ProfileCard label="Home Value" value={formatCurrency(cost.housing_costs.median_home_value)} tooltip="Median value of owner-occupied housing units" />
        <ProfileCard label="Monthly Housing" value={formatCurrency(cost.housing_costs.median_monthly_housing_cost)} tooltip="Median monthly housing cost for all occupied units" />
        <ProfileCard label="Utilities" value={formatCurrency(cost.housing_costs.estimated_utility_cost)} subtext="estimated monthly" tooltip="Estimated monthly utility costs (electric, gas, water)" />
        <ProfileCard label="FMR 1-Bed" value={formatCurrency(cost.fair_market_rents.one_bedroom)} subtext="fair market rent" tooltip="HUD Fair Market Rent for a 1-bedroom unit — used for housing voucher programs" />
        <ProfileCard label="FMR 2-Bed" value={formatCurrency(cost.fair_market_rents.two_bedroom)} subtext="fair market rent" tooltip="HUD Fair Market Rent for a 2-bedroom unit" />
        <ProfileCard label="Cost Index" value={safeFixed(cost.price_indices?.overall)} subtext="100 = national avg" tooltip="Regional price parity — 100 is the national average. Higher = more expensive area." />
        <ProfileCard label="Rent/Income" value={formatPercent(cost.affordability?.rent_to_income_ratio)} tooltip="Annual rent as a ratio of average AGI — lower is more affordable" />
      </div>
    </div>
  )
}

function VotingTab({ data }: { data: LocationProfileResponse }) {
  const voting = data.voting
  if (!voting) return <Unavailable name="Voting" />
  const ps = voting.partisan_summary
  const cd = voting.districts?.congressional_district
  return (
    <div>
      <p className="text-[12px] text-[var(--color-text-dim)] mb-[20px] font-[var(--font-mono)]">State: {voting.state}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        <ProfileCard label="Partisan Lean" value={ps?.lean_label ?? 'N/A'} subtext={ps ? `${ps.partisan_lean > 0 ? '+' : ''}${ps.partisan_lean.toFixed(1)}` : undefined} tooltip="Average partisan lean across recent presidential elections. Positive = Democratic, negative = Republican." />
        <ProfileCard label="Trend" value={ps?.trend_label ?? 'N/A'} subtext={ps ? `${ps.dem_trend > 0 ? '+' : ''}${ps.dem_trend.toFixed(1)} Dem shift` : undefined} tooltip="Direction and magnitude of partisan shift across recent elections" />
        <ProfileCard label="Competitiveness" value={safeFixed(ps?.competitive_index)} subtext="0 = safe, 100 = toss-up" tooltip="How competitive elections are — 100 = perfectly split, 0 = one party dominates" />
        {cd && <ProfileCard label="Congress District" value={cd.district_name} subtext={`${cd.winner_party} (D ${formatPercent(cd.dem_pct)} / R ${formatPercent(cd.rep_pct)})`} tooltip="Congressional district and most recent election results" />}
        {voting.presidential_elections?.slice(0, 2).map(e => (
          <ProfileCard key={e.year} label={`${e.year} Presidential`} value={`D ${formatPercent(e.dem_pct)} / R ${formatPercent(e.rep_pct)}`} tooltip={`Presidential election vote share in ${e.year}`} />
        ))}
        <ProfileCard label="Governor" value={voting.state_officials?.governor?.name ?? 'N/A'} subtext={voting.state_officials?.governor?.party} tooltip="Current state governor and political party" />
        <ProfileCard label="Trifecta" value={voting.state_officials?.state_legislature?.trifecta ?? 'N/A'} tooltip="Whether one party controls the governorship and both legislative chambers" />
      </div>
    </div>
  )
}

function BusinessTab({ data }: { data: LocationProfileResponse }) {
  const biz = data.business
  if (!biz) return <Unavailable name="Business" />
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[16px]">
        <ProfileCard label="Establishments" value={formatNumber(biz.summary.total_establishments)} tooltip="Total business establishments (Census CBP)" />
        <ProfileCard label="Employees" value={formatNumber(biz.summary.total_employees)} tooltip="Total employees across all establishments" />
        <ProfileCard label="Annual Payroll" value={formatCurrency(biz.summary.total_annual_payroll)} tooltip="Total annual payroll across all establishments" />
        {biz.top_industries?.slice(0, 5).map(ind => (
          <ProfileCard key={ind.code} label={ind.name} value={formatNumber(ind.employees)} subtext={`${formatNumber(ind.establishments)} establishments`} tooltip={`NAICS ${ind.code} — ${formatCurrency(ind.payroll)} annual payroll`} />
        ))}
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
