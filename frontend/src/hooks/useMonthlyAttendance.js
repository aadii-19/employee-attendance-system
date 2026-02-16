import { useState, useEffect, useMemo } from 'react'
import { getMonthlyAttendance } from '../api/employeeApi'

/**
 * Formats a Date object to YYYY-MM-DD string (local timezone).
 * @param {Date} date
 * @returns {string}
 */
function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * useMonthlyAttendance — fetches monthly attendance and builds a lookup map.
 *
 * @returns {{
 *   month: string,
 *   setMonth: Function,
 *   summary: object|null,
 *   records: Array,
 *   recordMap: Record<string, object>,
 *   loading: boolean,
 *   error: string|null,
 *   refetch: Function
 * }}
 */
export default function useMonthlyAttendance() {
  const now = new Date()
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const [month, setMonth] = useState(defaultMonth)
  const [summary, setSummary] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getMonthlyAttendance({ month })
      const data = response.data

const summaryData = data.summary ?? {}

setSummary({
  presentCount: summaryData.present_count ?? 0,
  lateCount: summaryData.late_count ?? 0,
  halfDayCount: summaryData.half_day_count ?? 0,
  totalHours: summaryData.total_hours ?? 0,
})

setRecords(data.records ?? [])

    } catch (err) {
      setError(err.message || 'Failed to load monthly attendance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [month])

  /** Map of "YYYY-MM-DD" → record object for O(1) calendar lookups. */
  const recordMap = useMemo(() => {
    const map = {}
    for (const record of records) {
      if (!record.date) continue
      const dateObj = new Date(record.date)
      const key = toDateKey(dateObj)
      map[key] = record
    }
    return map
  }, [records])

  return { month, setMonth, summary, records, recordMap, loading, error, refetch: fetchData }
}
