// ============================================================
// middleware/globalLimiter.js
// Broad rate limiter across all /api/* routes to prevent data scraping
// and automated bot probing.
// ============================================================

import rateLimit from 'express-rate-limit';
import { apiLogger } from '../config/logger.js';

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max:      100,            // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  handler: (req, res, next, options) => {
    apiLogger.warn(`Global API rate limit tripped (bot/scraping defense)`, { ip: req.ip, path: req.path });
    res.status(options.statusCode).send(options.message);
  },
});

export default globalLimiter;
