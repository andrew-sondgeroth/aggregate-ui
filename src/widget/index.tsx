import { createRoot } from 'react-dom/client'
import AggregateWidgetApp from './AggregateWidget'
import type { WidgetConfig } from './AggregateWidget'
import widgetStyles from './styles/widget.css?inline'

function init(config: WidgetConfig & { container: string }) {
  const target = document.querySelector(config.container)
  if (!target) {
    console.error(`[AggregateWidget] Container "${config.container}" not found`)
    return
  }

  // Create shadow DOM for style isolation
  const shadow = target.attachShadow({ mode: 'open' })

  // Inject styles
  const styleEl = document.createElement('style')
  styleEl.textContent = widgetStyles
  shadow.appendChild(styleEl)

  // Mount React
  const mountPoint = document.createElement('div')
  shadow.appendChild(mountPoint)

  createRoot(mountPoint).render(<AggregateWidgetApp config={config} />)
}

// Expose on window for IIFE usage
;(window as unknown as Record<string, unknown>).AggregateWidget = { init }

export { init }
