import axios from 'axios'

/**
 * Pre-configured Axios instance.
 * Base URL and interceptors should be set here.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/* ── Request interceptor ──────────────────────────────────────────────── */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/* ── Response interceptor ─────────────────────────────────────────────── */
axiosInstance.interceptors.response.use(
  (response) => {
    // If backend wraps success=false but status is 200
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.message || 'Request failed'))
    }

    return response
  },
  (error) => {
    if (error.response) {
      const status = error.response.status

      if (status === 401) {
        // Token invalid or expired
        localStorage.removeItem('token')
        window.location.href = '/login'
      }

      if (status === 403) {
        window.location.href = '/access-denied'
      }

      const message =
        error.response.data?.message || 'Something went wrong'

      return Promise.reject(new Error(message))
    }

    return Promise.reject(error)
  },
)


export default axiosInstance
