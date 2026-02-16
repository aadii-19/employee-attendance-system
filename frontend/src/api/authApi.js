import api from './axiosInstance'

/**
 * Authentication API service.
 * All functions return the unwrapped response body: { success, data?, message? }
 */

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string, role?: string }} payload
 */
export const register = async (payload) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

/**
 * Log in with email & password.
 * @param {{ email: string, password: string }} credentials
 */
export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

/**
 * Fetch the currently authenticated user's profile.
 */
export const getCurrentUser = async () => {
  const { data } = await api.get('/auth/me')
  return data
}
