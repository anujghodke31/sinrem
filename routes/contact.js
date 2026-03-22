// ============================================================
// routes/contact.js
// ============================================================
import { Router } from 'express';
import { body } from 'express-validator';
import rateLimiter    from '../middleware/rateLimiter.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateRequest from '../middleware/validate.js';
import validateId      from '../middleware/validateId.js';
import {
  submitContact,
  getAllContacts,
  markRead,
  deleteContact,
} from '../controllers/contactController.js';

const router = Router();

// Validation rules for public form submission
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).escape(),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }).escape(),
  body('subject').optional().isIn(['Android App', 'Web Project', 'Desktop App', 'Technical Writing', 'Other']),
];

router.post('/', rateLimiter, contactValidation, validateRequest, submitContact);

// Protected Admin Routes
router.get('/', authMiddleware, getAllContacts);
// Apply validateId to operations acting on an ID
router.patch('/:id/read', authMiddleware, validateId, markRead);
router.delete('/:id', authMiddleware, validateId, deleteContact);

export default router;
