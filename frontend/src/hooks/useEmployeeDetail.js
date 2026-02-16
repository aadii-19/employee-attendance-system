import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getEmployeeMonthly } from '../api/managerApi'

/**
 * useEmployeeDetail
 *
 * Fetches monthly attendance data for a specific employee.
 * Manages month selection and data/loading/error states.
 */
export default function useEmployeeDetail() {
  const { id } = useParams()

  // Default to current month in YYYY-MM format
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const [summary, setSummary] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getEmployeeMonthly(id, { month })
      setSummary(response.data.summary || null)
      setRecords(response.data.records || [])
    } catch (err) {
      setError(err.message || 'Failed to load employee data')
      setSummary(null)
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [id, month])

  useEffect(() => {
    if (id) fetchData()
  }, [id, fetchData])

  return {
    employeeId: id,
    month,
    setMonth,
    summary,
    records,
    loading,
    error,
    refetch: fetchData,
  }
}
