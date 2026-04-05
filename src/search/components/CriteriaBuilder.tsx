import type { SearchFieldsResponse, SearchCriterion } from '../../api/types'

export interface CriterionRow {
  id: number
  field: string
  mode: 'range' | 'level'
  min: string
  max: string
  level: string
  weight: string
}

let nextId = 1

export function emptyRow(): CriterionRow {
  return { id: nextId++, field: '', mode: 'level', min: '', max: '', level: '', weight: '1' }
}

interface FieldOption {
  source: string
  category: string
  field: string
  description: string
  unit: string
}

interface CriteriaBuilderProps {
  fields: SearchFieldsResponse | null
  fieldsLoading: boolean
  loading: boolean
  onSearch: (criteria: SearchCriterion[], limit: number) => void
  rows: CriterionRow[]
  setRows: React.Dispatch<React.SetStateAction<CriterionRow[]>>
  limit: string
  setLimit: React.Dispatch<React.SetStateAction<string>>
}

const STANDARD_LEVELS = [
  { value: 'lowest', label: 'Lowest (bottom 10%)' },
  { value: 'low', label: 'Low (bottom 25%)' },
  { value: 'below_average', label: 'Below Average (25-50%)' },
  { value: 'moderate', label: 'Moderate (25-75%)' },
  { value: 'above_average', label: 'Above Average (50-75%)' },
  { value: 'high', label: 'High (top 25%)' },
  { value: 'highest', label: 'Highest (top 10%)' },
]

// Domain-specific aliases that map to standard levels
const FIELD_ALIASES: Record<string, { value: string; label: string }[]> = {
  avg_temp_annual: [
    { value: 'cold', label: 'Cold' },
    { value: 'mild', label: 'Mild' },
    { value: 'warm', label: 'Warm' },
    { value: 'hot', label: 'Hot' },
  ],
  avg_high_annual: [
    { value: 'cold', label: 'Cold' },
    { value: 'mild', label: 'Mild' },
    { value: 'warm', label: 'Warm' },
    { value: 'hot', label: 'Hot' },
  ],
  avg_low_annual: [
    { value: 'cold', label: 'Cold' },
    { value: 'mild', label: 'Mild' },
    { value: 'warm', label: 'Warm' },
  ],
  summer_avg_high: [
    { value: 'mild', label: 'Mild' },
    { value: 'warm', label: 'Warm' },
    { value: 'hot', label: 'Hot' },
  ],
  winter_avg_low: [
    { value: 'cold', label: 'Cold' },
    { value: 'mild', label: 'Mild' },
    { value: 'warm', label: 'Warm' },
  ],
  avg_precip_annual: [
    { value: 'dry', label: 'Dry' },
    { value: 'wet', label: 'Wet / Rainy' },
  ],
  avg_snowfall_annual: [
    { value: 'snowy', label: 'Snowy' },
  ],
  violent_crime_rate: [
    { value: 'safest', label: 'Safest' },
    { value: 'safe', label: 'Safe' },
    { value: 'dangerous', label: 'Dangerous' },
  ],
  total_crime_rate: [
    { value: 'safest', label: 'Safest' },
    { value: 'safe', label: 'Safe' },
  ],
  property_crime_rate: [
    { value: 'safest', label: 'Safest' },
    { value: 'safe', label: 'Safe' },
  ],
  murder_rate: [
    { value: 'safest', label: 'Safest' },
    { value: 'safe', label: 'Safe' },
  ],
  median_home_value: [
    { value: 'affordable', label: 'Affordable' },
    { value: 'expensive', label: 'Expensive' },
  ],
  median_gross_rent: [
    { value: 'affordable', label: 'Affordable' },
    { value: 'expensive', label: 'Expensive' },
  ],
  cost_median_gross_rent: [
    { value: 'affordable', label: 'Affordable' },
    { value: 'expensive', label: 'Expensive' },
  ],
  cost_median_home_value: [
    { value: 'affordable', label: 'Affordable' },
    { value: 'expensive', label: 'Expensive' },
  ],
  combined_sales_tax_rate: [
    { value: 'affordable', label: 'Affordable (Low tax)' },
  ],
  effective_property_tax_rate: [
    { value: 'affordable', label: 'Affordable (Low tax)' },
  ],
  partisan_lean: [
    { value: 'highest', label: 'Strong Democrat (D+15 or more)' },
    { value: 'high', label: 'Lean Democrat (D+5 to D+15)' },
    { value: 'moderate', label: 'Competitive / Swing' },
    { value: 'low', label: 'Lean Republican (R+5 to R+15)' },
    { value: 'lowest', label: 'Strong Republican (R+15 or more)' },
  ],
  dem_trend: [
    { value: 'high', label: 'Shifting Democratic' },
    { value: 'moderate', label: 'Stable' },
    { value: 'low', label: 'Shifting Republican' },
  ],
  competitive_index: [
    { value: 'high', label: 'Highly competitive / Swing' },
    { value: 'moderate', label: 'Somewhat competitive' },
    { value: 'low', label: 'Safe seat' },
  ],
  dem_pct_2024: [
    { value: 'high', label: 'Strongly Democratic' },
    { value: 'moderate', label: 'Competitive' },
    { value: 'low', label: 'Weakly Democratic' },
  ],
  rep_pct_2024: [
    { value: 'high', label: 'Strongly Republican' },
    { value: 'moderate', label: 'Competitive' },
    { value: 'low', label: 'Weakly Republican' },
  ],
  dem_pct_2020: [
    { value: 'high', label: 'Strongly Democratic' },
    { value: 'moderate', label: 'Competitive' },
    { value: 'low', label: 'Weakly Democratic' },
  ],
  rep_pct_2020: [
    { value: 'high', label: 'Strongly Republican' },
    { value: 'moderate', label: 'Competitive' },
    { value: 'low', label: 'Weakly Republican' },
  ],
}

