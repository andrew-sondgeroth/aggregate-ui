import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center px-8">
      <span className="text-[72px] font-[var(--font-display)] text-[var(--color-gold)] leading-none mb-4">404</span>
      <h1 className="text-[22px] font-semibold text-[var(--color-text)] mb-2">Page not found</h1>
      <p className="text-[15px] text-[var(--color-text-sub)] mb-8 max-w-[360px]">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="rounded-xl bg-[var(--color-gold)] px-6 py-3 font-semibold text-[var(--color-bg-base)] text-[14px] hover:brightness-110 transition"
        >
          Home
        </Link>
        <Link
          to="/explore"
          className="rounded-xl border border-[var(--color-border)] px-6 py-3 font-semibold text-[var(--color-text)] text-[14px] hover:border-[var(--color-border-hover)] transition"
        >
          Explore
        </Link>
      </div>
    </div>
  )
}
