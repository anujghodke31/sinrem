// ============================================================
// middleware/validateId.js
//
// Validates that :id route parameters are valid MongoDB ObjectIds
// BEFORE any controller runs. This prevents:
//   - CastError 500s from malformed IDs
//   - NoSQL injection via crafted ID strings
//   - IDOR probing via non-existent IDs (they correctly get 404,
//     not 500)
// ============================================================

import mongoose from 'mongoose';

const validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(); // Route doesn't use :id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource ID format',
    });
  }

  next();
};

export default validateId;
