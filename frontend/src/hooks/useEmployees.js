import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getEmployees } from '../api/managerApi'

const LIMIT = 10

/**
 * useEmployees
 *
 * Manages paginated employee list for the manager view.
 * Supports ?filter=absent query param for drilldown from dashboard.
 */
export default function useEmployees() {
  const [searchParams] = useSearchParams()
  const filter = searchParams.get('filter') || null

  const [employees, setEmployees] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEmployees = useCallback(async (page, activeFilter) => {
    setLoading(true)
    setError(null)

    try {
      const params = { page, limit: LIMIT }
      if (activeFilter) params.filter = activeFilter

      const response = await getEmployees(params)
      setEmployees(response.data.employees || [])
      setTotalPages(response.data.total_pages || 1)
      setCurrentPage(response.data.current_page || page)
    } catch (err) {
      setError(err.message || 'Failed to load employees')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEmployees(currentPage, filter)
  }, [currentPage, filter, fetchEmployees])

  const setPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return {
    employees,
    currentPage,
    totalPages,
    loading,
    error,
    filter,
    setPage,
  }
}
