import { useNavigate } from 'react-router-dom'

/**
 * AccessDenied page — shown when user lacks the required role.
 */
export default function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-8 text-center shadow-md">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <svg
            className="h-8 w-8 text-[var(--color-danger)]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-[var(--color-text)]">Access Denied</h1>
        <p className="mb-6 text-sm text-[var(--color-text-muted)]">
          You don't have permission to view this page. Please contact your administrator if you
          believe this is an error.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)] focus:ring-offset-2"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
}
