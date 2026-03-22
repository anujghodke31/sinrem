// ============================================================
// middleware/loginLimiter.js
// Strict rate limiter ONLY for POST /api/auth/login
// 5 attempts per 15 minutes per IP → 429 with Retry-After
// ============================================================

import rateLimit from 'express-rate-limit';
import { authLogger } from '../config/logger.js';

const loginLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15-minute window
  max:             5,               // 5 attempts per window per IP
  standardHeaders: true,            // Sends RateLimit-* headers (RFC 6585)
  legacyHeaders:   false,
  skipSuccessfulRequests: true,     // Only count FAILED login attempts
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Try again in 15 minutes.',
  },
  // Use a key prefix so this limiter's counters stay separate from public form limiters
  keyGenerator: (req) => `login:${req.ip}`,
  handler: (req, res, next, options) => {
    authLogger.warn(`Rate limit tripped on login (brute-force defense)`, { ip: req.ip, path: req.path });
    res.status(options.statusCode).send(options.message);
  },
});

export default loginLimiter;
