import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

import DashboardLayout from '../layouts/DashboardLayout'

import { LoginPage, RegisterPage, RegisterForm } from '../pages/auth'
import { EmployeeDashboard, AttendanceHistory, MonthlyAttendance, CheckInPage } from '../pages/employee'
import { ManagerDashboard, EmployeesList, EmployeeDetail } from '../pages/manager'
import AccessDenied from '../pages/AccessDenied'
import ProfilePage from '../pages/ProfilePage'

/**
 * AppRoutes
 *
 * Centralised route definitions with protection layers.
 * All protected routes are nested inside DashboardLayout.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public routes ──────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/:role" element={<RegisterForm />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* ── Protected routes (inside DashboardLayout) ──────── */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Employee routes */}
        <Route
          path="/employee/dashboard"
          element={
            <RoleRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/employee/check-in"
          element={
            <RoleRoute allowedRoles={['employee']}>
              <CheckInPage />
            </RoleRoute>
          }
        />
        <Route
          path="/employee/attendance"
          element={
            <RoleRoute allowedRoles={['employee']}>
              <AttendanceHistory />
            </RoleRoute>
          }
        />
        <Route
          path="/employee/monthly"
          element={
            <RoleRoute allowedRoles={['employee']}>
              <MonthlyAttendance />
            </RoleRoute>
          }
        />

        {/* Manager routes */}
        <Route
          path="/manager/dashboard"
          element={
            <RoleRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/manager/employees"
          element={
            <RoleRoute allowedRoles={['manager']}>
              <EmployeesList />
            </RoleRoute>
          }
        />
        <Route
          path="/manager/employees/:id"
          element={
            <RoleRoute allowedRoles={['manager']}>
              <EmployeeDetail />
            </RoleRoute>
          }
        />

        {/* Shared routes (all authenticated users) */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* ── Fallback ───────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
