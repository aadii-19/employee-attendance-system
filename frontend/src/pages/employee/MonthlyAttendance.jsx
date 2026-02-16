import useMonthlyAttendance from '../../hooks/useMonthlyAttendance'
import AttendanceCalendar from '../../components/AttendanceCalendar'
import StatsCard from '../../components/StatsCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorBlock from '../../components/ErrorBlock'
import { formatMonthLabel } from '../../utils/date'

export default function MonthlyAttendance() {
  const {
    month,
    setMonth,
    summary,
    recordMap,
    loading,
    error,
    refetch,
  } = useMonthlyAttendance()

  return (
    <div className="space-y-6">
      {/* Page header + month selector */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Monthly Attendance</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Calendar view of your attendance for {formatMonthLabel(month) || 'this month'}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="monthly-month" className="text-sm font-medium text-[var(--color-text-muted)]">
            Month
          </label>
          <input
            id="monthly-month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Loading / Error states */}
      {loading && <LoadingSpinner message="Loading attendance data..." height="h-48" />}
      {!loading && error && <ErrorBlock message={error} onRetry={refetch} />}

      {/* Data sections */}
      {!loading && !error && summary && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard
              title="Present"
              value={summary.presentCount}
              subtitle={formatMonthLabel(month)}
              color="#3b82f6"
              icon={<CheckIcon />}
            />
            <StatsCard
              title="Late"
              value={summary.lateCount}
              subtitle={formatMonthLabel(month)}
              color="#f59e0b"
              icon={<ClockIcon />}
            />
            <StatsCard
              title="Half Day"
              value={summary.halfDayCount}
              subtitle={formatMonthLabel(month)}
              color="#8b5cf6"
              icon={<HalfIcon />}
            />
            <StatsCard
              title="Total Hours"
              value={summary.totalHours}
              subtitle={formatMonthLabel(month)}
              color="#22c55e"
              icon={<HoursIcon />}
            />
          </div>

          {/* Calendar card */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
            <AttendanceCalendar recordMap={recordMap} month={month} />
          </div>
        </>
      )}
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
