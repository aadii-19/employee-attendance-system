import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useManagerDashboard from '../../hooks/useManagerDashboard'
import StatsCard from '../../components/StatsCard'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorBlock from '../../components/ErrorBlock'
import { formatDate, getInitials } from '../../utils/date'

export default function ManagerDashboard() {
  const { data, loading, error, refetch } = useManagerDashboard()
  const navigate = useNavigate()

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <ErrorBlock message={error} onRetry={refetch} />

  const { total_employees, today, monthly, recent_activity } = data || {}

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Manager Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Team attendance overview at a glance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={total_employees ?? 0}
          subtitle="Active team members"
          color="#6366f1"
          icon={<UsersIcon />}
          onClick={() => navigate('/manager/employees')}
        />
        <StatsCard
          title="Present Today"
          value={today?.present ?? 0}
          subtitle="Checked in"
          color="#22c55e"
          icon={<CheckIcon />}
        />
        <StatsCard
          title="Late Today"
          value={today?.late ?? 0}
          subtitle="Arrived late"
          color="#f59e0b"
          icon={<ClockIcon />}
        />
        <StatsCard
          title="Absent Today"
          value={today?.absent ?? 0}
          subtitle="Not checked in"
          color="#ef4444"
          icon={<AbsentIcon />}
          onClick={() => navigate('/manager/employees?filter=absent')}
        />
      </div>

      {/* Charts + Monthly Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Today's Distribution
          </h2>
          <TodayPieChart today={today} />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Monthly Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <MiniStat label="Present" value={monthly?.present ?? 0} color="#22c55e" />
            <MiniStat label="Late" value={monthly?.late ?? 0} color="#f59e0b" />
            <MiniStat label="Half Day" value={monthly?.half_day ?? 0} color="#3b82f6" />
            <MiniStat label="Total Hours" value={monthly?.total_hours ?? 0} color="#8b5cf6" />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Recent Activity
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {recent_activity && recent_activity.length > 0 ? (
                recent_activity.map((entry, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-[var(--color-surface-alt)]/50">
                    <td className="whitespace-nowrap px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-semibold text-white">
                          {getInitials(entry.employee_name)}
                        </div>
                        <span className="font-medium text-[var(--color-text)]">
                          {entry.employee_name}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-[var(--color-text-muted)]">
                      {formatDate(entry.date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3">
                      <StatusBadge status={entry.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                    No recent activity.
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

/* ── Sub-components ────────────────────────────────────────────────────── */

const PIE_COLORS = {
  Present: '#22c55e',
  Late: '#f59e0b',
  'Half Day': '#3b82f6',
  Absent: '#ef4444',
}

function TodayPieChart({ today }) {
  const chartData = [
    { name: 'Present', value: today?.present ?? 0 },
    { name: 'Late', value: today?.late ?? 0 },
    { name: 'Half Day', value: today?.half_day ?? 0 },
    { name: 'Absent', value: today?.absent ?? 0 },
  ].filter((item) => item.value > 0)

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--color-text-muted)]">
        No attendance data for today
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={PIE_COLORS[entry.name]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            fontSize: '0.8125rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            color: 'var(--color-text)',
          }}
          formatter={(value, name) => [`${value} employees`, name]}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] p-4">
      <p className="text-xs font-medium text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  )
}

/* ── Inline SVG Icons ──────────────────────────────────────────────────── */

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

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

function AbsentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
