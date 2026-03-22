// ============================================================
// controllers/authController.js
// - Login  → 15-min access token (JSON body) +
//            7-day refresh token (httpOnly cookie)
// - Refresh → issues new access token if refresh cookie valid
// - Logout  → clears cookie + revokes refresh token in DB
// ============================================================

import jwt    from 'jsonwebtoken';
import crypto from 'crypto';
import Admin  from '../models/Admin.js';
import { authLogger } from '../config/logger.js';

// ── Constants ─────────────────────────────────────────────────
const ACCESS_TOKEN_TTL  = '15m';          // Short-lived — returned in JSON
const REFRESH_TOKEN_TTL = 7 * 24 * 3600; // 7 days in seconds (cookie maxAge)

// ── Cookie config ─────────────────────────────────────────────
const REFRESH_COOKIE_NAME = 'sinrem_rt';

const refreshCookieOpts = {
  httpOnly: true,                                   // NOT accessible from JS
  secure:   process.env.NODE_ENV === 'production',  // HTTPS only in prod
  sameSite: 'strict',                               // No cross-site leakage
  maxAge:   REFRESH_TOKEN_TTL * 1000,               // Milliseconds
  path:     '/api/auth',                            // Only sent to auth endpoints
};

// ── Helper: sign access token ─────────────────────────────────
function signAccess(admin) {
  return jwt.sign(
    { id: admin._id.toString(), username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

// ── Helper: generate + hash refresh token ────────────────────
function generateRefreshToken() {
  const raw  = crypto.randomBytes(64).toString('hex'); // 512-bit random token
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}

// ── POST /api/auth/login ──────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Fetch admin with sensitive fields
    const admin = await Admin.findOne({
      username: username.toLowerCase().trim(),
    }).select('+password +failedLoginAttempts +lockUntil +refreshTokenHash');

    // ── Account not found — use same error message to prevent user enumeration
    if (!admin) {
      authLogger.warn(`Failed login attempt (user not found)`, { username, ip: req.ip });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // ── Account locked check
    if (admin.isLocked) {
      const lockedMins = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      authLogger.warn(`Blocked login attempt (account locked)`, { username: admin.username, ip: req.ip, lockedMins });
      return res.status(423).json({
        success: false,
        message: `Account locked due to too many failed attempts. Try again in ${lockedMins} minute(s).`,
      });
    }

    // ── Password verification
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      // Record the failed attempt (may lock account)
      await admin.recordFailedLogin();
      const remaining = 5 - (admin.failedLoginAttempts + 1);
      const hint = remaining > 0 ? ` (${remaining} attempt(s) remaining before lockout)` : '';
      
      authLogger.warn(`Failed password check`, { username: admin.username, ip: req.ip, remainingAttempts: remaining });
      
      return res.status(401).json({
        success: false,
        message: `Invalid credentials${hint}`,
      });
    }

    // ── Success: clear lockout state
    await admin.clearLoginAttempts();

    // ── Issue tokens
    const accessToken            = signAccess(admin);
    const { raw, hash }          = generateRefreshToken();
    await Admin.findByIdAndUpdate(admin._id, { refreshTokenHash: hash });

    // Refresh token goes into a secure httpOnly cookie
    res.cookie(REFRESH_COOKIE_NAME, raw, refreshCookieOpts);

    // Access token returned in JSON body — frontend stores in memory (not localStorage)
    authLogger.info(`Successful login`, { username: admin.username, ip: req.ip });
    
    res.json({
      success:     true,
      accessToken,
      expiresIn:   15 * 60, // seconds, so frontend knows when to refresh
      admin:       { username: admin.username },
    });
  } catch (err) {
    authLogger.error(`Server error during login`, { error: err.message, stack: err.stack, ip: req.ip });
    console.error('[authController.login]', err.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ── POST /api/auth/refresh ──────────────────────────────────────
// Issues a new 15-min access token if the refresh cookie is valid.
// Called automatically by the frontend before the access token expires.
export const refresh = async (req, res) => {
  try {
    const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!rawToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    // Hash the incoming token and look it up
    const hash  = crypto.createHash('sha256').update(rawToken).digest('hex');
    const admin = await Admin.findOne({ refreshTokenHash: hash }).select('+refreshTokenHash');

    if (!admin) {
      // Token not found or already revoked — clear the stale cookie
      res.clearCookie(REFRESH_COOKIE_NAME, { ...refreshCookieOpts, maxAge: 0 });
      return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    }

    // Issue a new access token (refresh token itself is NOT rotated here to keep it simple)
    const accessToken = signAccess(admin);
    authLogger.info(`Token refreshed`, { username: admin.username, ip: req.ip });

    res.json({
      success:   true,
      accessToken,
      expiresIn: 15 * 60,
    });
  } catch (err) {
    authLogger.error(`Server error during token refresh`, { error: err.message, stack: err.stack, ip: req.ip });
    console.error('[authController.refresh]', err.message);
    res.status(500).json({ success: false, message: 'Server error during token refresh' });
  }
};

// ── POST /api/auth/logout ────────────────────────────────────
// Revokes the refresh token in the DB and clears the cookie.
export const logout = async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (rawToken) {
    const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
    // Remove the stored hash — token is now revoked even if cookie lingers
    await Admin.findOneAndUpdate({ refreshTokenHash: hash }, { $unset: { refreshTokenHash: 1 } });
    authLogger.info(`Logged out and token revoked`, { ip: req.ip });
  } else {
    authLogger.info(`Logged out (no token to revoke)`, { ip: req.ip });
  }

  res.clearCookie(REFRESH_COOKIE_NAME, { ...refreshCookieOpts, maxAge: 0 });
  res.json({ success: true, message: 'Logged out' });
};
