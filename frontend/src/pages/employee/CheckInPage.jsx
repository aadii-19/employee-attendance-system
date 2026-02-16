import { useState, useEffect } from 'react'
import useTodayAttendance from '../../hooks/useTodayAttendance'
import { checkIn, checkOut } from '../../api/employeeApi'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { formatTime } from '../../utils/date'

export default function CheckInPage() {
  const { today, loading, refresh } = useTodayAttendance()

  const [time, setTime] = useState(new Date())
  const [processing, setProcessing] = useState(false)
  const [toast, setToast] = useState(null)

  /* Live clock — updates every second */
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  /* Auto-dismiss toast after 3.5 seconds */
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(id)
  }, [toast])

  const hasCheckedIn = !!today?.check_in_time
  const hasCheckedOut = !!today?.check_out_time
  const isCompleted = hasCheckedIn && hasCheckedOut

  const handleAction = async () => {
    setProcessing(true)
    try {
      if (!hasCheckedIn) {
        await checkIn()
        setToast({ type: 'success', message: 'Checked in successfully!' })
      } else {
        await checkOut()
        setToast({ type: 'success', message: 'Checked out successfully!' })
      }
      await refresh()
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Action failed' })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading attendance..." />

  /* CTA button styling based on current state */
  let ctaLabel = 'Check In'
  let ctaClass = 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white'

  if (hasCheckedIn && !hasCheckedOut) {
    ctaLabel = 'Check Out'
    ctaClass = 'bg-amber-500 hover:bg-amber-600 text-white'
  }
  if (isCompleted) {
    ctaLabel = 'Completed'
    ctaClass = 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] cursor-not-allowed'
  }

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Check In / Out</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Mark your attendance for today.
        </p>
      </div>

      {/* Live Clock */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-[var(--color-text-muted)]">{formattedDate}</p>
        <p className="mt-2 font-mono text-5xl font-bold tracking-wider text-[var(--color-text)] tabular-nums">
          {time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          })}
        </p>
      </div>

      {/* Today Status Card */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Today's Attendance
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Status</p>
            <StatusBadge status={today?.status} />
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Check In</p>
            <p className="mt-0.5 text-base font-semibold text-[var(--color-text)]">
              {formatTime(today?.check_in_time)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Check Out</p>
            <p className="mt-0.5 text-base font-semibold text-[var(--color-text)]">
              {formatTime(today?.check_out_time)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">Hours</p>
            <p className="mt-0.5 text-base font-semibold text-[var(--color-text)]">
              {today?.total_hours ?? '—'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <button
          type="button"
          onClick={handleAction}
          disabled={isCompleted || processing}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-lg font-semibold transition-all duration-200 ${ctaClass} disabled:opacity-100`}
        >
          {processing && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {processing ? 'Processing...' : ctaLabel}
        </button>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  )
}
