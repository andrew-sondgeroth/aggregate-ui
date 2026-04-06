import type { LocationProfileResponse } from '../../api/types'
import { formatCurrency, formatPercent, formatNumber, formatTemp, formatRate, safeFixed } from '../../shared/utils/formatters'

type Sentiment = 'positive' | 'neutral' | 'negative' | 'warning'

interface FieldDef {
  label: string
  value: string | null
  sentiment?: Sentiment
  tooltip?: string
}

// Determine sentiment based on value relative to thresholds
// direction: 'higher' = higher is better, 'lower' = lower is better
function sentimentFor(value: number | null | undefined, direction: 'higher' | 'lower', thresholds: [number, number]): Sentiment {
  if (value == null) return 'neutral'
  const [low, high] = thresholds
  if (direction === 'higher') {
    if (value >= high) return 'positive'
    if (value <= low) return 'negative'
    return 'neutral'
  } else {
    if (value <= low) return 'positive'
    if (value >= high) return 'negative'
    return 'neutral'
  }
}

function boolSentiment(value: boolean | null | undefined, goodWhen: boolean): Sentiment {
  if (value == null) return 'neutral'
  return value === goodWhen ? 'positive' : 'negative'
}

const SENTIMENT_CLASSES: Record<Sentiment, string> = {
  positive: 'bg-[#34d399]/10 border-[#34d399]/20',
  neutral: 'bg-transparent border-[var(--color-border)]',
  negative: 'bg-[#f87171]/10 border-[#f87171]/20',
  warning: 'bg-[#fbbf24]/10 border-[#fbbf24]/20',
}

const SENTIMENT_DOT: Record<Sentiment, string> = {
  positive: 'bg-[#34d399]',
  neutral: 'bg-[var(--color-text-dim)]',
  negative: 'bg-[#f87171]',
  warning: 'bg-[#fbbf24]',
}

function FieldRow({ label, value, sentiment = 'neutral', tooltip }: FieldDef) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-[13px] ${SENTIMENT_CLASSES[sentiment]}`}
      title={tooltip}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${SENTIMENT_DOT[sentiment]}`} />
        <span className="text-[var(--color-text-sub)] truncate">{label}</span>
      </div>
      <span className="font-[var(--font-mono)] text-[var(--color-text)] shrink-0 ml-3">{value ?? 'N/A'}</span>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[var(--color-text-dim)] mt-4 mb-2 first:mt-0">{title}</div>
  )
}

interface DetailViewProps {
  domain: string
  data: LocationProfileResponse
  onBack: () => void
}

