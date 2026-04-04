import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center px-8">
          <div className="h-14 w-14 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center mb-5">
            <svg className="w-7 h-7 text-[var(--color-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-[18px] font-semibold text-[var(--color-text)] mb-2">Something went wrong</h2>
          <p className="text-[14px] text-[var(--color-text-sub)] mb-6 max-w-[360px]">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
            className="rounded-xl bg-[var(--color-gold)] px-6 py-3 font-semibold text-[var(--color-bg-base)] text-[14px] hover:brightness-110 transition"
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
