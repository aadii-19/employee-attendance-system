/**
 * EmptyState — placeholder for empty data views.
 *
 * @param {{ icon?: React.ReactNode, title?: string, subtitle?: string }} props
 */
export default function EmptyState({
  icon,
  title = 'No data found',
  subtitle,
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      {icon && (
        <div className="text-[var(--color-text-muted)] opacity-40">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-[var(--color-text-muted)]">{title}</p>
      {subtitle && (
        <p className="text-xs text-[var(--color-text-muted)] opacity-60">{subtitle}</p>
      )}
    </div>
  )
}
