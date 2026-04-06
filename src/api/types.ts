// Mirrors aggregate-api DTOs exactly

export interface LocationProfileResponse {
  zip: string
  generated_at: string
  area: AreaProfile | null
  climate: ClimateProfile | null
  tax: TaxProfile | null
  crime: CrimeProfile | null
  cost: CostProfile | null
  voting: VotingProfile | null
  business: BusinessProfile | null
  air_quality: AirQualityProfile | null
  healthcare: HealthcareProfile | null
  education: EducationProfile | null
  disaster_risk: DisasterRiskProfile | null
  data_sources: DataSources
}

export interface DataSources {
  census: DataSourceStatus
  weather: DataSourceStatus
  tax: DataSourceStatus
  crime: DataSourceStatus
  cost: DataSourceStatus
  voting: DataSourceStatus
  business: DataSourceStatus
  air_quality: DataSourceStatus
  healthcare: DataSourceStatus
  education: DataSourceStatus
  disaster_risk: DataSourceStatus
}

export interface DataSourceStatus {
  available: boolean
  error: string | null
}

// --- Area (Census) ---

export interface AreaProfile {
  population: { total_population: number }
  demographics: {
    median_age: number
    hispanic_or_latino_percent: number
    total_households: number
  }
  economic: {
    median_household_income: number
    per_capita_income: number
    unemployment_rate: number
    work_from_home_percent: number
  }
  housing: {
    median_home_value: number
    median_gross_rent: number
    owner_occupied_percent: number
    vacancy_rate: number
  }
  education: {
    bachelors_or_higher_percent: number
    high_school_graduate_percent: number
  }
  income_distribution: {
    gini_index: number
    low_income_household_percent: number
    over_200k_percent: number
  }
  housing_affordability: {
    rent_burdened_percent: number
    mortgage_burdened_percent: number
    median_rent_to_income_percent: number
  }
  internet_access: {
    broadband_percent: number
    no_internet_percent: number
  }
  community_risk: {
    risk_score: number
    risk_tier: string
  }
}

// --- Climate (Weather) ---

export interface ClimateProfile {
  nearest_station: {
    station_id: string
    name: string
    distance_miles: number
  }
  annual_summary: {
    avg_temp: number
    avg_high: number
    avg_low: number
    total_precipitation: number
    total_snowfall: number
    heating_degree_days: number
    cooling_degree_days: number
    frost_free_days: number
    summer_avg_high: number
    winter_avg_low: number
    temp_range: number
  }
  monthly: MonthlyClimate[]
}

export interface MonthlyClimate {
  month: string
  avg_temp: number
  avg_high: number
  avg_low: number
  avg_precip: number
  avg_snowfall: number
}

// --- Tax ---

export interface TaxProfile {
  state: string
  sales_tax: {
    state_rate: number
    county_rate: number
    city_rate: number
    combined_rate: number
  }
  state_income_tax: {
    has_state_income_tax: boolean
    top_marginal_rate: number
    number_of_brackets: number
  }
  excise_tax: {
    gas_tax_cents_per_gallon: number
    has_estate_tax: boolean
  }
  irs_income_stats: {
    avg_agi: number
    avg_tax_paid: number
    effective_federal_rate: number
    earned_income_credit_pct: number
  }
}

// --- Crime ---

export interface CrimeProfile {
  state: string
  data_year: number
  violent_crime: {
    murder_rate: number
    rape_rate: number
    robbery_rate: number
    aggravated_assault_rate: number
    violent_crime_rate: number
  }
  property_crime: {
    burglary_rate: number
    larceny_rate: number
    motor_vehicle_theft_rate: number
    property_crime_rate: number
  }
  summary: {
    total_crime_rate: number
    total_crimes: number
    population: number
  }
}

// --- Cost of Living ---

export interface CostProfile {
  state: string
  housing_costs: {
    median_gross_rent: number
    median_contract_rent: number
    median_home_value: number
    median_owner_costs: number
    median_monthly_housing_cost: number
    estimated_utility_cost: number
  }
  fair_market_rents: {
    studio: number
    one_bedroom: number
    two_bedroom: number
    three_bedroom: number
    four_bedroom: number
  }
  price_indices: {
    overall: number
    goods: number
    rents: number
    services: number
  }
  affordability: {
    rent_to_income_ratio: number
  }
}

// --- Voting ---

export interface VotingProfile {
  state: string
  presidential_elections: PresidentialElection[]
  partisan_summary: PartisanSummary
  districts: DistrictInfo
  state_officials: StateOfficials
}

export interface PresidentialElection {
  year: number
  dem_pct: number
  rep_pct: number
  other_pct: number
}

export interface PartisanSummary {
  partisan_lean: number
  lean_label: string
  dem_trend: number
  trend_label: string
  competitive_index: number
}

