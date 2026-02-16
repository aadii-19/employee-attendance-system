import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = {
  Present: '#2563EB',
  Late: '#F59E0B',
  'Half Day': '#8B5CF6',
}

/**
 * AttendancePieChart
 *
 * Renders a donut-style pie chart of monthly attendance distribution.
 *
 * @param {{ present: number, late: number, halfDay: number }} props
 */
export default function AttendancePieChart({ present = 0, late = 0, halfDay = 0 }) {
  const chartData = [
    { name: 'Present', value: present },
    { name: 'Late', value: late },
    { name: 'Half Day', value: halfDay },
  ].filter((entry) => entry.value > 0)

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--color-text-muted)]">
        No attendance data to display
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
          animationEasing="ease-out"
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLORS[entry.name]}
              stroke="none"
            />
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
          formatter={(value, name) => [`${value} days`, name]}
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