function isBoolean(info: FieldOption) {
  return info.unit === 'boolean'
}

function getScaleHint(info: FieldOption): string | null {
  const match = info.description.match(/\(([^)]+)\)/)
  return match ? match[1] : null
}

function getPlaceholders(info: FieldOption): { min: string; max: string } {
  const u = info.unit
  if (u === '%') return { min: 'Min %', max: 'Max %' }
  if (u === 'USD' || u.startsWith('$')) return { min: 'Min $', max: 'Max $' }
  if (u === '°F') return { min: 'Min °F', max: 'Max °F' }
  if (u === 'per 100K') return { min: 'Min rate', max: 'Max rate' }
  if (u === 'points') return { min: 'Min pts', max: 'Max pts' }
  return { min: 'Min', max: 'Max' }
}

const inputClass = "flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-dim)] outline-none focus:border-[var(--color-gold)]/50 font-[var(--font-mono)]"
const pillClass = "px-2.5 py-1 rounded-md text-[11px] font-medium transition"
const pillActive = "bg-[var(--color-gold)]/15 text-[var(--color-gold)] border border-[var(--color-gold)]/30"
const pillInactive = "text-[var(--color-text-dim)] border border-[var(--color-border)] hover:text-[var(--color-text-sub)] hover:border-[var(--color-border-hover)]"

function BooleanInput({ row, updateRow }: { row: CriterionRow; updateRow: (patch: Partial<CriterionRow>) => void }) {
  const value = row.min === '1' ? 'yes' : row.min === '0' ? 'no' : ''
  const handleChange = (v: string) => {
    if (v === 'yes') updateRow({ min: '1', max: '1', level: '' })
    else if (v === 'no') updateRow({ min: '0', max: '0', level: '' })
    else updateRow({ min: '', max: '', level: '' })
  }
  return (
    <select value={value} onChange={(e) => handleChange(e.target.value)} className={inputClass}>
      <option value="">Select...</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </select>
  )
}

// Fields whose aliases cover the full spectrum — hide generic percentile options
const FULL_SPECTRUM_FIELDS = new Set([
  'partisan_lean', 'dem_trend', 'competitive_index',
  'dem_pct_2024', 'rep_pct_2024', 'dem_pct_2020', 'rep_pct_2020',
])

