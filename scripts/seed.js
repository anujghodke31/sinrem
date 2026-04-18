// ============================================================
// scripts/seed.js — Seed admin into MongoDB
// Run: npm run seed
// Blog posts and projects are now static in the frontend.
// ============================================================

import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

const { MONGO_URI, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

if (!MONGO_URI)      { console.error('❌  MONGO_URI is not set in .env'); process.exit(1); }
if (!ADMIN_USERNAME) { console.error('❌  ADMIN_USERNAME is not set in .env'); process.exit(1); }
if (!ADMIN_PASSWORD) { console.error('❌  ADMIN_PASSWORD is not set in .env'); process.exit(1); }
if (ADMIN_PASSWORD.length < 12) {
  console.error('❌  ADMIN_PASSWORD must be at least 12 characters');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    const existing = await Admin.findOne({ username: ADMIN_USERNAME.toLowerCase() });
    if (existing) {
      existing.password = ADMIN_PASSWORD;
      await existing.save();
      console.log(`✅  Admin password refreshed: ${ADMIN_USERNAME}`);
    } else {
      await Admin.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
      console.log(`✅  Admin created: ${ADMIN_USERNAME}`);
    }

    console.log('\n🌱  Seed complete.\n');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
