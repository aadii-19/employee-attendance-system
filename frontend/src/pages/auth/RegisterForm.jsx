import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Step 2 — Registration Form
 *
 * The role is inferred from the URL param (:role).
 * Fields: Full Name, Email, Password, Confirm Password.
 */
export default function RegisterForm() {
  const { role } = useParams()
  const { register } = useAuth()
  const navigate = useNavigate()

  const validRole = role === 'employee' || role === 'manager'

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setSubmitting(true)

    try {
      await register({ full_name: form.full_name, email: form.email, password: form.password, role })
      setSuccess('Account created! Redirecting to dashboard...')
      const dashboardPath = role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'
      setTimeout(() => navigate(dashboardPath), 1000)
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (!validRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 transition-colors">
        <div className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-8 text-center shadow-sm">
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">Invalid registration role.</p>
          <Link to="/register" className="text-blue-500 hover:underline">
            Go back to role selection
          </Link>
        </div>
      </div>
    )
  }

  const isManager = role === 'manager'
  const roleLabel = isManager ? 'Manager' : 'Employee'

  const inputClass = 'w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 transition-colors">
      <div className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/register"
            className="mb-3 inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Change role
          </Link>

          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Register as {roleLabel}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Fill in your details to create your account.
          </p>
        </div>

        {/* Role indicator */}
        <div className={`mb-5 flex items-center gap-2 rounded-lg border px-3 py-2 ${
          isManager
            ? 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
            : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
        }`}>
          <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
            isManager ? 'bg-purple-500' : 'bg-blue-500'
          } text-white`}>
            {isManager ? (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            )}
          </div>
          <span className={`text-sm font-medium ${
            isManager ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300'
          }`}>
            Registering as {roleLabel}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="reg-full-name" className="mb-1 block text-sm font-medium text-[var(--color-text-muted)]">Full Name</label>
            <input
              id="reg-full-name"
              type="text"
              placeholder="John Doe"
              value={form.full_name}
              onChange={(e) => updateField('full_name', e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-[var(--color-text-muted)]">Email</label>
            <input
              id="reg-email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-[var(--color-text-muted)]">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              minLength={6}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="reg-confirm-password" className="mb-1 block text-sm font-medium text-[var(--color-text-muted)]">Confirm Password</label>
            <input
              id="reg-confirm-password"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm_password}
              onChange={(e) => updateField('confirm_password', e.target.value)}
              required
              minLength={6}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`mt-1 rounded-lg py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
              isManager
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-5 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
