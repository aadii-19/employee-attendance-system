import { useState, useEffect, useCallback } from 'react'
import { getAttendanceHistory } from '../api/employeeApi'

const DEFAULT_FILTERS = {
  start_date: '',
  end_date: '',
  status: '',
}

const LIMIT = 10

/**
 * useAttendanceHistory
 *
 * Manages paginated + filterable attendance history.
 * Returns data, pagination controls, filter controls, and loading/error states.
 */
export default function useAttendanceHistory() {
  const [records, setRecords] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState(DEFAULT_FILTERS)

  const fetchData = useCallback(async (page, appliedFilters) => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        page,
        limit: LIMIT,
        ...(appliedFilters.start_date && { start_date: appliedFilters.start_date }),
        ...(appliedFilters.end_date && { end_date: appliedFilters.end_date }),
        ...(appliedFilters.status && { status: appliedFilters.status }),
      }

      const response = await getAttendanceHistory(params)
      setRecords(response.data.records || [])
      setTotalPages(response.data.total_pages || 1)
      setCurrentPage(response.data.current_page || page)
    } catch (err) {
      setError(err.message || 'Failed to load attendance history')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }, [])

  /* ── Fetch on mount and when page / active filters change ──────────── */
  useEffect(() => {
    fetchData(currentPage, activeFilters)
  }, [currentPage, activeFilters, fetchData])

  /* ── Page controls ──────────────────────────────────────────────────── */
  const setPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  /* ── Filter controls ────────────────────────────────────────────────── */
  const applyFilters = () => {
    setCurrentPage(1)
    setActiveFilters({ ...filters })
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setCurrentPage(1)
    setActiveFilters(DEFAULT_FILTERS)
  }

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return {
    records,
    currentPage,
    totalPages,
    loading,
    error,
    filters,
    setPage,
    applyFilters,
    clearFilters,
    updateFilter,
  }
}
