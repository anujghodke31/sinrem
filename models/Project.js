// ============================================================
// models/Project.js — Portfolio project model (admin-managed)
// ============================================================

import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type:     String,
    required: [true, 'Project title is required'],
    trim:     true,
  },
  type: {
    type:     String,
    required: [true, 'Project type is required'],
    enum: [
      'Web Application',
      'Android App',
      'Desktop App',
      'Technical Writing',
      'Other',
    ],
  },
  description: {
    type:      String,
    required:  [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  techStack: [String], // e.g. ['React', 'Django', 'PostgreSQL']
  liveUrl: {
    type: String, // Optional external link
  },
  featured: {
    type:    Boolean,
    default: false,
  },
  order: {
    type:    Number,
    default: 0, // Lower = displayed first
  },
  createdAt: {
    type:    Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
