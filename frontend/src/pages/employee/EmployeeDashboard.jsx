import useEmployeeDashboard from '../../hooks/useEmployeeDashboard'
import StatsCard from '../../components/StatsCard'
import AttendanceChart from '../../components/AttendanceChart'
import AttendancePieChart from '../../components/AttendancePieChart'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorBlock from '../../components/ErrorBlock'
import { formatDate, formatTime } from '../../utils/date'

export default function EmployeeDashboard() {
  const { data, loading, error, refetch } = useEmployeeDashboard()

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <ErrorBlock message={error} onRetry={refetch} />

  const { today, monthly_summary, attendance_percentage, recent_attendance } = data || {}

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Welcome back — here's your attendance overview.
        </p>
      </div>

      {/* Today's Status */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Today's Status
        </h2>

        <div className="flex flex-wrap items-center gap-8">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Status</p>
            <StatusBadge status={today?.status} />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Check In</p>
            <p className="mt-0.5 text-lg font-semibold text-[var(--color-text)]">
              {formatTime(today?.check_in_time)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Check Out</p>
            <p className="mt-0.5 text-lg font-semibold text-[var(--color-text)]">
              {formatTime(today?.check_out_time)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Total Hours</p>
            <p className="mt-0.5 text-lg font-semibold text-[var(--color-text)]">
              {today?.total_hours ?? '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Present"
          value={monthly_summary?.present_count ?? 0}
          subtitle="This month"
          color="#22c55e"
          icon={<CheckIcon />}
        />
        <StatsCard
          title="Late"
          value={monthly_summary?.late_count ?? 0}
          subtitle="This month"
          color="#f59e0b"
          icon={<ClockIcon />}
        />
        <StatsCard
          title="Half Days"
          value={monthly_summary?.half_day_count ?? 0}
          subtitle="This month"
          color="#3b82f6"
          icon={<HalfIcon />}
        />
        <StatsCard
          title="Total Hours"
          value={monthly_summary?.total_hours ?? 0}
          subtitle="This month"
          color="#8b5cf6"
          icon={<HoursIcon />}
        />
      </div>

      {/* Attendance Rate */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Attendance Rate
          </h2>
          <span className="text-xl font-bold text-[var(--color-primary)]">
            {attendance_percentage ?? 0}%
          </span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-alt)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-700 ease-out"
            style={{ width: `${Math.min(attendance_percentage ?? 0, 100)}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Attendance Trend
          </h2>
          <AttendanceChart data={recent_attendance} />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Monthly Distribution
          </h2>
          <AttendancePieChart
            present={monthly_summary?.present_count ?? 0}
            late={monthly_summary?.late_count ?? 0}
            halfDay={monthly_summary?.half_day_count ?? 0}
          />
        </div>
      </div>

      {/* Recent Attendance Table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Recent Attendance
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Check In</th>
                <th className="px-6 py-3">Check Out</th>
                <th className="px-6 py-3">Hours</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {recent_attendance && recent_attendance.length > 0 ? (
                recent_attendance.map((entry, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-[var(--color-surface-alt)]/50">
                    <td className="whitespace-nowrap px-6 py-3 font-medium text-[var(--color-text)]">
                      {formatDate(entry.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-[var(--color-text-muted)]">
                      {formatTime(entry.check_in_time)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-[var(--color-text-muted)]">
                      {formatTime(entry.check_out_time)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-[var(--color-text-muted)]">
                      {entry.total_hours ?? '—'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <StatusBadge status={entry.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                    No recent attendance records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ── Inline SVG Icons ──────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

function HalfIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18a9 9 0 010 18m0-18a9 9 0 000 18" />
    </svg>
  )
}

function HoursIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}
