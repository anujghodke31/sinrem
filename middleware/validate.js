// ============================================================
// middleware/validate.js — express-validator result extractor
// ============================================================

import { validationResult } from 'express-validator';

/**
 * Run after express-validator chains.
 * Returns 400 with structured errors if validation failed.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
};

export default validateRequest;
