import type { LocationProfileResponse } from '../../api/types'
import { formatCurrency, formatPercent, formatNumber, formatTemp, formatRate, safeFixed } from '../../shared/utils/formatters'

interface WidgetProfileViewProps {
  data: LocationProfileResponse
  activeTab: string
}

function Metric({ label, value, sub, tooltip }: { label: string; value: string; sub?: string; tooltip?: string }) {
  return (
    <div className="aw-metric" title={tooltip}>
      <div className="aw-metric-label">{label}</div>
      <div className="aw-metric-value">{value}</div>
      {sub && <div className="aw-metric-sub">{sub}</div>}
    </div>
  )
}

export default function WidgetProfileView({ data, activeTab }: WidgetProfileViewProps) {
  return (
    <div className="aw-content">
      {activeTab === 'area' && <AreaView data={data} />}
      {activeTab === 'climate' && <ClimateView data={data} />}
      {activeTab === 'tax' && <TaxView data={data} />}
      {activeTab === 'crime' && <CrimeView data={data} />}
      {activeTab === 'cost' && <CostView data={data} />}
      {activeTab === 'voting' && <VotingView data={data} />}
    </div>
  )
}

function AreaView({ data }: { data: LocationProfileResponse }) {
  const area = data.area
  if (!area) return <div className="aw-empty">Census data unavailable</div>

  return (
    <div className="aw-grid">
      <Metric label="Population" value={formatNumber(area.population.total_population)} tooltip="Total population in this ZIP code area" />
      <Metric label="Median Income" value={formatCurrency(area.economic.median_household_income)} tooltip="Median annual household income" />
      <Metric label="Home Value" value={formatCurrency(area.housing.median_home_value)} tooltip="Median value of owner-occupied housing" />
      <Metric label="Unemployment" value={formatPercent(area.economic.unemployment_rate)} tooltip="Percentage of labor force unemployed" />
      <Metric label="Bachelor's+" value={formatPercent(area.education.bachelors_or_higher_percent)} tooltip="Adults 25+ with bachelor's degree or higher" />
      <Metric label="Risk Score" value={area.community_risk.risk_tier} sub={`${safeFixed(area.community_risk.risk_score, 0)}/100`} tooltip="Composite risk based on poverty, unemployment, housing burden" />
    </div>
  )
}

function ClimateView({ data }: { data: LocationProfileResponse }) {
  const climate = data.climate
  if (!climate) return <div className="aw-empty">Weather data unavailable</div>

  const a = climate.annual_summary
  return (
    <div className="aw-grid">
      <Metric label="Avg Temp" value={formatTemp(a.avg_temp)} tooltip="Average annual temperature (30-year normals)" />
      <Metric label="Summer High" value={formatTemp(a.summer_avg_high)} tooltip="Average daily high Jun-Aug" />
      <Metric label="Winter Low" value={formatTemp(a.winter_avg_low)} tooltip="Average daily low Dec-Feb" />
      <Metric label="Precipitation" value={`${safeFixed(a.total_precipitation)}"`} tooltip="Total annual precipitation in inches" />
      <Metric label="Snowfall" value={`${safeFixed(a.total_snowfall)}"`} tooltip="Total annual snowfall in inches" />
      <Metric label="Frost-Free Days" value={String(a.frost_free_days)} tooltip="Days per year without freezing" />
    </div>
  )
}

function TaxView({ data }: { data: LocationProfileResponse }) {
  const tax = data.tax
  if (!tax) return <div className="aw-empty">Tax data unavailable</div>

  return (
    <div className="aw-grid">
      <Metric label="Sales Tax" value={formatPercent(tax.sales_tax.combined_rate)} tooltip="Combined state + local sales tax rate" />
      <Metric label="Income Tax" value={tax.state_income_tax.has_state_income_tax ? formatPercent(tax.state_income_tax.top_marginal_rate) : 'None'} tooltip="Top marginal state income tax rate" />
      <Metric label="Avg AGI" value={formatCurrency(tax.irs_income_stats?.avg_agi)} tooltip="Average adjusted gross income (IRS)" />
      <Metric label="Eff. Fed Rate" value={formatPercent(tax.irs_income_stats?.effective_federal_rate)} tooltip="Average effective federal tax rate" />
      <Metric label="Gas Tax" value={`${tax.excise_tax.gas_tax_cents_per_gallon}¢/gal`} tooltip="State gas tax in cents per gallon" />
      <Metric label="Estate Tax" value={tax.excise_tax.has_estate_tax ? 'Yes' : 'No'} tooltip="Whether the state has an estate/inheritance tax" />
    </div>
  )
}

