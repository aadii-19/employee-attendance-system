import api from './axiosInstance'

/**
 * Manager-facing API service.
 * All functions return the unwrapped response body: { success, data?, message? }
 */

/**
 * Get a list of employees (optionally paginated / filtered).
 * @param {{ page?: number, limit?: number, search?: string }} params
 */
export const getEmployees = async (params = {}) => {
  const { data } = await api.get('/manager/employees', { params })
  return data
}

/**
 * Get attendance records for a specific employee.
 * @param {string} employeeId
 * @param {{ page?: number, limit?: number, startDate?: string, endDate?: string, status?: string }} params
 */
export const getEmployeeAttendance = async (employeeId, params = {}) => {
  const { data } = await api.get(`/manager/employees/${employeeId}/attendance`, { params })
  return data
}

/**
 * Get monthly attendance summary for a specific employee.
 * @param {string} employeeId
 * @param {{ month?: string }} params – month in YYYY-MM format
 */
export const getEmployeeMonthly = async (employeeId, params = {}) => {
  const { data } = await api.get(`/manager/employees/${employeeId}/monthly`, { params })
  return data
}

/**
 * Get the manager dashboard summary (team stats, alerts, etc.).
 */
export const getManagerDashboard = async () => {
  const { data } = await api.get('/manager/dashboard')
  return data
}

/**
 * Export a specific employee's attendance as a CSV file.
 * Returns a Blob that can be used to trigger a download.
 * @param {string} employeeId
 * @param {{ month?: string }} params
 */
export const exportEmployeeCSV = async (employeeId, params = {}) => {
  const { data } = await api.get(`/manager/employees/${employeeId}/export`, {
    params,
    responseType: 'blob',
  })
  return data
}
