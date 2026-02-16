import { useNavigate } from 'react-router-dom'
import useEmployees from '../../hooks/useEmployees'
import { formatDateCompact, getInitials } from '../../utils/date'

export default function EmployeesList() {
  const { employees, currentPage, totalPages, loading, error, filter, setPage } = useEmployees()
  const navigate = useNavigate()

  const isAbsentFilter = filter === 'absent'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {isAbsentFilter ? 'Absent Employees' : 'Employees'}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {isAbsentFilter
              ? 'Employees who have not checked in today.'
              : 'View and manage your team members.'}
          </p>
        </div>

        {isAbsentFilter && (
          <button
            type="button"
            onClick={() => navigate('/manager/employees')}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-alt)]"
          >
            Show All Employees
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-7 w-7 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
                      <p className="text-sm text-[var(--color-text-muted)]">Loading employees...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-sm font-medium text-[var(--color-danger)]">{error}</p>
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-10 w-10 text-[var(--color-text-muted)] opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      <p className="text-sm font-medium text-[var(--color-text-muted)]">No employees found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    onClick={() => navigate(`/manager/employees/${employee.id}`, { state: { employee } })}
                    className="cursor-pointer transition-colors hover:bg-[var(--color-surface-alt)]/60"
                  >
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">
                          {getInitials(employee.full_name)}
                        </div>
                        <span className="font-medium text-[var(--color-text)]">{employee.full_name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-[var(--color-text-muted)]">
                      {employee.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-[var(--color-text-muted)]">
                      {formatDateCompact(employee.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`View ${employee.full_name}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/manager/employees/${employee.id}`, { state: { employee } })
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                      >
                        View
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && !error && employees.length > 0 && (
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
