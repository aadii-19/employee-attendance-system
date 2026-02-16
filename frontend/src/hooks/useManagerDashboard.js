import { useState, useEffect } from 'react'
import { getManagerDashboard } from '../api/managerApi'

/**
 * useManagerDashboard
 *
 * Fetches the manager dashboard overview on mount.
 * Returns { data, loading, error, refetch }.
 */
export default function useManagerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getManagerDashboard()
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
