// ============================================================
// routes/ai.js — Proxies Gemini AI chat requests server-side
// so the API key is never exposed in the frontend bundle.
// ============================================================
import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import validateRequest from '../middleware/validate.js';
import { chat } from '../controllers/aiController.js';

const router = Router();

// Strict rate limit: 20 AI requests per 15 min per IP
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many AI requests. Please wait 15 minutes.' },
});

const chatValidation = [
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 1000 }).escape(),
  body('history').optional().isArray({ max: 20 }).withMessage('History must be an array of max 20 messages'),
  body('history.*.role').optional().isIn(['user', 'model']).withMessage('Invalid role in history'),
  body('history.*.text').optional().isString().isLength({ max: 2000 }),
];

router.post('/chat', aiLimiter, chatValidation, validateRequest, chat);

export default router;
