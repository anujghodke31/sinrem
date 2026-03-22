// ============================================================
// middleware/rateLimiter.js — express-rate-limit for public forms
// ============================================================

import rateLimit from 'express-rate-limit';
import { apiLogger } from '../config/logger.js';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      5,               // 5 requests per window per IP
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  // Skip failed requests from counting (optional: allows retrying after fixing data)
  skipFailedRequests: false,
  handler: (req, res, next, options) => {
    apiLogger.warn(`Global rate limit tripped (spam defense)`, { ip: req.ip, path: req.path });
    res.status(options.statusCode).send(options.message);
  },
});

export default rateLimiter;