function CrimeView({ data }: { data: LocationProfileResponse }) {
  const crime = data.crime
  if (!crime) return <div className="aw-empty">Crime data unavailable</div>

  return (
    <div className="aw-grid">
      <Metric label="Total Crime" value={formatRate(crime.summary.total_crime_rate)} sub="per 100k" tooltip="Combined violent + property crime rate" />
      <Metric label="Violent Crime" value={formatRate(crime.violent_crime.violent_crime_rate)} sub="per 100k" tooltip="Murder, rape, robbery, aggravated assault" />
      <Metric label="Property Crime" value={formatRate(crime.property_crime.property_crime_rate)} sub="per 100k" tooltip="Burglary, larceny, motor vehicle theft" />
      <Metric label="Murder" value={formatRate(crime.violent_crime.murder_rate)} sub="per 100k" tooltip="Murder and non-negligent manslaughter" />
      <Metric label="Burglary" value={formatRate(crime.property_crime.burglary_rate)} sub="per 100k" tooltip="Unlawful entry to commit theft or felony" />
      <Metric label="Vehicle Theft" value={formatRate(crime.property_crime.motor_vehicle_theft_rate)} sub="per 100k" tooltip="Theft or attempted theft of a motor vehicle" />
    </div>
  )
}

function CostView({ data }: { data: LocationProfileResponse }) {
  const cost = data.cost
  if (!cost) return <div className="aw-empty">Cost data unavailable</div>

  return (
    <div className="aw-grid">
      <Metric label="Median Rent" value={formatCurrency(cost.housing_costs.median_gross_rent)} tooltip="Median monthly gross rent including utilities" />
      <Metric label="Home Value" value={formatCurrency(cost.housing_costs.median_home_value)} tooltip="Median owner-occupied home value" />
      <Metric label="FMR 2-Bed" value={formatCurrency(cost.fair_market_rents.two_bedroom)} sub="fair market rent" tooltip="HUD Fair Market Rent for a 2-bedroom unit" />
      <Metric label="Cost Index" value={safeFixed(cost.price_indices?.overall)} sub="100 = national avg" tooltip="Regional price parity — higher means more expensive" />
      <Metric label="Rent/Income" value={formatPercent(cost.affordability?.rent_to_income_ratio)} tooltip="Annual rent as ratio of average AGI" />
      <Metric label="Utilities" value={formatCurrency(cost.housing_costs.estimated_utility_cost)} sub="monthly est." tooltip="Estimated monthly utility costs" />
    </div>
  )
}

function VotingView({ data }: { data: LocationProfileResponse }) {
  const voting = data.voting
  if (!voting) return <div className="aw-empty">Voting data unavailable</div>

  const ps = voting.partisan_summary
  const cd = voting.districts?.congressional_district
  return (
    <div className="aw-grid">
      <Metric label="Partisan Lean" value={ps?.lean_label ?? 'N/A'} sub={ps ? `${ps.partisan_lean > 0 ? '+' : ''}${ps.partisan_lean.toFixed(1)}` : undefined} tooltip="Positive = Democratic, negative = Republican" />
      <Metric label="Competitiveness" value={safeFixed(ps?.competitive_index)} sub="0=safe, 100=toss-up" tooltip="100 = perfectly split, 0 = one party dominates" />
      {cd && <Metric label="Congress Dist." value={cd.district_name} sub={cd.winner_party} tooltip="Congressional district and winning party" />}
      <Metric label="Governor" value={voting.state_officials?.governor?.name ?? 'N/A'} sub={voting.state_officials?.governor?.party} tooltip="Current state governor" />
      <Metric label="Trifecta" value={voting.state_officials?.state_legislature?.trifecta ?? 'N/A'} tooltip="One-party control of governorship + both chambers" />
      {voting.presidential_elections?.[0] && (
        <Metric label={`${voting.presidential_elections[0].year} Pres.`} value={`D ${formatPercent(voting.presidential_elections[0].dem_pct)} / R ${formatPercent(voting.presidential_elections[0].rep_pct)}`} />
      )}
    </div>
  )
}
