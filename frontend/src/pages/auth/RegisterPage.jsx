import { useNavigate, Link } from 'react-router-dom'

/**
 * Step 1 — Role Selection
 *
 * Two cards: Employee / Manager
 * Clicking navigates to /register/employee or /register/manager
 */
export default function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 transition-colors">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Create an Account</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Choose your role to get started with AttendEase.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Employee card */}
          <button
            type="button"
            onClick={() => navigate('/register/employee')}
            className="group flex flex-col items-center rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white dark:bg-blue-900/40 dark:text-blue-400">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">Employee</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Track your attendance, check in/out, and view reports.
            </p>
          </button>

          {/* Manager card */}
          <button
            type="button"
            onClick={() => navigate('/register/manager')}
            className="group flex flex-col items-center rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-500 group-hover:text-white dark:bg-purple-900/40 dark:text-purple-400">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">Manager</h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              Manage your team, view reports, and export data.
            </p>
          </button>
        </div>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
