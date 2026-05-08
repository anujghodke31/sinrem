// ============================================================
// server.js — Express application entry point
// ============================================================

import 'dotenv/config';

// ── Startup secret validation ──────────────────────────────────
// Abort immediately if critical secrets are missing or clearly insecure
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌  Missing required environment variable: ${key}. Set it in .env and restart.`);
    process.exit(1);
  }
}
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️   GEMINI_API_KEY is not set — /api/ai/chat will return errors until configured.');
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('❌  JWT_SECRET is too short. Use at least 32 random characters.');
  process.exit(1);
}

import express      from 'express';
import cors         from 'cors';
import helmet       from 'helmet';
import morgan       from 'morgan';
import cookieParser from 'cookie-parser';
import path         from 'path';
import { fileURLToPath } from 'url';

import connectDB      from './config/db.js';
import authRoutes     from './routes/auth.js';
import contactRoutes  from './routes/contact.js';
import blogRoutes     from './routes/blog.js';
import jobRoutes      from './routes/jobs.js';
import projectRoutes  from './routes/projects.js';
import aiRoutes       from './routes/ai.js';
import contentRoutes  from './routes/content.js';
import authMiddleware from './middleware/authMiddleware.js';
import globalLimiter  from './middleware/globalLimiter.js';
import logger, { apiLogger } from './config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app        = express();

// ── Production Setup ──────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  // Trust proxy so req.ip and req.secure work behind a load balancer (e.g. Nginx, AWS ELB)
  app.set('trust proxy', 1);

  // Enforce HTTPS
  app.use((req, res, next) => {
    if (!req.secure && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// ── Security Headers ──────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc:  ["'self'"],
        styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc:   ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
        imgSrc:      ["'self'", 'data:', 'https:'],
        // Prevent admin panel from being embedded in iframes (clickjacking)
        frameAncestors: ["'none'"],
      },
    },
    // Strict HSTS in production: 1 year + preload
    hsts: process.env.NODE_ENV === 'production'
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
  })
);

// ── CORS ──────────────────────────────────────────────────────
// Auth endpoints require a real browser origin to prevent CSRF-style abuse
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5000',
];
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Auth routes: reject requests with no Origin header (curl/Postman)
      if (!origin && process.env.NODE_ENV === 'production') {
        return callback(new Error('CORS: Origin header required'));
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: ${origin} not allowed`));
      }
    },
    credentials: true, // Required for httpOnly cookie to be sent cross-origin
  })
);

// ── Cookie Parser ─────────────────────────────────────────────
// Required to read the httpOnly refresh token cookie
app.use(cookieParser());

// ── Request Logging ───────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  // In production: log combined format to Winston so suspicious traffic is captured
  app.use(morgan('combined', {
    stream: { write: (msg) => apiLogger.info(msg.trim()) },
    // Skip health-check pings to reduce noise
    skip: (req) => req.url === '/health',
  }));
}

// ── Body Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Health check (for load balancers / uptime monitors) ──────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── API Routes ────────────────────────────────────────────────
// Apply global scraping/bot limiter to all /api routes
app.use('/api', globalLimiter);

app.use('/api/auth',     authRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/blog',     blogRoutes);
app.use('/api/jobs',     jobRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai',       aiRoutes);
app.use('/api/content',  contentRoutes);

// ── Protected: resume file downloads (JWT required) ──────────
app.use('/uploads', authMiddleware, express.static(path.join(__dirname, 'uploads')));

// ── Static: Admin panel ───────────────────────────────────────
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── Static: Public frontend ───────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  // Hashed assets (JS/CSS) — cache for 1 year (immutable, Vite fingerprints filenames)
  app.use('/assets', express.static(
    path.join(__dirname, 'frontend', 'dist', 'assets'),
    { maxAge: '1y', immutable: true }
  ));
  // Root files (index.html, robots.txt, sitemap.xml) — no cache
  app.use(express.static(
    path.join(__dirname, 'frontend', 'dist'),
    { maxAge: 0, etag: true }
  ));
} else {
  // Dev: no caching
  app.use(express.static(path.join(__dirname, 'frontend', 'dist'), {
    etag: false, lastModified: false,
    setHeaders: (res) => res.setHeader('Cache-Control', 'no-store'),
  }));
}

// ── Error Handling ────────────────────────────────────────────

// ── SPA fallback ─────────────────────────────────────────────
app.get(/^(?!\/api|\/uploads|\/admin).*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// ── 404 for unmatched API routes ─────────────────────────────
app.use('/api/*', (req, res) => {
  apiLogger.warn(`API Not Found (404)`, { method: req.method, path: req.originalUrl, ip: req.ip });
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  apiLogger.error(`Unhandled API Error`, { error: err.message, stack: err.stack, method: req.method, path: req.originalUrl, ip: req.ip });

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max 5MB allowed.' });
  }

  res.status(err.status || 500).json({
    success: false,
    // Never leak internal error details in production
    message: process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error',
  });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀  sinrem server running on http://localhost:${PORT}`);
    console.log(`📁  Admin panel: http://localhost:${PORT}/admin`);
    console.log(`🌍  Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
});
