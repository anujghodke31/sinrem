// ============================================================
// models/Contact.js — Contact form submission model
// ============================================================

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type:      String,
    required:  [true, 'Name is required'],
    trim:      true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type:      String,
    required:  [true, 'Email is required'],
    trim:      true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message:   'Please provide a valid email address',
    },
  },
  subject: {
    type:    String,
    enum:    ['Android App', 'Web Project', 'Desktop App', 'Technical Writing', 'Other'],
    default: 'Other',
  },
  message: {
    type:      String,
    required:  [true, 'Message is required'],
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  isRead: {
    type:    Boolean,
    default: false,
  },
  createdAt: {
    type:    Date,
    default: Date.now,
  },
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
