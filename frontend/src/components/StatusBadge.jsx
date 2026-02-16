import { getStatusStyle, formatStatusLabel } from '../utils/status'

/**
 * StatusBadge — renders a colored pill for an attendance status.
 *
 * @param {{ status: string|null, className?: string }} props
 */
export default function StatusBadge({ status, className = '' }) {
  if (!status) {
    return <span className={`text-sm text-[var(--color-text-muted)] ${className}`}>—</span>
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusStyle(status)} ${className}`}
    >
      {formatStatusLabel(status)}
    </span>
  )
}
