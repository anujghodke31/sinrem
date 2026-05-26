// ============================================================
// middleware/upload.js — Multer config for resume file uploads
// ============================================================

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const UPLOAD_DIR = 'uploads';
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Disk storage config ────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Sanitize: replace spaces and special chars, prepend timestamp
    const sanitized = file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9._-]/g, '');
    cb(null, `${Date.now()}-${sanitized}`);
  },
});

// ── File type filter ───────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents (.pdf, .doc, .docx) are allowed'), false);
  }
};

// ── Multer instance ────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

export const verifyMagicBytes = (req, res, next) => {
  if (!req.file) return next();
  const filePath = req.file.path;
  const buffer = Buffer.alloc(4);
  try {
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    const hex = buffer.toString('hex').toUpperCase();

    // PDF: 25504446
    // DOC (Legacy): D0CF11E0
    // DOCX (ZIP): 504B0304
    if (hex === '25504446' || hex === 'D0CF11E0' || hex === '504B0304') {
      next();
    } else {
      fs.unlinkSync(filePath); // delete invalid file
      return res.status(400).json({ success: false, message: 'Invalid file content. Must be a valid PDF or Word document.' });
    }
  } catch (err) {
    next(err);
  }
};

export default upload;
