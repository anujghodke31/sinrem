// ============================================================
// models/SiteSettings.js — Global site settings singleton
// ============================================================

import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  singletonKey: {
    type: String,
    unique: true,
    default: 'default',
    immutable: true,
  },
  siteName: {
    type: String,
    required: [true, 'Site name is required'],
    trim: true,
    maxlength: [80, 'Site name cannot exceed 80 characters'],
  },
  brandShortName: {
    type: String,
    required: [true, 'Brand short name is required'],
    trim: true,
    maxlength: [40, 'Brand short name cannot exceed 40 characters'],
  },
  logoPrimaryUrl: {
    type: String,
    required: [true, 'Primary logo URL is required'],
    trim: true,
  },
  logoAltUrl: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Please provide a valid email address',
    },
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true,
  },
  whatsapp: {
    type: String,
    required: [true, 'WhatsApp is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [220, 'Address cannot exceed 220 characters'],
  },
  social: {
    linkedin: { type: String, required: [true, 'LinkedIn URL is required'], trim: true },
    instagram: { type: String, required: [true, 'Instagram URL is required'], trim: true },
    youtube: { type: String, trim: true },
    x: { type: String, trim: true },
    github: { type: String, trim: true },
  },
  defaultSeo: {
    ogImage: {
      type: String,
      required: [true, 'Default OG image is required'],
      trim: true,
    },
    robotsDefault: {
      type: String,
      default: 'index, follow',
      trim: true,
    },
    twitterCard: {
      type: String,
      default: 'summary_large_image',
      trim: true,
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

siteSettingsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
