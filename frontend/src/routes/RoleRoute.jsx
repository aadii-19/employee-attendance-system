import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * RoleRoute — restricts access based on user role.
 * Must be used inside a ProtectedRoute (assumes user is already authenticated).
 */
export default function RoleRoute({ allowedRoles, children }) {
  const { role } = useAuth()

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" replace />
  }

  return children
}
