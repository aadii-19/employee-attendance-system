import { useState, useEffect } from 'react'
import { getEmployeeDashboard } from '../api/employeeApi'

/**
 * useEmployeeDashboard
 *
 * Fetches the employee dashboard data on mount.
 * Returns { data, loading, error, refetch }.
 */
export default function useEmployeeDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getEmployeeDashboard()
      setData(response.data)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return { data, loading, error, refetch: fetchDashboard }
}
