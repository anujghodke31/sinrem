// ============================================================
// routes/auth.js
// ============================================================
import { Router }  from 'express';
import loginLimiter from '../middleware/loginLimiter.js';
import { login, refresh, logout } from '../controllers/authController.js';

const router = Router();

// Login — dedicated strict rate limiter (5 failed attempts per 15 min per IP)
router.post('/login',   loginLimiter, login);

// Refresh — no rate limiter needed (cookie is the credential; no brute-force surface)
router.post('/refresh', refresh);

// Logout — no auth required (clearing cookie should always succeed)
router.post('/logout',  logout);

export default router;
