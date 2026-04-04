import { useState } from 'react'
import type { SearchFieldsResponse, SearchCriterion } from '../../api/types'

interface CriteriaBuilderProps {
  fields: SearchFieldsResponse | null
  fieldsLoading: boolean
  loading: boolean
  onSearch: (criteria: SearchCriterion[], limit: number) => void
}

interface CriterionRow {
  id: number
  field: string
  min: string
  max: string
  weight: string
}

let nextId = 1

function emptyRow(): CriterionRow {
  return { id: nextId++, field: '', min: '', max: '', weight: '1' }
}

export default function CriteriaBuilder({ fields, fieldsLoading, loading, onSearch }: CriteriaBuilderProps) {
  const [rows, setRows] = useState<CriterionRow[]>([emptyRow()])
  const [limit, setLimit] = useState('25')

  const addRow = () => setRows(prev => [...prev, emptyRow()])
  const removeRow = (id: number) => setRows(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev)
  const updateRow = (id: number, patch: Partial<CriterionRow>) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const criteria: SearchCriterion[] = rows
      .filter(r => r.field && (r.min || r.max))
      .map(r => ({
        field: r.field,
        ...(r.min ? { min: parseFloat(r.min) } : {}),
        ...(r.max ? { max: parseFloat(r.max) } : {}),
        weight: parseFloat(r.weight) || 1,
      }))
    if (criteria.length > 0) {
      onSearch(criteria, parseInt(limit) || 25)
    }
  }

  const canSubmit = rows.some(r => r.field && (r.min || r.max)) && !loading

  // Build grouped options from fields response
  const fieldOptions: { source: string; category: string; field: string; description: string; unit: string }[] = []
  if (fields) {
    for (const [source, categories] of Object.entries(fields.sources)) {
      for (const [category, fieldList] of Object.entries(categories)) {
        for (const f of fieldList) {
          fieldOptions.push({ source, category, field: f.field, description: f.description, unit: f.unit })
        }
      }
    }
  }

  // Group by source for the optgroup
  const sourceGroups = new Map<string, typeof fieldOptions>()
  for (const opt of fieldOptions) {
    const key = opt.source
    if (!sourceGroups.has(key)) sourceGroups.set(key, [])
    sourceGroups.get(key)!.push(opt)
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
          return (
            <div key={row.id} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-3 space-y-2">
              <div className="flex items-center gap-2">
                <select
                  value={row.field}
                  onChange={(e) => updateRow(row.id, { field: e.target.value })}
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
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {info && (
                <div className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider">
                  {info.unit}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Min"
                  value={row.min}
                  onChange={(e) => updateRow(row.id, { min: e.target.value })}
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-dim)] outline-none focus:border-[var(--color-gold)]/50 font-[var(--font-mono)]"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Max"
                  value={row.max}
                  onChange={(e) => updateRow(row.id, { max: e.target.value })}
                  className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-dim)] outline-none focus:border-[var(--color-gold)]/50 font-[var(--font-mono)]"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Wt"
                  value={row.weight}
                  onChange={(e) => updateRow(row.id, { weight: e.target.value })}
                  className="w-16 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-dim)] outline-none focus:border-[var(--color-gold)]/50 font-[var(--font-mono)]"
                  title="Weight"
                />
              </div>
            </div>
          )
        })}

        <button
          type="button"
          onClick={addRow}
          className="w-full rounded-xl border border-dashed border-[var(--color-border)] py-2.5 text-[13px] text-[var(--color-text-dim)] hover:text-[var(--color-text-sub)] hover:border-[var(--color-border-hover)] transition"
        >
          + Add criteria
        </button>

        <div className="flex items-center gap-3">
          <label className="text-[12px] text-[var(--color-text-dim)] whitespace-nowrap">Results limit</label>
          <input
            type="number"
            min="1"
            max="200"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-20 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-1.5 text-[13px] text-[var(--color-text)] outline-none focus:border-[var(--color-gold)]/50 font-[var(--font-mono)]"
          />
        </div>
      </div>

      <div className="shrink-0 px-5 py-4 border-t border-[var(--color-border)]">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-xl bg-[var(--color-gold)] py-3 font-semibold text-[var(--color-bg-base)] text-[14px] transition disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 shadow-lg shadow-[var(--color-gold)]/10"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
