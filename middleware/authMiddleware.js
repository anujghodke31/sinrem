// ============================================================
// middleware/authMiddleware.js — JWT access token verification
//
// The access token is a short-lived (15 min) JWT sent in the
// Authorization header as a Bearer token by the admin SPA.
// It is stored in JS memory (not localStorage) and refreshed
// automatically via the /api/auth/refresh endpoint.
// ============================================================

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No access token provided',
    });
  }

  const token = authHeader.split(' ')[1];

  // Guard: reject obviously empty tokens
  if (!token || token.length < 20) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Malformed token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Explicitly allow only HS256 — prevents alg:none exploit
    });

    // Attach minimal claims only — never spread the entire decoded payload
    req.admin = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success:   false,
        message:   'Access token expired',
        code:      'TOKEN_EXPIRED', // Frontend uses this code to trigger a silent refresh
      });
    }
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export default authMiddleware;
