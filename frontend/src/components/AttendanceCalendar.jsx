import { useState, useRef, useEffect } from 'react'
import Calendar from 'react-calendar'
import { formatTime } from '../utils/date'
import { formatStatusLabel } from '../utils/status'

/**
 * Color configuration for each attendance status.
 * Uses CSS custom properties for theme compatibility.
 */
const STATUS_COLORS = {
  present: { bg: '#3b82f6', label: 'Present' },
  late: { bg: '#f59e0b', label: 'Late' },
  half_day: { bg: '#8b5cf6', label: 'Half Day' },
  checked_in: { bg: '#22c55e', label: 'Checked In' },
}

/**
 * Formats a Date to YYYY-MM-DD string (local timezone).
 */
function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * AttendanceCalendar — calendar component that color‑codes days by status.
 *
 * @param {{ recordMap: Record<string, object>, month: string }} props
 *   - recordMap: date‑key → attendance record lookup
 *   - month: current YYYY‑MM string
 */
export default function AttendanceCalendar({ recordMap, month }) {
  const [tooltip, setTooltip] = useState(null)
  const tooltipRef = useRef(null)
  const calendarRef = useRef(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  /** Derive the active date range from the month prop. */
  const [year, mon] = month.split('-').map(Number)
  const activeStartDate = new Date(year, mon - 1, 1)

  /** Close tooltip when clicking outside. */
  useEffect(() => {
    function handleClickOutside(e) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target)) {
        setTooltip(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  /** Assign status-based CSS classes to calendar tiles. */
  function tileClassName({ date, view }) {
    if (view !== 'month') return ''
    const key = toDateKey(date)
    const record = recordMap[key]
    const isFuture = date > today

    const classes = ['attendance-tile']

    if (isFuture) {
      classes.push('tile-future')
    } else if (record) {
      const status = record.status
      if (status === 'present') classes.push('tile-present')
      else if (status === 'late') classes.push('tile-late')
      else if (status === 'half-day') classes.push('tile-half-day')
      else if (status === 'checked-in') classes.push('tile-checked-in')
    }

    return classes.join(' ')
  }

  /** Render status dot indicator inside each tile. */
  function tileContent({ date, view }) {
    if (view !== 'month') return null
    const key = toDateKey(date)
    const record = recordMap[key]
    const isFuture = date > today

    if (isFuture || !record) return null

    const statusConfig = STATUS_COLORS[record.status]
    if (!statusConfig) return null

    return (
      <div className="tile-dot-wrapper">
        <span
          className="tile-dot"
          style={{ backgroundColor: statusConfig.bg }}
        />
      </div>
    )
  }

  /** Handle day click to show tooltip popover. */
  function handleDayClick(date) {
    const key = toDateKey(date)
    const record = recordMap[key]
    const isFuture = date > today

    if (isFuture || !record) {
      setTooltip(null)
      return
    }

    setTooltip({ date: key, record })
  }

  return (
    <div className="attendance-calendar-wrapper" ref={calendarRef}>
      <Calendar
        activeStartDate={activeStartDate}
        onActiveStartDateChange={() => {}}
        value={null}
        onClickDay={handleDayClick}
        tileClassName={tileClassName}
        tileContent={tileContent}
        showNavigation={false}
        locale="en-US"
        minDetail="month"
        maxDetail="month"
      />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        {Object.entries(STATUS_COLORS).map(([status, config]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: config.bg }}
            />
            <span className="text-xs text-[var(--color-text-muted)]">{config.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-border)]" />
          <span className="text-xs text-[var(--color-text-muted)]">No Record</span>
        </div>
      </div>

      {/* Tooltip popover */}
      {tooltip && (
        <div
          ref={tooltipRef}
          className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-md"
        >
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[var(--color-text)]">
              {new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </h4>
            <button
              type="button"
              onClick={() => setTooltip(null)}
              className="rounded p-0.5 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
              aria-label="Close tooltip"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Status</p>
              <p className="mt-0.5 font-medium" style={{ color: STATUS_COLORS[tooltip.record.status]?.bg || 'var(--color-text)' }}>
                {formatStatusLabel(tooltip.record.status)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Total Hours</p>
              <p className="mt-0.5 font-medium text-[var(--color-text)]">
                {tooltip.record.total_hours ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Check In</p>
              <p className="mt-0.5 font-medium text-[var(--color-text)]">
                {formatTime(tooltip.record.check_in_time)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Check Out</p>
              <p className="mt-0.5 font-medium text-[var(--color-text)]">
                {formatTime(tooltip.record.check_out_time)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
