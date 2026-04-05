import { useState, useEffect } from 'react'
import { isValidZip } from '../utils/zip-validation'

interface ZipInputProps {
  onSubmit: (zip: string) => void
  loading?: boolean
  value?: string
}

export default function ZipInput({ onSubmit, loading, value }: ZipInputProps) {
  const [zip, setZip] = useState(value ?? '')

  useEffect(() => {
    if (value !== undefined) {
      setZip(value)
    }
  }, [value])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidZip(zip) && !loading) {
      onSubmit(zip.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-[12px] max-w-[440px]" role="search" aria-label="ZIP code lookup">
      <label htmlFor="zip-input" className="sr-only">ZIP code</label>
      <input
        id="zip-input"
        type="text"
        inputMode="numeric"
        value={zip}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
        placeholder="Enter ZIP code"
        aria-label="5-digit US ZIP code"
        autoComplete="postal-code"
        className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-[20px] py-[16px] text-[var(--color-text)] placeholder-[var(--color-text-dim)] outline-none transition focus:border-[var(--color-gold)]/50 focus:ring-2 focus:ring-[var(--color-gold)]/20 font-[var(--font-mono)] text-[16px]"
      />
      <button
        type="submit"
        disabled={!isValidZip(zip) || loading}
        aria-busy={loading}
        className="rounded-xl bg-[var(--color-gold)] px-[32px] py-[16px] font-semibold text-[var(--color-bg-base)] text-[14px] transition disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 whitespace-nowrap shadow-lg shadow-[var(--color-gold)]/10 focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:outline-none"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading
          </span>
        ) : (
          'Look Up'
        )}
      </button>
    </form>
  )
}
