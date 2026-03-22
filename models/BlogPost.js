// ============================================================
// models/BlogPost.js — Blog / case study posts
// ============================================================

import mongoose from 'mongoose';
import slugify from 'slugify';

const blogPostSchema = new mongoose.Schema({
  title: {
    type:      String,
    required:  [true, 'Title is required'],
    trim:      true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug: {
    type:   String,
    unique: true,
    lowercase: true,
  },
  excerpt: {
    type:      String,
    required:  [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  content: {
    type:     String,
    required: [true, 'Content is required'],
  },
  coverImage: {
    type: String, // URL or relative path
  },
  tags: [String],
  category: {
    type:    String,
    enum:    ['Case Study', 'Tutorial', 'News', 'Insights'],
    default: 'Insights',
  },
  isPublished: {
    type:    Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  author: {
    type:    String,
    default: 'SharadChandra TechVentures',
  },
  readTime: {
    type: Number, // minutes
  },
  createdAt: {
    type:    Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// ── Pre-save hooks ────────────────────────────────────────────
blogPostSchema.pre('save', function (next) {
  // Auto-generate slug from title
  if (!this.slug || this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // Calculate reading time (~200 words per minute)
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime  = Math.max(1, Math.ceil(wordCount / 200));
  }

  // Set publishedAt when first published
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
