/**
 * Status-related utilities for attendance records.
 */

/** Tailwind classes for each attendance status (light + dark variants). */
export const STATUS_STYLES = {
  present: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  late: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  half_day: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  checked_in: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

/** Default style for unknown/unrecognized statuses. */
export const STATUS_DEFAULT_STYLE = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'

/**
 * Get Tailwind class string for a given status key.
 * @param {string} status
 * @returns {string}
 */
export function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_DEFAULT_STYLE
}

/**
 * Convert a snake_case status string to a human-readable label.
 * E.g. "half_day" → "Half Day", "checked_in" → "Checked In".
 * @param {string} status
 * @returns {string}
 */
export function formatStatusLabel(status) {
  if (!status) return '—'
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
