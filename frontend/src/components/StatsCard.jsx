/**
 * StatsCard
 *
 * Reusable metric card for dashboard grids.
 *
 * @param {{ title: string, value: string|number, subtitle?: string, icon?: React.ReactNode, color?: string, onClick?: () => void }} props
 */
export default function StatsCard({ title, value, subtitle, icon, color = 'var(--color-primary)', onClick }) {
  const clickable = typeof onClick === 'function'

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition-all hover:shadow-md ${
        clickable ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-muted)]">{title}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
          >
            <div style={{ color }} className="h-5 w-5">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
