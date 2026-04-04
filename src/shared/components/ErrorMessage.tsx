interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="px-5 py-4 flex items-start gap-3" role="alert">
      <svg className="w-5 h-5 text-[var(--color-red)] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-[var(--color-red)] break-words">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-[13px] text-[var(--color-text-sub)] hover:text-[var(--color-text)] transition underline underline-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
