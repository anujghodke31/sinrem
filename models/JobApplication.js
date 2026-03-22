// ============================================================
// models/JobApplication.js — Job/hiring applications
// ============================================================

import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    trim: true,
  },
  position: {
    type:     String,
    required: [true, 'Position is required'],
    enum: [
      'Frontend Developer',
      'Backend Developer',
      'Android Developer',
      'Technical Writer',
      'UI/UX Designer',
      'Other',
    ],
  },
  experience: {
    type:     String,
    required: [true, 'Experience level is required'],
    enum:     ['Fresher', '1-2 years', '3-5 years', '5+ years'],
  },
  portfolio: {
    type: String, // Optional URL
  },
  message: {
    type:      String,
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  resumePath: {
    type: String, // File path from multer
  },
  resumeOriginalName: {
    type: String,
  },
  status: {
    type:    String,
    enum:    ['New', 'Reviewed', 'Shortlisted', 'Rejected'],
    default: 'New',
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

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