export default function DetailView({ domain, data, onBack }: DetailViewProps) {
  const fields = getFieldsForDomain(domain, data)
  if (!fields) return null

  return (
    <div className="px-4 py-3">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[13px] text-[var(--color-text-sub)] hover:text-[var(--color-text)] transition mb-3"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to summary
      </button>
      <h3 className="text-[15px] font-semibold text-[var(--color-text)] mb-4">{domain} — All Fields</h3>
      <div className="space-y-1.5">
        {fields.map((group, i) => (
          <div key={i}>
            {group.header && <SectionHeader title={group.header} />}
            {group.fields.map((f, j) => (
              <FieldRow key={j} {...f} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function getFieldsForDomain(domain: string, data: LocationProfileResponse): { header?: string; fields: FieldDef[] }[] | null {
  switch (domain) {
    case 'Area': return getAreaFields(data)
    case 'Climate': return getClimateFields(data)
    case 'Tax': return getTaxFields(data)
    case 'Crime': return getCrimeFields(data)
    case 'Cost of Living': return getCostFields(data)
    case 'Voting': return getVotingFields(data)
    case 'Business': return getBusinessFields(data)
    case 'Air Quality': return getAirQualityFields(data)
    case 'Healthcare': return getHealthcareFields(data)
    case 'Education': return getEducationFields(data)
    case 'Disaster Risk': return getDisasterFields(data)
    default: return null
  }
}

function getAreaFields(data: LocationProfileResponse) {
  const a = data.area
  if (!a) return null
  return [
    { header: 'Population & Demographics', fields: [
      { label: 'Total Population', value: formatNumber(a.population.total_population), sentiment: sentimentFor(a.population.total_population, 'higher', [1000, 50000]), tooltip: 'Total residents' },
      { label: 'Median Age', value: safeFixed(a.demographics.median_age), sentiment: 'neutral' as Sentiment, tooltip: 'Median resident age' },
      { label: 'Hispanic/Latino', value: formatPercent(a.demographics.hispanic_or_latino_percent), sentiment: 'neutral' as Sentiment },
      { label: 'Total Households', value: formatNumber(a.demographics.total_households), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Economics', fields: [
      { label: 'Median Household Income', value: formatCurrency(a.economic.median_household_income), sentiment: sentimentFor(a.economic.median_household_income, 'higher', [40000, 80000]), tooltip: 'Half earn more, half earn less' },
      { label: 'Per Capita Income', value: formatCurrency(a.economic.per_capita_income), sentiment: sentimentFor(a.economic.per_capita_income, 'higher', [20000, 40000]) },
      { label: 'Unemployment Rate', value: formatPercent(a.economic.unemployment_rate), sentiment: sentimentFor(a.economic.unemployment_rate, 'lower', [3, 7]), tooltip: 'Lower is better' },
      { label: 'Work From Home', value: formatPercent(a.economic.work_from_home_percent), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Housing', fields: [
      { label: 'Median Home Value', value: formatCurrency(a.housing.median_home_value), sentiment: 'neutral' as Sentiment },
      { label: 'Median Gross Rent', value: formatCurrency(a.housing.median_gross_rent), sentiment: 'neutral' as Sentiment },
      { label: 'Owner Occupied', value: formatPercent(a.housing.owner_occupied_percent), sentiment: sentimentFor(a.housing.owner_occupied_percent, 'higher', [40, 70]) },
      { label: 'Vacancy Rate', value: formatPercent(a.housing.vacancy_rate), sentiment: sentimentFor(a.housing.vacancy_rate, 'lower', [5, 15]), tooltip: 'Lower generally indicates demand' },
    ]},
    { header: 'Education', fields: [
      { label: "Bachelor's Degree+", value: formatPercent(a.education.bachelors_or_higher_percent), sentiment: sentimentFor(a.education.bachelors_or_higher_percent, 'higher', [20, 40]) },
      { label: 'High School Graduate', value: formatPercent(a.education.high_school_graduate_percent), sentiment: sentimentFor(a.education.high_school_graduate_percent, 'higher', [80, 92]) },
    ]},
    { header: 'Income Distribution', fields: [
      { label: 'Gini Index', value: safeFixed(a.income_distribution.gini_index, 4), sentiment: sentimentFor(a.income_distribution.gini_index, 'lower', [0.35, 0.5]), tooltip: '0=equal, 1=unequal — lower is more equal' },
      { label: 'Low Income Households', value: formatPercent(a.income_distribution.low_income_household_percent), sentiment: sentimentFor(a.income_distribution.low_income_household_percent, 'lower', [15, 30]) },
      { label: 'Income Over $200K', value: formatPercent(a.income_distribution.over_200k_percent), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Housing Affordability', fields: [
      { label: 'Rent Burdened', value: formatPercent(a.housing_affordability.rent_burdened_percent), sentiment: sentimentFor(a.housing_affordability.rent_burdened_percent, 'lower', [25, 40]), tooltip: 'Renters spending 30%+ on rent — lower is better' },
      { label: 'Mortgage Burdened', value: formatPercent(a.housing_affordability.mortgage_burdened_percent), sentiment: sentimentFor(a.housing_affordability.mortgage_burdened_percent, 'lower', [20, 35]) },
      { label: 'Rent-to-Income', value: formatPercent(a.housing_affordability.median_rent_to_income_percent), sentiment: sentimentFor(a.housing_affordability.median_rent_to_income_percent, 'lower', [25, 35]) },
    ]},
    { header: 'Infrastructure', fields: [
      { label: 'Broadband Access', value: formatPercent(a.internet_access.broadband_percent), sentiment: sentimentFor(a.internet_access.broadband_percent, 'higher', [70, 85]) },
      { label: 'No Internet', value: formatPercent(a.internet_access.no_internet_percent), sentiment: sentimentFor(a.internet_access.no_internet_percent, 'lower', [5, 15]) },
    ]},
    { header: 'Community Risk', fields: [
      { label: 'Risk Tier', value: a.community_risk.risk_tier, sentiment: a.community_risk.risk_tier === 'Low' ? 'positive' as Sentiment : a.community_risk.risk_tier === 'High' ? 'negative' as Sentiment : 'neutral' as Sentiment },
      { label: 'Risk Score', value: safeFixed(a.community_risk.risk_score), sentiment: sentimentFor(a.community_risk.risk_score, 'lower', [30, 60]), tooltip: '0-100, lower is better' },
    ]},
  ]
}

function getClimateFields(data: LocationProfileResponse) {
  const c = data.climate
  if (!c) return null
  const a = c.annual_summary
  return [
    { header: 'Annual Summary', fields: [
      { label: 'Avg Temperature', value: formatTemp(a.avg_temp), sentiment: 'neutral' as Sentiment },
      { label: 'Avg High', value: formatTemp(a.avg_high), sentiment: 'neutral' as Sentiment },
      { label: 'Avg Low', value: formatTemp(a.avg_low), sentiment: 'neutral' as Sentiment },
      { label: 'Summer Avg High', value: formatTemp(a.summer_avg_high), sentiment: 'neutral' as Sentiment },
      { label: 'Winter Avg Low', value: formatTemp(a.winter_avg_low), sentiment: 'neutral' as Sentiment },
      { label: 'Temperature Range', value: formatTemp(a.temp_range), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Precipitation', fields: [
      { label: 'Annual Precipitation', value: `${safeFixed(a.total_precipitation)}"`, sentiment: 'neutral' as Sentiment },
      { label: 'Annual Snowfall', value: `${safeFixed(a.total_snowfall)}"`, sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Degree Days', fields: [
      { label: 'Heating Degree Days', value: formatNumber(a.heating_degree_days), sentiment: 'neutral' as Sentiment, tooltip: 'Higher = colder winters, more heating needed' },
      { label: 'Cooling Degree Days', value: formatNumber(a.cooling_degree_days), sentiment: 'neutral' as Sentiment, tooltip: 'Higher = hotter summers, more cooling needed' },
      { label: 'Frost-Free Days', value: formatNumber(a.frost_free_days), sentiment: sentimentFor(a.frost_free_days, 'higher', [150, 250]) },
    ]},
    { header: 'Station', fields: [
      { label: 'Station Name', value: c.nearest_station.name, sentiment: 'neutral' as Sentiment },
      { label: 'Distance', value: `${safeFixed(c.nearest_station.distance_miles)} mi`, sentiment: sentimentFor(c.nearest_station.distance_miles, 'lower', [5, 20]) },
    ]},
  ]
}

function getTaxFields(data: LocationProfileResponse) {
  const t = data.tax
  if (!t) return null
  return [
    { header: 'Sales Tax', fields: [
      { label: 'Combined Rate', value: formatPercent(t.sales_tax.combined_rate), sentiment: sentimentFor(t.sales_tax.combined_rate, 'lower', [5, 9]), tooltip: 'State + county + city' },
      { label: 'State Rate', value: formatPercent(t.sales_tax.state_rate), sentiment: 'neutral' as Sentiment },
      { label: 'County Rate', value: formatPercent(t.sales_tax.county_rate), sentiment: 'neutral' as Sentiment },
      { label: 'City Rate', value: formatPercent(t.sales_tax.city_rate), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Income Tax', fields: [
      { label: 'Has State Income Tax', value: t.state_income_tax.has_state_income_tax ? 'Yes' : 'No', sentiment: boolSentiment(t.state_income_tax.has_state_income_tax, false) },
      { label: 'Top Marginal Rate', value: formatPercent(t.state_income_tax.top_marginal_rate), sentiment: sentimentFor(t.state_income_tax.top_marginal_rate, 'lower', [3, 8]) },
      { label: 'Number of Brackets', value: formatNumber(t.state_income_tax.number_of_brackets), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Excise Tax', fields: [
      { label: 'Gas Tax', value: `${t.excise_tax.gas_tax_cents_per_gallon}¢/gal`, sentiment: sentimentFor(t.excise_tax.gas_tax_cents_per_gallon, 'lower', [20, 40]) },
      { label: 'Has Estate Tax', value: t.excise_tax.has_estate_tax ? 'Yes' : 'No', sentiment: boolSentiment(t.excise_tax.has_estate_tax, false) },
    ]},
    { header: 'IRS Income Stats', fields: [
      { label: 'Average AGI', value: formatCurrency(t.irs_income_stats?.avg_agi), sentiment: sentimentFor(t.irs_income_stats?.avg_agi, 'higher', [40000, 80000]) },
      { label: 'Average Tax Paid', value: formatCurrency(t.irs_income_stats?.avg_tax_paid), sentiment: 'neutral' as Sentiment },
      { label: 'Effective Federal Rate', value: formatPercent(t.irs_income_stats?.effective_federal_rate), sentiment: 'neutral' as Sentiment },
      { label: 'Earned Income Credit', value: formatPercent(t.irs_income_stats?.earned_income_credit_pct), sentiment: 'neutral' as Sentiment },
    ]},
  ]
}

function getCrimeFields(data: LocationProfileResponse) {
  const c = data.crime
  if (!c) return null
  return [
    { header: 'Summary', fields: [
      { label: 'Total Crime Rate', value: formatRate(c.summary.total_crime_rate), sentiment: sentimentFor(c.summary.total_crime_rate, 'lower', [1500, 3500]), tooltip: 'Per 100K — lower is safer' },
      { label: 'Total Crimes', value: formatNumber(c.summary.total_crimes), sentiment: 'neutral' as Sentiment },
      { label: 'Population', value: formatNumber(c.summary.population), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Violent Crime', fields: [
      { label: 'Violent Crime Rate', value: formatRate(c.violent_crime.violent_crime_rate), sentiment: sentimentFor(c.violent_crime.violent_crime_rate, 'lower', [200, 500]), tooltip: 'Per 100K' },
      { label: 'Murder Rate', value: formatRate(c.violent_crime.murder_rate), sentiment: sentimentFor(c.violent_crime.murder_rate, 'lower', [3, 8]) },
      { label: 'Rape Rate', value: formatRate(c.violent_crime.rape_rate), sentiment: sentimentFor(c.violent_crime.rape_rate, 'lower', [25, 50]) },
      { label: 'Robbery Rate', value: formatRate(c.violent_crime.robbery_rate), sentiment: sentimentFor(c.violent_crime.robbery_rate, 'lower', [50, 150]) },
      { label: 'Aggravated Assault', value: formatRate(c.violent_crime.aggravated_assault_rate), sentiment: sentimentFor(c.violent_crime.aggravated_assault_rate, 'lower', [150, 300]) },
    ]},
    { header: 'Property Crime', fields: [
      { label: 'Property Crime Rate', value: formatRate(c.property_crime.property_crime_rate), sentiment: sentimentFor(c.property_crime.property_crime_rate, 'lower', [1200, 2800]) },
      { label: 'Burglary Rate', value: formatRate(c.property_crime.burglary_rate), sentiment: sentimentFor(c.property_crime.burglary_rate, 'lower', [200, 500]) },
      { label: 'Larceny Rate', value: formatRate(c.property_crime.larceny_rate), sentiment: sentimentFor(c.property_crime.larceny_rate, 'lower', [800, 2000]) },
      { label: 'Vehicle Theft Rate', value: formatRate(c.property_crime.motor_vehicle_theft_rate), sentiment: sentimentFor(c.property_crime.motor_vehicle_theft_rate, 'lower', [150, 350]) },
    ]},
  ]
}

function getCostFields(data: LocationProfileResponse) {
  const c = data.cost
  if (!c) return null
  return [
    { header: 'Housing Costs', fields: [
      { label: 'Median Gross Rent', value: formatCurrency(c.housing_costs.median_gross_rent), sentiment: sentimentFor(c.housing_costs.median_gross_rent, 'lower', [800, 1500]) },
      { label: 'Median Contract Rent', value: formatCurrency(c.housing_costs.median_contract_rent), sentiment: 'neutral' as Sentiment },
      { label: 'Median Home Value', value: formatCurrency(c.housing_costs.median_home_value), sentiment: 'neutral' as Sentiment },
      { label: 'Monthly Owner Costs', value: formatCurrency(c.housing_costs.median_owner_costs), sentiment: 'neutral' as Sentiment },
      { label: 'Monthly Housing Cost', value: formatCurrency(c.housing_costs.median_monthly_housing_cost), sentiment: 'neutral' as Sentiment },
      { label: 'Estimated Utilities', value: formatCurrency(c.housing_costs.estimated_utility_cost), sentiment: sentimentFor(c.housing_costs.estimated_utility_cost, 'lower', [150, 300]) },
    ]},
    { header: 'Fair Market Rents', fields: [
      { label: 'Studio', value: formatCurrency(c.fair_market_rents.studio), sentiment: 'neutral' as Sentiment },
      { label: '1 Bedroom', value: formatCurrency(c.fair_market_rents.one_bedroom), sentiment: 'neutral' as Sentiment },
      { label: '2 Bedroom', value: formatCurrency(c.fair_market_rents.two_bedroom), sentiment: 'neutral' as Sentiment },
      { label: '3 Bedroom', value: formatCurrency(c.fair_market_rents.three_bedroom), sentiment: 'neutral' as Sentiment },
      { label: '4 Bedroom', value: formatCurrency(c.fair_market_rents.four_bedroom), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Price Indices', fields: [
      { label: 'Overall Index', value: safeFixed(c.price_indices?.overall), sentiment: sentimentFor(c.price_indices?.overall, 'lower', [90, 110]), tooltip: '100 = national avg' },
      { label: 'Goods Index', value: safeFixed(c.price_indices?.goods), sentiment: 'neutral' as Sentiment },
      { label: 'Rents Index', value: safeFixed(c.price_indices?.rents), sentiment: 'neutral' as Sentiment },
      { label: 'Services Index', value: safeFixed(c.price_indices?.services), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Affordability', fields: [
      { label: 'Rent-to-Income Ratio', value: formatPercent(c.affordability?.rent_to_income_ratio), sentiment: sentimentFor(c.affordability?.rent_to_income_ratio, 'lower', [20, 35]), tooltip: 'Lower is more affordable' },
    ]},
  ]
}

function getVotingFields(data: LocationProfileResponse) {
  const v = data.voting
  if (!v) return null
  return [
    { header: 'Partisan Analysis', fields: [
      { label: 'Partisan Lean', value: v.partisan_summary?.lean_label ?? 'N/A', sentiment: 'neutral' as Sentiment },
      { label: 'Lean Points', value: v.partisan_summary ? `${v.partisan_summary.partisan_lean > 0 ? '+' : ''}${v.partisan_summary.partisan_lean.toFixed(1)}` : 'N/A', sentiment: 'neutral' as Sentiment, tooltip: 'Positive = Dem, Negative = Rep' },
      { label: 'Trend', value: v.partisan_summary?.trend_label ?? 'N/A', sentiment: 'neutral' as Sentiment },
      { label: 'Competitiveness', value: safeFixed(v.partisan_summary?.competitive_index), sentiment: 'neutral' as Sentiment, tooltip: '100 = most competitive' },
    ]},
    { header: 'Presidential Elections', fields: (v.presidential_elections ?? []).map(e => ({
      label: `${e.year}`, value: `D ${formatPercent(e.dem_pct)} / R ${formatPercent(e.rep_pct)}`, sentiment: 'neutral' as Sentiment,
    }))},
    { header: 'Districts', fields: [
      ...(v.districts?.congressional_district ? [{ label: 'Congressional District', value: v.districts.congressional_district.district_name, sentiment: 'neutral' as Sentiment }] : []),
      { label: 'State Senate', value: v.districts?.state_senate_district ?? 'N/A', sentiment: 'neutral' as Sentiment },
      { label: 'State House', value: v.districts?.state_house_district ?? 'N/A', sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'State Officials', fields: [
      { label: 'Governor', value: `${v.state_officials?.governor?.name ?? 'N/A'} (${v.state_officials?.governor?.party ?? '?'})`, sentiment: 'neutral' as Sentiment },
      ...(v.state_officials?.us_senators ?? []).map(s => ({ label: 'US Senator', value: `${s.name} (${s.party})`, sentiment: 'neutral' as Sentiment })),
      { label: 'Trifecta', value: v.state_officials?.state_legislature?.trifecta ?? 'N/A', sentiment: 'neutral' as Sentiment },
    ]},
  ]
}

function getBusinessFields(data: LocationProfileResponse) {
  const b = data.business
  if (!b) return null
  return [
    { header: 'Summary', fields: [
      { label: 'Total Establishments', value: formatNumber(b.summary.total_establishments), sentiment: sentimentFor(b.summary.total_establishments, 'higher', [50, 500]) },
      { label: 'Total Employees', value: formatNumber(b.summary.total_employees), sentiment: sentimentFor(b.summary.total_employees, 'higher', [500, 5000]) },
      { label: 'Annual Payroll', value: formatCurrency(b.summary.total_annual_payroll), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Top Industries', fields: (b.top_industries ?? []).slice(0, 8).map(ind => ({
      label: ind.name, value: `${formatNumber(ind.employees)} employees`, sentiment: 'neutral' as Sentiment, tooltip: `NAICS ${ind.code} — ${formatCurrency(ind.payroll)} payroll`,
    }))},
  ]
}

function getAirQualityFields(data: LocationProfileResponse) {
  const aq = data.air_quality
  if (!aq) return null
  return [
    { header: 'AQI Summary', fields: [
      { label: 'Annual AQI', value: safeFixed(aq.aqi_summary?.annual_aqi), sentiment: sentimentFor(aq.aqi_summary?.annual_aqi, 'lower', [30, 50]), tooltip: 'Under 50 is good' },
      { label: 'Good AQI Days', value: formatNumber(aq.aqi_summary?.days_good_aqi), sentiment: sentimentFor(aq.aqi_summary?.days_good_aqi, 'higher', [200, 300]) },
      { label: 'Moderate AQI Days', value: formatNumber(aq.aqi_summary?.days_moderate_aqi), sentiment: 'neutral' as Sentiment },
      { label: 'Unhealthy (Sensitive)', value: formatNumber(aq.aqi_summary?.days_unhealthy_sensitive), sentiment: sentimentFor(aq.aqi_summary?.days_unhealthy_sensitive, 'lower', [5, 20]) },
      { label: 'Unhealthy Days', value: formatNumber(aq.aqi_summary?.days_unhealthy), sentiment: sentimentFor(aq.aqi_summary?.days_unhealthy, 'lower', [1, 5]) },
    ]},
    { header: 'Pollutant Levels', fields: [
      { label: 'PM2.5 Annual (µg/m³)', value: safeFixed(aq.pollutant_levels?.pm25_annual), sentiment: sentimentFor(aq.pollutant_levels?.pm25_annual, 'lower', [8, 12]), tooltip: 'EPA standard: 12 µg/m³' },
      { label: 'PM2.5 98th %', value: safeFixed(aq.pollutant_levels?.pm25_p98), sentiment: sentimentFor(aq.pollutant_levels?.pm25_p98, 'lower', [20, 35]) },
      { label: 'Ozone Annual (ppm)', value: safeFixed(aq.pollutant_levels?.ozone_annual, 3), sentiment: sentimentFor(aq.pollutant_levels?.ozone_annual, 'lower', [0.05, 0.07]) },
      { label: 'Ozone 98th %', value: safeFixed(aq.pollutant_levels?.ozone_p98, 3), sentiment: sentimentFor(aq.pollutant_levels?.ozone_p98, 'lower', [0.06, 0.08]) },
    ]},
    { header: 'Monitor', fields: [
      { label: 'Monitor Distance', value: `${safeFixed(aq.monitor_info?.monitor_distance_miles)} mi`, sentiment: sentimentFor(aq.monitor_info?.monitor_distance_miles, 'lower', [10, 30]) },
    ]},
  ]
}

function getHealthcareFields(data: LocationProfileResponse) {
  const hc = data.healthcare
  if (!hc) return null
  return [
    { header: 'Hospital Access', fields: [
      { label: 'Hospital Count', value: formatNumber(hc.hospital_access?.hospital_count), sentiment: sentimentFor(hc.hospital_access?.hospital_count, 'higher', [1, 3]) },
      { label: 'Nearest Hospital', value: `${safeFixed(hc.hospital_access?.nearest_hospital_miles)} mi`, sentiment: sentimentFor(hc.hospital_access?.nearest_hospital_miles, 'lower', [10, 30]) },
      { label: 'Avg Hospital Rating', value: `${safeFixed(hc.hospital_access?.avg_hospital_rating)}/5`, sentiment: sentimentFor(hc.hospital_access?.avg_hospital_rating, 'higher', [3, 4]) },
      { label: 'Total Beds', value: formatNumber(hc.hospital_access?.total_beds), sentiment: 'neutral' as Sentiment },
      { label: 'Beds Per Capita', value: safeFixed(hc.hospital_access?.beds_per_capita, 2), sentiment: sentimentFor(hc.hospital_access?.beds_per_capita, 'higher', [1.5, 3]) },
    ]},
    { header: 'Shortage Areas', fields: [
      { label: 'Primary Care Shortage', value: hc.shortage_areas?.primary_care_shortage ? 'Yes' : 'No', sentiment: boolSentiment(hc.shortage_areas?.primary_care_shortage, false) },
      { label: 'Mental Health Shortage', value: hc.shortage_areas?.mental_health_shortage ? 'Yes' : 'No', sentiment: boolSentiment(hc.shortage_areas?.mental_health_shortage, false) },
      { label: 'HPSA Score', value: formatNumber(hc.shortage_areas?.hpsa_score), sentiment: sentimentFor(hc.shortage_areas?.hpsa_score, 'lower', [5, 15]), tooltip: 'Health Professional Shortage Area score — lower is better' },
    ]},
    { header: 'Facilities', fields: [
      { label: 'Urgent Care', value: formatNumber(hc.facility_counts?.urgent_care_count), sentiment: sentimentFor(hc.facility_counts?.urgent_care_count, 'higher', [1, 3]) },
      { label: 'Pharmacies', value: formatNumber(hc.facility_counts?.pharmacy_count), sentiment: sentimentFor(hc.facility_counts?.pharmacy_count, 'higher', [2, 5]) },
      { label: 'Nursing Homes', value: formatNumber(hc.facility_counts?.nursing_home_count), sentiment: 'neutral' as Sentiment },
      { label: 'Nursing Home Rating', value: `${safeFixed(hc.facility_counts?.avg_nursing_home_rating)}/5`, sentiment: sentimentFor(hc.facility_counts?.avg_nursing_home_rating, 'higher', [3, 4]) },
    ]},
  ]
}

function getEducationFields(data: LocationProfileResponse) {
  const ed = data.education
  if (!ed) return null
  return [
    { header: 'School Overview', fields: [
      { label: 'School Count', value: formatNumber(ed.school_overview?.school_count), sentiment: 'neutral' as Sentiment },
      { label: 'Total Enrollment', value: formatNumber(ed.school_overview?.total_enrollment), sentiment: 'neutral' as Sentiment },
      { label: 'Charter Schools', value: formatNumber(ed.school_overview?.charter_school_count), sentiment: 'neutral' as Sentiment },
      { label: 'Magnet Schools', value: formatNumber(ed.school_overview?.magnet_school_count), sentiment: 'neutral' as Sentiment },
    ]},
    { header: 'Academic Performance', fields: [
      { label: 'Graduation Rate', value: formatPercent(ed.academic_performance?.graduation_rate), sentiment: sentimentFor(ed.academic_performance?.graduation_rate, 'higher', [80, 92]) },
      { label: 'Dropout Rate', value: formatPercent(ed.academic_performance?.dropout_rate), sentiment: sentimentFor(ed.academic_performance?.dropout_rate, 'lower', [3, 8]) },
      { label: 'College Enrollment', value: formatPercent(ed.academic_performance?.college_enrollment_rate), sentiment: sentimentFor(ed.academic_performance?.college_enrollment_rate, 'higher', [50, 70]) },
      { label: 'Math Proficiency', value: formatPercent(ed.academic_performance?.math_proficiency_rate), sentiment: sentimentFor(ed.academic_performance?.math_proficiency_rate, 'higher', [30, 50]) },
      { label: 'Reading Proficiency', value: formatPercent(ed.academic_performance?.reading_proficiency_rate), sentiment: sentimentFor(ed.academic_performance?.reading_proficiency_rate, 'higher', [30, 50]) },
    ]},
    { header: 'Resources', fields: [
      { label: 'Student-Teacher Ratio', value: `${safeFixed(ed.school_resources?.avg_student_teacher_ratio)}:1`, sentiment: sentimentFor(ed.school_resources?.avg_student_teacher_ratio, 'lower', [12, 18]), tooltip: 'Lower = more individual attention' },
      { label: 'Per-Pupil Spending', value: formatCurrency(ed.school_resources?.avg_per_pupil_spending), sentiment: sentimentFor(ed.school_resources?.avg_per_pupil_spending, 'higher', [10000, 15000]) },
      { label: 'Title I Schools', value: formatPercent(ed.school_resources?.title_i_school_pct), sentiment: 'neutral' as Sentiment, tooltip: 'Schools receiving federal funds for low-income students' },
    ]},
  ]
}

function getDisasterFields(data: LocationProfileResponse) {
  const dr = data.disaster_risk
  if (!dr) return null
  return [
    { header: 'Overall', fields: [
      { label: 'Risk Rating', value: dr.overall_risk?.overall_risk_rating ?? 'N/A', sentiment: dr.overall_risk?.overall_risk_rating === 'Very Low' || dr.overall_risk?.overall_risk_rating === 'Relatively Low' ? 'positive' as Sentiment : dr.overall_risk?.overall_risk_rating === 'Relatively High' || dr.overall_risk?.overall_risk_rating === 'Very High' ? 'negative' as Sentiment : 'neutral' as Sentiment },
      { label: 'Risk Score', value: safeFixed(dr.overall_risk?.overall_risk_score), sentiment: sentimentFor(dr.overall_risk?.overall_risk_score, 'lower', [10, 30]) },
      { label: 'Expected Annual Loss', value: formatCurrency(dr.overall_risk?.expected_annual_loss), sentiment: sentimentFor(dr.overall_risk?.expected_annual_loss, 'lower', [50000, 500000]) },
      { label: 'Social Vulnerability', value: safeFixed(dr.overall_risk?.social_vulnerability), sentiment: sentimentFor(dr.overall_risk?.social_vulnerability, 'lower', [30, 60]) },
      { label: 'Community Resilience', value: safeFixed(dr.overall_risk?.community_resilience), sentiment: sentimentFor(dr.overall_risk?.community_resilience, 'higher', [40, 60]) },
    ]},
    { header: 'Weather Hazards', fields: [
      { label: 'Tornado', value: safeFixed(dr.weather_hazards?.tornado_risk_score), sentiment: sentimentFor(dr.weather_hazards?.tornado_risk_score, 'lower', [5, 20]) },
      { label: 'Hurricane', value: safeFixed(dr.weather_hazards?.hurricane_risk_score), sentiment: sentimentFor(dr.weather_hazards?.hurricane_risk_score, 'lower', [5, 20]) },
      { label: 'Hail', value: safeFixed(dr.weather_hazards?.hail_risk_score), sentiment: sentimentFor(dr.weather_hazards?.hail_risk_score, 'lower', [5, 20]) },
      { label: 'Winter Weather', value: safeFixed(dr.weather_hazards?.winter_weather_risk_score), sentiment: sentimentFor(dr.weather_hazards?.winter_weather_risk_score, 'lower', [5, 20]) },
      { label: 'Drought', value: safeFixed(dr.weather_hazards?.drought_risk_score), sentiment: sentimentFor(dr.weather_hazards?.drought_risk_score, 'lower', [5, 20]) },
      { label: 'Heat Wave', value: safeFixed(dr.weather_hazards?.heat_wave_risk_score), sentiment: sentimentFor(dr.weather_hazards?.heat_wave_risk_score, 'lower', [5, 20]) },
      { label: 'Lightning', value: safeFixed(dr.weather_hazards?.lightning_risk_score), sentiment: sentimentFor(dr.weather_hazards?.lightning_risk_score, 'lower', [5, 20]) },
    ]},
    { header: 'Geological Hazards', fields: [
      { label: 'Earthquake', value: safeFixed(dr.geological_hazards?.earthquake_risk_score), sentiment: sentimentFor(dr.geological_hazards?.earthquake_risk_score, 'lower', [5, 20]) },
      { label: 'Landslide', value: safeFixed(dr.geological_hazards?.landslide_risk_score), sentiment: sentimentFor(dr.geological_hazards?.landslide_risk_score, 'lower', [5, 20]) },
    ]},
    { header: 'Flood & Fire', fields: [
      { label: 'Flood', value: safeFixed(dr.flood_hazards?.flood_risk_score), sentiment: sentimentFor(dr.flood_hazards?.flood_risk_score, 'lower', [5, 20]) },
      { label: 'Coastal Flood', value: safeFixed(dr.flood_hazards?.coastal_flood_risk_score), sentiment: sentimentFor(dr.flood_hazards?.coastal_flood_risk_score, 'lower', [5, 20]) },
      { label: 'Wildfire', value: safeFixed(dr.fire_hazards?.wildfire_risk_score), sentiment: sentimentFor(dr.fire_hazards?.wildfire_risk_score, 'lower', [5, 20]) },
    ]},
  ]
}
