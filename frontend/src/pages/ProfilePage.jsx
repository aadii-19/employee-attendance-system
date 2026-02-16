import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { formatDateFull, getInitials } from '../utils/date'

export default function ProfilePage() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.full_name || user?.name || 'User'
  const email = user?.email || '—'
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : '—'
  const joinedDate = user?.created_at ? formatDateFull(user.created_at) : '—'
  const initials = getInitials(displayName)

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return
    logout()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Profile</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Your account information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl font-bold text-white shadow-md">
            {initials}
          </div>

          <h2 className="mt-4 text-xl font-semibold text-[var(--color-text)]">
            {displayName}
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">{email}</p>

          <span
            className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              role === 'manager'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
            }`}
          >
            {roleLabel}
          </span>

          <p className="mt-3 text-xs text-[var(--color-text-muted)] opacity-60">
            Member since {joinedDate}
          </p>
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="border-b border-[var(--color-border)] px-6 py-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Account Details
          </h3>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          <DetailRow label="Full Name" value={displayName} />
          <DetailRow label="Email" value={email} />
          <DetailRow label="Role" value={roleLabel} />
          <DetailRow label="Joined" value={joinedDate} />
        </div>
      </div>

      {/* Actions */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled
            className="flex-1 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Change Password
            </span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Logout
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ────────────────────────────────────────────────────── */

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5">
      <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--color-text)]">{value}</span>
    </div>
  )
}
