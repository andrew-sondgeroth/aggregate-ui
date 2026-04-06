import { useState, useEffect, useRef } from 'react'
import { useLocationProfile } from '../shared/hooks/useLocationProfile'
import WidgetZipInput from './components/WidgetZipInput'
import WidgetTabs from './components/WidgetTabs'
import WidgetProfileView from './components/WidgetProfileView'

export interface WidgetConfig {
  apiKey: string
  apiBaseUrl?: string
  theme?: 'light' | 'dark'
  sections?: string[]
  defaultZip?: string
}

const DEFAULT_SECTIONS = ['area', 'climate', 'tax', 'crime', 'cost', 'voting', 'business', 'air_quality', 'healthcare', 'education', 'disaster_risk']

export default function AggregateWidgetApp({ config }: { config: WidgetConfig }) {
  const sections = config.sections?.filter((s) => DEFAULT_SECTIONS.includes(s)) || DEFAULT_SECTIONS
  const [activeTab, setActiveTab] = useState(sections[0])
  const { data, loading, error, fetchProfile } = useLocationProfile(config.apiBaseUrl, config.apiKey)

  const didMount = useRef(false)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      if (config.defaultZip) {
        fetchProfile(config.defaultZip)
      }
    }
  }, [config.defaultZip, fetchProfile])

  return (
    <div className={`aw-root ${config.theme === 'dark' ? 'aw-dark' : ''}`}>
      <WidgetZipInput onSubmit={fetchProfile} loading={loading} defaultZip={config.defaultZip} />

      {loading && (
        <div className="aw-loading">
          <div className="aw-spinner" />
        </div>
      )}

      {error && <div className="aw-error">{error}</div>}

      {data && !loading && (
        <>
          <div className="aw-status">
            {Object.entries(data.data_sources).map(([name, status]) => (
              <span key={name} className={`aw-badge ${status.available ? 'aw-badge-ok' : 'aw-badge-err'}`}>
                <span className="aw-badge-dot" />
                {name}
              </span>
            ))}
          </div>
          <WidgetTabs tabs={sections} activeTab={activeTab} onTabChange={setActiveTab} />
          <WidgetProfileView data={data} activeTab={activeTab} />
        </>
      )}

      <div className="aw-footer">
        Powered by <a href="#">Aggregate API</a>
      </div>
    </div>
  )
}
