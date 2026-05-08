// ============================================================
// models/HomepageSection.js — Dynamic homepage section blocks
// ============================================================

import mongoose from 'mongoose';

const homepageSectionSchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'Section key is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Section title cannot exceed 100 characters'],
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

homepageSectionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const HomepageSection = mongoose.model('HomepageSection', homepageSectionSchema);
export default HomepageSection;
