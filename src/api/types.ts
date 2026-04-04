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
  data_sources: DataSources
}

export interface DataSources {
  census: DataSourceStatus
  weather: DataSourceStatus
  tax: DataSourceStatus
  crime: DataSourceStatus
  cost: DataSourceStatus
  voting: DataSourceStatus
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
