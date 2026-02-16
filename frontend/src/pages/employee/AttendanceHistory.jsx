import useAttendanceHistory from '../../hooks/useAttendanceHistory'
import StatusBadge from '../../components/StatusBadge'
import { formatDateLong, formatTime } from '../../utils/date'

const INPUT_CLASS =
  'rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]'

export default function AttendanceHistory() {
  const {
    records,
    currentPage,
    totalPages,
    loading,
    error,
    filters,
    setPage,
    applyFilters,
    clearFilters,
    updateFilter,
  } = useAttendanceHistory()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Attendance History</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          View and filter your past attendance records.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="filter-start-date" className="text-xs font-medium text-[var(--color-text-muted)]">Start Date</label>
            <input
              id="filter-start-date"
              type="date"
              value={filters.start_date}
              onChange={(e) => updateFilter('start_date', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filter-end-date" className="text-xs font-medium text-[var(--color-text-muted)]">End Date</label>
            <input
              id="filter-end-date"
              type="date"
              value={filters.end_date}
              onChange={(e) => updateFilter('end_date', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filter-status" className="text-xs font-medium text-[var(--color-text-muted)]">Status</label>
            <select
              id="filter-status"
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className={INPUT_CLASS}
            >
              <option value="">All</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-7 w-7 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
                      <p className="text-sm text-[var(--color-text-muted)]">Loading records...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-10 w-10 text-[var(--color-text-muted)] opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm font-medium text-[var(--color-text-muted)]">No records found</p>
                      <p className="text-xs text-[var(--color-text-muted)] opacity-60">Try adjusting your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
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
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && !error && records.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 shadow-sm">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Previous
          </button>

          <span className="text-sm text-[var(--color-text-muted)]">
            Page <span className="font-semibold text-[var(--color-text)]">{currentPage}</span> of{' '}
            <span className="font-semibold text-[var(--color-text)]">{totalPages}</span>
          </span>

          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
