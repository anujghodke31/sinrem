// ============================================================
// models/Page.js — Dynamic page SEO and publish state
// ============================================================

import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [80, 'Title cannot exceed 80 characters'],
  },
  metaDescription: {
    type: String,
    required: [true, 'Meta description is required'],
    trim: true,
    maxlength: [170, 'Meta description cannot exceed 170 characters'],
  },
  canonicalPath: {
    type: String,
    required: [true, 'Canonical path is required'],
    trim: true,
  },
  ogImage: {
    type: String,
    trim: true,
  },
  robots: {
    type: String,
    default: 'index, follow',
    trim: true,
  },
  jsonLdType: {
    type: String,
    enum: ['Organization', 'WebPage', 'Article'],
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

pageSchema.pre('save', function (next) {
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

const Page = mongoose.model('Page', pageSchema);
export default Page;
