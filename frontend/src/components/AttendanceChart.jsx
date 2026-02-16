import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

/**
 * AttendanceChart
 *
 * Renders a line chart of attendance hours over time.
 *
 * @param {{ data: Array<{ date: string, total_hours: number }> }} props
 */
export default function AttendanceChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--color-text-muted)]">
        No attendance data to display
      </div>
    )
  }

  // Format dates for X-axis labels (e.g. "Feb 16")
  const chartData = data.map((entry) => {
    const d = new Date(entry.date)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return {
      ...entry,
      label,
      hours: Number(entry.total_hours) || 0,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
          axisLine={{ stroke: 'var(--color-border)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
          axisLine={false}
          tickLine={false}
          domain={[0, 'auto']}
          unit="h"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            fontSize: '0.8125rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            color: 'var(--color-text)',
          }}
          formatter={(value) => [`${value} hrs`, 'Hours Worked']}
          labelFormatter={(label) => label}
        />
        <Line
          type="monotone"
          dataKey="hours"
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: 'var(--color-primary)', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: 'var(--color-primary)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
