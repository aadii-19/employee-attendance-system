const { verifyToken } = require('../utils/jwt.util');

/**
 * Verify JWT from Authorization: Bearer <token>. Attach decoded payload to req.user.
 * Missing or invalid token → 401 with { success: false, message }.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required',
    });
  }

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization format. Use: Bearer <token>',
    });
  }

  const token = parts[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token required',
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message === 'jwt expired' ? 'Token expired' : 'Invalid token',
    });
  }
}

module.exports = authMiddleware;
