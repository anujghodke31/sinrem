// ============================================================
// routes/content.js — Public dynamic content routes
// ============================================================

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getHomepageSections,
  getPageBySlug,
  getServices,
  getSiteSettings,
} from '../controllers/contentController.js';

const router = Router();

const contentReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many content requests. Please try again shortly.',
  },
});

router.use(contentReadLimiter);
router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  } else {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

router.get('/site-settings', getSiteSettings);
router.get('/pages/:slug', getPageBySlug);
router.get('/homepage', getHomepageSections);
router.get('/services', getServices);

export default router;
