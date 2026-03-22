// ============================================================
// config/email.js — Nodemailer transporter + sendEmail helper
// ============================================================

import nodemailer from 'nodemailer';

// ── Transporter ───────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── sendEmail helper ──────────────────────────────────────────
/**
 * @param {Object} options
 * @param {string} options.to        - Recipient email address
 * @param {string} options.subject   - Email subject line
 * @param {string} options.html      - HTML body content
 * @returns {Promise<Object>}        - Nodemailer info object
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"SharadChandra TechVentures" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧  Email sent to ${to} [${info.messageId}]`);
    return info;
  } catch (err) {
    console.error(`❌  Email send failed: ${err.message}`);
    throw err;
  }
};

export default transporter;
