import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useEmployeeDetail from '../../hooks/useEmployeeDetail'
import { exportEmployeeCSV } from '../../api/managerApi'
import StatsCard from '../../components/StatsCard'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { formatDateLong, formatDateCompact, formatTime, formatMonthLabel, getInitials } from '../../utils/date'

export default function EmployeeDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const employee = location.state?.employee || null

  const {
    employeeId,
    month,
    setMonth,
    summary,
    records,
    loading,
    error,
  } = useEmployeeDetail()

  const [exporting, setExporting] = useState(false)

  /** Download attendance data as CSV for the selected month. */
  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportEmployeeCSV(employeeId, { month })
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `attendance_${employeeId}_${month}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (exportError) {
      alert(exportError.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back + Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/manager/employees')}
            className="mb-2 flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Employees
          </button>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Employee Detail</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Monthly attendance overview and records.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || loading}
          className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
        >
          {exporting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          )}
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Employee Info Card */}
      {employee && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-bold text-white">
              {getInitials(employee.full_name)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {employee.full_name}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">{employee.email}</p>
              {employee.created_at && (
                <p className="mt-0.5 text-xs text-[var(--color-text-muted)] opacity-60">
                  Joined {formatDateCompact(employee.created_at)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Month Selector */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="month-selector" className="text-sm font-medium text-[var(--color-text-muted)]">Select Month</label>
          <input
            id="month-selector"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && <LoadingSpinner message="Loading attendance data..." height="h-48" />}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>
        </div>
      )}

      {/* Data sections */}
      {!loading && !error && (
        <>
          {/* Monthly Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Present"
              value={summary?.present_count ?? 0}
              subtitle={formatMonthLabel(month)}
              color="#22c55e"
              icon={<CheckIcon />}
            />
            <StatsCard
              title="Late"
              value={summary?.late_count ?? 0}
              subtitle={formatMonthLabel(month)}
              color="#f59e0b"
              icon={<ClockIcon />}
            />
            <StatsCard
              title="Half Days"
              value={summary?.half_day_count ?? 0}
              subtitle={formatMonthLabel(month)}
              color="#3b82f6"
              icon={<HalfIcon />}
            />
            <StatsCard
              title="Total Hours"
              value={summary?.total_hours ?? 0}
              subtitle={formatMonthLabel(month)}
              color="#8b5cf6"
              icon={<HoursIcon />}
            />
          </div>

          {/* Attendance Table */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Check In</th>
                    <th className="px-6 py-3">Check Out</th>
                    <th className="px-6 py-3">Total Hours</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {records.length > 0 ? (
                    records.map((entry, idx) => (
                      <tr key={idx} className="transition-colors hover:bg-[var(--color-surface-alt)]/50">
                        <td className="whitespace-nowrap px-6 py-3 font-medium text-[var(--color-text)]">
                          {formatDateLong(entry.date)}
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
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="h-10 w-10 text-[var(--color-text-muted)] opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm font-medium text-[var(--color-text-muted)]">No records for this month</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
