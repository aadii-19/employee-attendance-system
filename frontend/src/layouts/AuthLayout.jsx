import { Outlet } from 'react-router-dom'

/**
 * Minimal layout for authentication pages (login, register, etc.)
 * No sidebar or navigation — just centered content.
 */
export default function AuthLayout() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-secondary-dark)]">
      <div className="w-full max-w-md rounded-xl bg-[var(--color-surface)] p-8 shadow-lg">
        <Outlet />
      </div>
    </div>
  )
}
