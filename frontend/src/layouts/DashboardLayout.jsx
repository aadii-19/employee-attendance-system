import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

/**
 * DashboardLayout
 *
 * Shared shell for all protected pages.
 * Fixed sidebar on the left, topbar + scrollable content on the right.
 */
export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] transition-colors">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <Sidebar />

      {/* ── Main area (offset by sidebar width) ──────────────── */}
      <div className="ml-64 flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
