// ============================================================
// config/db.js — MongoDB connection via Mongoose
// ============================================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8 no longer needs these options, but explicit is fine
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
