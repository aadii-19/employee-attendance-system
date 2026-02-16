import { useState, useEffect, useCallback } from 'react'
import { getTodayAttendance } from '../api/employeeApi'

/**
 * useTodayAttendance
 *
 * Fetches today's attendance record on mount.
 * Returns { today, loading, error, refresh }.
 */
export default function useTodayAttendance() {
  const [today, setToday] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getTodayAttendance()
      setToday(response.data)
    } catch (err) {
      setError(err.message || 'Failed to load attendance')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { today, loading, error, refresh }
}
