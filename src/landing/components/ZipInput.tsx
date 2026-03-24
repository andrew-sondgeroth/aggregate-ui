import { useState } from 'react'
import { isValidZip } from '../../shared/utils/zip-validation'

interface ZipInputProps {
  onSubmit: (zip: string) => void
  loading?: boolean
}

export default function ZipInput({ onSubmit, loading }: ZipInputProps) {
  const [zip, setZip] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidZip(zip) && !loading) {
      onSubmit(zip.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 max-w-lg mx-auto">
      <input
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
        placeholder="Enter ZIP code (e.g., 90210)"
        className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-3.5 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition focus:border-[var(--color-accent-blue)] focus:ring-1 focus:ring-[var(--color-accent-blue)]/30 font-mono text-base"
      />
      <button
        type="submit"
        disabled={!isValidZip(zip) || loading}
        className="rounded-lg bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-purple)] px-8 py-3.5 font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 whitespace-nowrap"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
