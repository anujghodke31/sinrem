// ============================================================
// models/Admin.js — Admin user with bcrypt, lockout, refresh tokens
// ============================================================

import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  username: {
    type:      String,
    required:  [true, 'Username is required'],
    unique:    true,
    trim:      true,
    lowercase: true,
  },
  password: {
    type:      String,
    required:  [true, 'Password is required'],
    minlength: [12, 'Password must be at least 12 characters'],
    select:    false, // Never returned in queries by default
  },

  // ── Brute-force lockout ─────────────────────────────────────
  failedLoginAttempts: {
    type:    Number,
    default: 0,
    select:  false,
  },
  lockUntil: {
    type:   Date,
    select: false,
  },

  // ── Refresh token store ─────────────────────────────────────
  // Hashed refresh token — only one active session allowed at a time.
  // Storing a hash means a stolen DB dump cannot be replayed directly.
  refreshTokenHash: {
    type:   String,
    select: false,
  },

  createdAt: {
    type:    Date,
    default: Date.now,
  },
});

// ── Virtual: is the account currently locked? ─────────────────
adminSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ── Pre-save: hash password if modified ──────────────────────
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 14); // cost 14 for admin
  // Clear any lockout state when password is changed
  this.failedLoginAttempts = 0;
  this.lockUntil           = undefined;
  next();
});

// ── comparePassword ──────────────────────────────────────────
adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── recordFailedLogin ────────────────────────────────────────
// Increments counter; locks account for 1 hour after 5 consecutive failures
const MAX_ATTEMPTS = 5;
const LOCK_TIME    = 60 * 60 * 1000; // 1 hour in ms

adminSchema.methods.recordFailedLogin = async function () {
  // If lock has expired, reset first
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set:   { failedLoginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const update = { $inc: { failedLoginAttempts: 1 } };

  // Lock account when threshold is reached
  if (this.failedLoginAttempts + 1 >= MAX_ATTEMPTS) {
    update.$set = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }

  return this.updateOne(update);
};

// ── clearLoginAttempts ────────────────────────────────────────
adminSchema.methods.clearLoginAttempts = function () {
  return this.updateOne({
    $set:   { failedLoginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
