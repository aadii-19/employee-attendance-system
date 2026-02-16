import { Outlet } from 'react-router-dom'

/**
 * Main application layout shell.
 * Add sidebar, navbar, and footer here when ready.
 */
export default function MainLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Navbar placeholder */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight text-[var(--color-primary)]">
            AttendEase
          </h1>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer placeholder */}
      <footer className="border-t border-[var(--color-border)] py-4 text-center text-sm text-[var(--color-text-muted)]">
        &copy; {new Date().getFullYear()} AttendEase. All rights reserved.
      </footer>
    </div>
  )
}
