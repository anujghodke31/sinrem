// ============================================================
// models/Service.js — Dynamic services for cards and modals
// ============================================================

import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Service slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Service title cannot exceed 100 characters'],
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [180, 'Service subtitle cannot exceed 180 characters'],
  },
  category: {
    type: String,
    trim: true,
    maxlength: [60, 'Service category cannot exceed 60 characters'],
  },
  icon: {
    type: String,
    trim: true,
  },
  mediaUrl: {
    type: String,
    trim: true,
  },
  detailList: {
    type: [String],
    default: [],
  },
  modalContent: {
    type: String,
    trim: true,
  },
  cta: {
    label: { type: String, trim: true },
    href: { type: String, trim: true },
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

serviceSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Service = mongoose.model('Service', serviceSchema);
export default Service;
