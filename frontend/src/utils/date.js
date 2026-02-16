/**
 * Date and time formatting utilities.
 * All functions handle null/undefined gracefully and return '—' as fallback.
 */

/**
 * Format a date value to a readable short date (e.g. "Mon, Feb 16").
 * @param {string|Date|null} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

/**
 * Format a date value to a readable date with year (e.g. "Mon, Feb 16, 2026").
 * @param {string|Date|null} value
 * @returns {string}
 */
export function formatDateLong(value) {
  if (!value) return '—'
  const date = new Date(value)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format a date value to "Month Day, Year" (e.g. "February 16, 2026").
 * @param {string|Date|null} value
 * @returns {string}
 */
export function formatDateFull(value) {
  if (!value) return '—'
  const date = new Date(value)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

/**
 * Format a date value to compact form (e.g. "Feb 16, 2026").
 * @param {string|Date|null} value
 * @returns {string}
 */
export function formatDateCompact(value) {
  if (!value) return '—'
  const date = new Date(value)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Format a timestamp to readable time (e.g. "09:30 AM").
 * If the value is already a formatted string (no 'T'), return as-is.
 * @param {string|Date|null} value
 * @returns {string}
 */
export function formatTime(value) {
  if (!value) return '—'
  if (typeof value === 'string' && !value.includes('T')) return value
  const date = new Date(value)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Format a YYYY-MM month string to readable label (e.g. "February 2026").
 * @param {string} month - YYYY-MM format
 * @returns {string}
 */
export function formatMonthLabel(month) {
  if (!month) return ''
  const [year, m] = month.split('-')
  const date = new Date(year, Number(m) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/**
 * Extract initials from a full name (e.g. "John Doe" → "JD").
 * @param {string|null} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
