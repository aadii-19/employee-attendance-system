/**
 * ErrorBlock — inline error display with optional retry action.
 *
 * @param {{ message: string, onRetry?: () => void }} props
 */
export default function ErrorBlock({ message, onRetry }) {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm font-medium text-[var(--color-danger)]">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  )
}
