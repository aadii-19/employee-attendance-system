import api from './axiosInstance'

export const checkIn = async (payload = {}) => {
  const { data } = await api.post('/employee/check-in', payload)
  return data
}

export const checkOut = async (payload = {}) => {
  const { data } = await api.put('/employee/check-out', payload)
  return data
}

export const getTodayAttendance = async () => {
  const { data } = await api.get('/employee/attendance/today')
  return data
}

export const getAttendanceHistory = async (params = {}) => {
  const { data } = await api.get('/employee/attendance', { params })
  return data
}

export const getMonthlyAttendance = async (params = {}) => {
  const { data } = await api.get('/employee/attendance/monthly', { params })
  return data
}

export const getEmployeeDashboard = async () => {
  const { data } = await api.get('/employee/dashboard')
  return data
}
