import { useState } from 'react'
import { isValidZip } from '../../shared/utils/zip-validation'

interface WidgetZipInputProps {
  onSubmit: (zip: string) => void
  loading: boolean
  defaultZip?: string
}

export default function WidgetZipInput({ onSubmit, loading, defaultZip }: WidgetZipInputProps) {
  const [zip, setZip] = useState(defaultZip || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidZip(zip) && !loading) {
      onSubmit(zip.trim())
    }
  }

  return (
    <form className="aw-form" onSubmit={handleSubmit}>
      <input
        className="aw-input"
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
        placeholder="ZIP code"
      />
      <button className="aw-btn" type="submit" disabled={!isValidZip(zip) || loading}>
        {loading ? '...' : 'Look Up'}
      </button>
    </form>
  )
}
