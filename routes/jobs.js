// ============================================================
// routes/jobs.js
// ============================================================
import { Router } from 'express';
import { body } from 'express-validator';
import rateLimiter    from '../middleware/rateLimiter.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload, { verifyMagicBytes } from '../middleware/upload.js';
import validateRequest from '../middleware/validate.js';
import validateId      from '../middleware/validateId.js';
import {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
  markApplicationRead,
  deleteApplication,
} from '../controllers/jobController.js';

const router = Router();

const jobValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).escape(),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim().escape(),
  body('portfolio').optional().trim().isURL().withMessage('Must be a valid URL'),
  body('message').optional().trim().escape(),
  body('position').notEmpty().withMessage('Position is required')
    .isIn(['Frontend Developer', 'Backend Developer', 'Android Developer', 'Technical Writer', 'UI/UX Designer', 'Other']),
  body('experience').notEmpty().withMessage('Experience level is required')
    .isIn(['Fresher', '1-2 years', '3-5 years', '5+ years']),
];

router.post(
  '/',
  rateLimiter,
  upload.single('resume'),
  verifyMagicBytes,
  jobValidation,
  validateRequest,
  submitApplication
);

router.get('/',                  authMiddleware, getAllApplications);
router.patch('/:id/status',      authMiddleware, validateId, updateApplicationStatus);
router.patch('/:id/read',        authMiddleware, validateId, markApplicationRead);
router.delete('/:id',            authMiddleware, validateId, deleteApplication);

export default router;
