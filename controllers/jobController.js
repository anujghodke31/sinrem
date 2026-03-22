// ============================================================
// controllers/jobController.js — Job application CRUD + email
// ============================================================

import fs from 'fs';
import JobApplication from '../models/JobApplication.js';
import { sendEmail } from '../config/email.js';

// ── Email Templates ───────────────────────────────────────────

const adminJobNotificationHtml = ({ name, email, phone, position, experience, portfolio, message, date }) => `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#080C14;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#0D1117;border:1px solid #1E293B;border-radius:12px;overflow:hidden;">
    <div style="background:#4F8EF7;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">New Job Application</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${position} — ${date}</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#475569;font-size:13px;width:120px;">Name</td><td style="padding:8px 0;color:#F1F5F9;font-size:14px;font-weight:500;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#4F8EF7;font-size:14px;">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#475569;font-size:13px;">Phone</td><td style="padding:8px 0;color:#F1F5F9;font-size:14px;">${phone}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#475569;font-size:13px;">Position</td><td style="padding:8px 0;color:#F1F5F9;font-size:14px;">${position}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;font-size:13px;">Experience</td><td style="padding:8px 0;color:#F1F5F9;font-size:14px;">${experience}</td></tr>
        ${portfolio ? `<tr><td style="padding:8px 0;color:#475569;font-size:13px;">Portfolio</td><td style="padding:8px 0;"><a href="${portfolio}" style="color:#4F8EF7;font-size:14px;">${portfolio}</a></td></tr>` : ''}
      </table>
      ${message ? `<div style="margin-top:24px;padding:20px;background:#111827;border-radius:8px;border-left:3px solid #4F8EF7;"><p style="margin:0;color:#94A3B8;font-size:14px;line-height:1.7;">${message.replace(/\n/g, '<br/>')}</p></div>` : ''}
      <p style="margin:top:20px;color:#475569;font-size:13px;">Resume has been saved to the uploads directory. View the full application in the admin panel.</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #1E293B;text-align:center;">
      <p style="margin:0;color:#475569;font-size:12px;">SharadChandra TechVentures | sinremtech@gmail.com</p>
    </div>
  </div>
</body>
</html>`;

const applicantConfirmationHtml = ({ name, position }) => `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#080C14;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#0D1117;border:1px solid #1E293B;border-radius:12px;overflow:hidden;">
    <div style="background:#4F8EF7;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">Application Received</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">SharadChandra TechVentures</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#F1F5F9;font-size:16px;font-weight:500;">Hi ${name},</p>
      <p style="color:#94A3B8;font-size:15px;line-height:1.7;">Thank you for applying for the <strong style="color:#F1F5F9;">${position}</strong> role at SharadChandra TechVentures.</p>
      <p style="color:#94A3B8;font-size:15px;line-height:1.7;">We carefully review every application. If your profile matches our current needs, we'll reach out to schedule a conversation. This typically happens within <strong style="color:#F1F5F9;">5–7 business days</strong>.</p>
      <div style="margin:28px 0;padding:20px;background:#111827;border-radius:8px;border-left:3px solid #10B981;">
        <p style="margin:0;color:#94A3B8;font-size:13px;">Questions? Get in touch:</p>
        <p style="margin:8px 0 0;color:#F1F5F9;font-size:14px;">📧 sinremtech@gmail.com<br/>📞 +91 95031 19046</p>
      </div>
      <p style="color:#94A3B8;font-size:15px;line-height:1.7;">We appreciate your interest in working with us.</p>
      <p style="color:#F1F5F9;font-size:14px;font-weight:500;margin-top:24px;">— The sinrem team</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #1E293B;text-align:center;">
      <p style="margin:0;color:#475569;font-size:11px;">You're receiving this because you submitted a job application on sinrem.tech</p>
    </div>
  </div>
</body>
</html>`;

// ── Submit Application ────────────────────────────────────────
export const submitApplication = async (req, res) => {
  try {
    // Only accept these properties
    const { name, email, phone, position, experience, portfolio, message } = req.body;
    
    // Resume is handled securely via multer with UUID names and strictly checked properties
    const resumePath         = req.file ? req.file.path : undefined;
    const resumeOriginalName = req.file ? req.file.originalname : undefined;

    const application = await JobApplication.create({
      name, email, phone, position, experience, portfolio, message,
      resumePath, resumeOriginalName,
    });

    const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const results = await Promise.allSettled([
      sendEmail({
        to:      process.env.ADMIN_EMAIL,
        subject: `New Job Application: ${position} from ${name}`,
        html:    adminJobNotificationHtml({ name, email, phone, position, experience, portfolio, message, date }),
      }),
      sendEmail({
        to:      email,
        subject: 'Application received — SharadChandra TechVentures',
        html:    applicantConfirmationHtml({ name, position }),
      }),
    ]);

    const emailFailed = results.some((r) => r.status === 'rejected');

    res.status(201).json({
      success: true,
      message: emailFailed
        ? 'Application submitted. Email confirmation could not be sent.'
        : 'Application submitted successfully. We\'ll be in touch.',
      id: application._id,
    });
  } catch (err) {
    console.error('[jobController.submitApplication]', err.message);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
};

// ── Get All Applications (admin) ──────────────────────────────
export const getAllApplications = async (req, res) => {
  try {
    let { status, position, page = 1, limit = 20 } = req.query;
    
    // Bounds and sanitization
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(500, Math.max(1, parseInt(limit, 10) || 20));

    const filter = {};
    if (status)   filter.status   = String(status);
    if (position) filter.position = String(position);

    const skip  = (page - 1) * limit;
    const total = await JobApplication.countDocuments(filter);
    const apps  = await JobApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ success: true, total, pages: Math.ceil(total / limit), page, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Update Status ─────────────────────────────────────────────
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['New', 'Reviewed', 'Shortlisted', 'Rejected'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const app = await JobApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Mark Application Read ─────────────────────────────────────
export const markApplicationRead = async (req, res) => {
  try {
    const app = await JobApplication.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Delete Application ────────────────────────────────────────
export const deleteApplication = async (req, res) => {
  try {
    const app = await JobApplication.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });

    // Also delete the uploaded resume file from disk
    // Path string matches strictly generated UUID from multer — so tree iteration isn't an issue.
    // However, verify path doesn't escape before unlinking.
    if (app.resumePath && !app.resumePath.includes('..') && fs.existsSync(app.resumePath)) {
      fs.unlink(app.resumePath, (err) => {
        if (err) console.warn('[jobController] Could not delete resume file:', err.message);
      });
    }

    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
