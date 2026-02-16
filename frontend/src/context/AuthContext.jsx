import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import * as authApi from '../api/authApi'

const AuthContext = createContext(null)

/**
 * AuthProvider — manages authentication state for the entire app.
 *
 * On mount, checks localStorage for an existing token and
 * attempts to hydrate the user by calling GET /auth/me.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  /* ── Derived state ───────────────────────────────────────────────────── */
  const isAuthenticated = !!token && !!user
  const role = user?.role ?? null

  /* ── Hydrate user from token ─────────────────────────────────────────── */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await authApi.getCurrentUser()
      setUser(response.data.user)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    }
  }, [])

  /* ── Login ──────────────────────────────────────────────────────────── */
  const login = useCallback(async (email, password) => {
    const response = await authApi.login({ email, password })
    const { token: newToken, user: loggedInUser } = response.data

    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(loggedInUser)

    return response
  }, [])

  /* ── Register ──────────────────────────────────────────────────────── */
  const register = useCallback(async (payload) => {
    const response = await authApi.register(payload)
    const { token: newToken, user: newUser } = response.data

    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)

    return response
  }, [])

  /* ── Logout ─────────────────────────────────────────────────────────── */
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  /* ── Hydrate on mount ───────────────────────────────────────────────── */
  useEffect(() => {
    const hydrate = async () => {
      if (token) {
        await fetchCurrentUser()
      }
      setLoading(false)
    }
    hydrate()
  }, [token, fetchCurrentUser])

  /* ── Context value (memoised) ────────────────────────────────────────── */
  const value = useMemo(
    () => ({
      user,
      token,
      role,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      fetchCurrentUser,
    }),
    [user, token, role, loading, isAuthenticated, login, register, logout, fetchCurrentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth — provides typed access to auth state and actions.
 * Must be used inside an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}

export default AuthContext
