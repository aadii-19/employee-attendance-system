/**
 * LoadingSpinner — centered spinner with optional message.
 *
 * @param {{ message?: string, height?: string }} props
 */
export default function LoadingSpinner({ message = 'Loading...', height = 'h-96' }) {
  return (
    <div className={`flex ${height} items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-muted)]">{message}</p>
      </div>
    </div>
  )
}