function LevelInput({ row, updateRow }: { row: CriterionRow; updateRow: (patch: Partial<CriterionRow>) => void }) {
  const aliases = FIELD_ALIASES[row.field]
  const hideGeneric = FULL_SPECTRUM_FIELDS.has(row.field)
  return (
    <select
      value={row.level}
      onChange={(e) => updateRow({ level: e.target.value, min: '', max: '' })}
      className={inputClass}
    >
      <option value="">Select level...</option>
      {aliases && (
        <optgroup label={hideGeneric ? 'Options' : 'Quick picks'}>
          {aliases.map(a => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </optgroup>
      )}
      {!hideGeneric && (
        <optgroup label="Percentile ranges">
          {STANDARD_LEVELS.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </optgroup>
      )}
    </select>
  )
}

function RangeInputs({ row, info, updateRow }: { row: CriterionRow; info: FieldOption; updateRow: (patch: Partial<CriterionRow>) => void }) {
  const ph = getPlaceholders(info)
  return (
    <>
      <input type="number" step="any" placeholder={ph.min} value={row.min}
        onChange={(e) => updateRow({ min: e.target.value, level: '' })} className={inputClass} />
      <input type="number" step="any" placeholder={ph.max} value={row.max}
        onChange={(e) => updateRow({ max: e.target.value, level: '' })} className={inputClass} />
    </>
  )
}

export default function CriteriaBuilder({ fields, fieldsLoading, loading, onSearch, rows, setRows, limit, setLimit }: CriteriaBuilderProps) {

  const addRow = () => setRows(prev => [...prev, emptyRow()])
  const removeRow = (id: number) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev)
  const updateRow = (id: number, patch: Partial<CriterionRow>) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const criteria: SearchCriterion[] = rows
      .filter(r => r.field && (r.min || r.max || r.level))
      .map(r => ({
        field: r.field,
        ...(r.level ? { level: r.level } : {}),
        ...(!r.level && r.min ? { min: parseFloat(r.min) } : {}),
        ...(!r.level && r.max ? { max: parseFloat(r.max) } : {}),
        weight: parseFloat(r.weight) || 1,
      }))
    if (criteria.length > 0) {
      onSearch(criteria, parseInt(limit) || 25)
    }
  }

  const canSubmit = rows.some(r => r.field && (r.min || r.max || r.level)) && !loading

  const fieldOptions: FieldOption[] = []
  if (fields) {
    for (const [source, categories] of Object.entries(fields.sources)) {
      for (const [category, fieldList] of Object.entries(categories)) {
        for (const f of fieldList) {
          fieldOptions.push({ source, category, field: f.field, description: f.description, unit: f.unit })
        }
      }
    }
  }

  const sourceGroups = new Map<string, FieldOption[]>()
  for (const opt of fieldOptions) {
    if (!sourceGroups.has(opt.source)) sourceGroups.set(opt.source, [])
    sourceGroups.get(opt.source)!.push(opt)
  }

  const selectedField = (fieldName: string) => fieldOptions.find(f => f.field === fieldName)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {fieldsLoading && (
          <div className="text-[13px] text-[var(--color-text-dim)] animate-pulse">Loading fields...</div>
        )}

        {rows.map((row) => {
          const info = selectedField(row.field)
          const scaleHint = info ? getScaleHint(info) : null
          const isBool = info ? isBoolean(info) : false

          return (
            <div key={row.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-3 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  value={row.field}
                  onChange={(e) => updateRow(row.id, { field: e.target.value, min: '', max: '', level: '', mode: 'level' })}
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-[13px] text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]/50"
                >
                  <option value="">Select field...</option>
                  {[...sourceGroups.entries()].map(([source, opts]) => (
                    <optgroup key={source} label={source.charAt(0).toUpperCase() + source.slice(1)}>
                      {opts.map(opt => (
                        <option key={opt.field} value={opt.field}>
                          {opt.description || opt.field}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="text-[var(--color-text-dim)] hover:text-[var(--color-red)] transition p-1"
                    aria-label="Remove criteria"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {info && !isBool && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider">{info.unit}</div>
                    {scaleHint && <div className="text-[11px] text-[var(--color-text-sub)] italic">{scaleHint}</div>}
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => updateRow(row.id, { mode: 'level', min: '', max: '' })}
                      className={`${pillClass} ${row.mode === 'level' ? pillActive : pillInactive}`}>
                      Level
                    </button>
                    <button type="button" onClick={() => updateRow(row.id, { mode: 'range', level: '' })}
                      className={`${pillClass} ${row.mode === 'range' ? pillActive : pillInactive}`}>
                      Range
                    </button>
                  </div>
                </div>
              )}

              {info && isBool && (
                <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider">{info.unit}</div>
              )}

              <div className="flex gap-2">
                {isBool ? (
                  <BooleanInput row={row} updateRow={(patch) => updateRow(row.id, patch)} />
                ) : row.mode === 'level' && info ? (
                  <LevelInput row={row} updateRow={(patch) => updateRow(row.id, patch)} />
                ) : info ? (
                  <RangeInputs row={row} info={info} updateRow={(patch) => updateRow(row.id, patch)} />
                ) : (
                  <>
                    <input type="number" step="any" placeholder="Min" value={row.min} onChange={(e) => updateRow(row.id, { min: e.target.value })} className={inputClass} />
                    <input type="number" step="any" placeholder="Max" value={row.max} onChange={(e) => updateRow(row.id, { max: e.target.value })} className={inputClass} />
                  </>
                )}
                <input
                  type="number" step="0.1" min="0" placeholder="Wt" value={row.weight}
                  onChange={(e) => updateRow(row.id, { weight: e.target.value })}
                  className="w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-dim)] outline-none focus:border-[var(--color-gold)]/50 font-[var(--font-mono)]"
                  title="Weight"
                />
              </div>
            </div>
          )
        })}

        <button type="button" onClick={addRow}
          className="w-full rounded-xl border border-dashed border-[var(--color-border)] py-2.5 text-[13px] text-[var(--color-text-dim)] hover:text-[var(--color-text-sub)] hover:border-[var(--color-border-hover)] transition">
          + Add criteria
        </button>

        <div className="flex items-center gap-3">
          <label className="text-[12px] text-[var(--color-text-dim)] whitespace-nowrap">Results limit</label>
          <input type="number" min="1" max="200" value={limit} onChange={(e) => setLimit(e.target.value)}
            className="w-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[13px] text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]/50 font-[var(--font-mono)]" />
        </div>
      </div>

      <div className="shrink-0 px-5 py-4 border-t border-[var(--color-border)]">
        <button type="submit" disabled={!canSubmit}
          className="w-full rounded-xl bg-[var(--color-gold)] py-3 font-semibold text-[var(--color-bg-base)] text-[14px] transition disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 shadow-lg shadow-[var(--color-gold)]/10">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </span>
          ) : 'Search'}
        </button>
      </div>
    </form>
  )
}