export interface DistrictInfo {
  congressional_district: CongressionalDistrict
  state_senate_district: string
  state_house_district: string
}

export interface CongressionalDistrict {
  district_name: string
  dem_pct: number
  rep_pct: number
  winner_party: string
}

export interface StateOfficials {
  governor: Official
  us_senators: Official[]
  state_legislature: StateLegislature
}

export interface Official {
  name: string
  party: string
}

export interface StateLegislature {
  senate_majority: string
  house_majority: string
  trifecta: string
}

// --- Business ---

export interface BusinessProfile {
  summary: BusinessSummary
  sectors: SectorData[]
  top_industries: SubsectorData[]
}

export interface BusinessSummary {
  total_establishments: number
  total_employees: number
  total_annual_payroll: number
}

export interface SectorData {
  code: string
  name: string
  establishments: number
  employees: number
  payroll: number
  subsectors: SubsectorData[]
}

export interface SubsectorData {
  code: string
  name: string
  establishments: number
  employees: number
  payroll: number
}

// --- Air Quality ---

export interface AirQualityProfile {
  state: string
  data_year: number
  pollutant_levels: PollutantLevels
  aqi_summary: AqiSummary
  monitor_info: MonitorInfo
}

export interface PollutantLevels {
  pm25_annual: number
  pm25_p98: number
  ozone_annual: number
  ozone_p98: number
}

export interface AqiSummary {
  annual_aqi: number
  days_good_aqi: number
  days_moderate_aqi: number
  days_unhealthy_sensitive: number
  days_unhealthy: number
}

export interface MonitorInfo {
  nearest_monitor_id: string
  monitor_distance_miles: number
}

// --- Healthcare ---

export interface HealthcareProfile {
  state: string
  data_year: number
  hospital_access: HospitalAccess
  shortage_areas: ShortageAreas
  facility_counts: FacilityCounts
}

export interface HospitalAccess {
  hospital_count: number
  nearest_hospital_miles: number
  avg_hospital_rating: number
  total_beds: number
  beds_per_capita: number
}

export interface ShortageAreas {
  primary_care_shortage: boolean
  mental_health_shortage: boolean
  hpsa_score: number
}

export interface FacilityCounts {
  urgent_care_count: number
  pharmacy_count: number
  nursing_home_count: number
  avg_nursing_home_rating: number
}

// --- Education ---

export interface EducationProfile {
  state: string
  data_year: number
  school_overview: SchoolOverview
  academic_performance: AcademicPerformance
  school_resources: SchoolResources
}

export interface SchoolOverview {
  school_count: number
  total_enrollment: number
  charter_school_count: number
  magnet_school_count: number
}

export interface AcademicPerformance {
  graduation_rate: number
  dropout_rate: number
  college_enrollment_rate: number
  math_proficiency_rate: number
  reading_proficiency_rate: number
}

export interface SchoolResources {
  avg_student_teacher_ratio: number
  avg_per_pupil_spending: number
  title_i_school_pct: number
}

// --- Disaster Risk ---

export interface DisasterRiskProfile {
  state: string
  data_year: number
  overall_risk: OverallRisk
  weather_hazards: WeatherHazards
  geological_hazards: GeologicalHazards
  flood_hazards: FloodHazards
  fire_hazards: FireHazards
}

export interface OverallRisk {
  overall_risk_score: number
  overall_risk_rating: string
  expected_annual_loss: number
  social_vulnerability: number
  community_resilience: number
}

export interface WeatherHazards {
  tornado_risk_score: number
  hurricane_risk_score: number
  hail_risk_score: number
  winter_weather_risk_score: number
  drought_risk_score: number
  heat_wave_risk_score: number
  lightning_risk_score: number
}

export interface GeologicalHazards {
  earthquake_risk_score: number
  landslide_risk_score: number
}

export interface FloodHazards {
  flood_risk_score: number
  coastal_flood_risk_score: number
}

export interface FireHazards {
  wildfire_risk_score: number
}

// --- Search ---

export interface LocationSearchRequest {
  criteria: SearchCriterion[]
  limit?: number
}

export interface SearchCriterion {
  field: string
  min?: number
  max?: number
  level?: string
  weight?: number
}

export interface LocationSearchResponse {
  total_matches: number
  returned: number
  results: LocationSearchResult[]
}

export interface LocationSearchResult {
  zip: string
  composite_score: number
  field_scores: Record<string, FieldScore>
}

export interface FieldScore {
  value: number
  normalized_score: number
  weight: number
  weighted_score: number
  source: string
}

// --- Search Fields ---

export interface SearchFieldInfo {
  field: string
  description: string
  unit: string
}

export interface SearchFieldsResponse {
  total_fields: number
  sources: Record<string, Record<string, SearchFieldInfo[]>>
}
