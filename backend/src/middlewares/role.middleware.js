/**
 * Role-based access control. Use after authMiddleware.
 * @param {string[]} allowedRoles - e.g. ['employee'] or ['manager']
 * @returns {Function} Express middleware
 */
function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const role = req.user.role;
    if (!allowedRoles || !Array.isArray(allowedRoles) || !allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
}

module.exports = roleMiddleware;
