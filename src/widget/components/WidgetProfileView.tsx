import type { LocationProfileResponse } from '../../api/types'
import { formatCurrency, formatPercent, formatNumber, formatTemp, formatRate, safeFixed } from '../../shared/utils/formatters'

interface WidgetProfileViewProps {
  data: LocationProfileResponse
  activeTab: string
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="aw-metric">
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
      <Metric label="Population" value={formatNumber(area.population.total_population)} />
      <Metric label="Median Income" value={formatCurrency(area.economic.median_household_income)} />
      <Metric label="Home Value" value={formatCurrency(area.housing.median_home_value)} />
      <Metric label="Unemployment" value={formatPercent(area.economic.unemployment_rate)} />
      <Metric label="Bachelor's+" value={formatPercent(area.education.bachelors_or_higher_percent)} />
      <Metric label="Risk Score" value={area.community_risk.risk_tier} sub={`${safeFixed(area.community_risk.risk_score, 0)}/100`} />
    </div>
  )
}

function ClimateView({ data }: { data: LocationProfileResponse }) {
  const climate = data.climate
  if (!climate) return <div className="aw-empty">Weather data unavailable</div>

  const a = climate.annual_summary
  return (
    <div className="aw-grid">
      <Metric label="Avg Temp" value={formatTemp(a.avg_temp)} />
      <Metric label="Summer High" value={formatTemp(a.summer_avg_high)} />
      <Metric label="Winter Low" value={formatTemp(a.winter_avg_low)} />
      <Metric label="Precipitation" value={`${safeFixed(a.total_precipitation)}"`} />
      <Metric label="Snowfall" value={`${safeFixed(a.total_snowfall)}"`} />
      <Metric label="Frost-Free Days" value={String(a.frost_free_days)} />
    </div>
  )
}

function TaxView({ data }: { data: LocationProfileResponse }) {
  const tax = data.tax
  if (!tax) return <div className="aw-empty">Tax data unavailable</div>

  return (
    <div className="aw-grid">
      <Metric label="Sales Tax" value={formatPercent(tax.sales_tax.combined_rate)} />
      <Metric label="Income Tax" value={tax.state_income_tax.has_state_income_tax ? formatPercent(tax.state_income_tax.top_marginal_rate) : 'None'} />
      <Metric label="Avg AGI" value={formatCurrency(tax.irs_income_stats?.avg_agi)} />
      <Metric label="Eff. Fed Rate" value={formatPercent(tax.irs_income_stats?.effective_federal_rate)} />
      <Metric label="Gas Tax" value={`${tax.excise_tax.gas_tax_cents_per_gallon}¢/gal`} />
      <Metric label="Estate Tax" value={tax.excise_tax.has_estate_tax ? 'Yes' : 'No'} />
    </div>
  )
}

function CrimeView({ data }: { data: LocationProfileResponse }) {
  const crime = data.crime
  if (!crime) return <div className="aw-empty">Crime data unavailable</div>

  return (
    <div className="aw-grid">
      <Metric label="Total Crime" value={formatRate(crime.summary.total_crime_rate)} sub="per 100k" />
      <Metric label="Violent Crime" value={formatRate(crime.violent_crime.violent_crime_rate)} sub="per 100k" />
      <Metric label="Property Crime" value={formatRate(crime.property_crime.property_crime_rate)} sub="per 100k" />
      <Metric label="Murder" value={formatRate(crime.violent_crime.murder_rate)} sub="per 100k" />
      <Metric label="Burglary" value={formatRate(crime.property_crime.burglary_rate)} sub="per 100k" />
      <Metric label="Vehicle Theft" value={formatRate(crime.property_crime.motor_vehicle_theft_rate)} sub="per 100k" />
    </div>
  )
}

function CostView({ data }: { data: LocationProfileResponse }) {
  const cost = data.cost
  if (!cost) return <div className="aw-empty">Cost data unavailable</div>

  return (
    <div className="aw-grid">
      <Metric label="Median Rent" value={formatCurrency(cost.housing_costs.median_gross_rent)} />
      <Metric label="Home Value" value={formatCurrency(cost.housing_costs.median_home_value)} />
      <Metric label="FMR 2-Bed" value={formatCurrency(cost.fair_market_rents.two_bedroom)} sub="fair market rent" />
      <Metric label="Cost Index" value={safeFixed(cost.price_indices?.overall)} sub="100 = national avg" />
      <Metric label="Rent/Income" value={formatPercent(cost.affordability?.rent_to_income_ratio)} />
      <Metric label="Utilities" value={formatCurrency(cost.housing_costs.estimated_utility_cost)} sub="monthly est." />
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
      <Metric label="Partisan Lean" value={ps?.lean_label ?? 'N/A'} sub={ps ? `${ps.partisan_lean > 0 ? '+' : ''}${ps.partisan_lean.toFixed(1)}` : undefined} />
      <Metric label="Competitiveness" value={safeFixed(ps?.competitive_index)} sub="0=safe, 100=toss-up" />
      {cd && <Metric label="Congress Dist." value={cd.district_name} sub={cd.winner_party} />}
      <Metric label="Governor" value={voting.state_officials?.governor?.name ?? 'N/A'} sub={voting.state_officials?.governor?.party} />
      <Metric label="Trifecta" value={voting.state_officials?.state_legislature?.trifecta ?? 'N/A'} />
      {voting.presidential_elections?.[0] && (
        <Metric label={`${voting.presidential_elections[0].year} Pres.`} value={`D ${formatPercent(voting.presidential_elections[0].dem_pct)} / R ${formatPercent(voting.presidential_elections[0].rep_pct)}`} />
      )}
    </div>
  )
}
