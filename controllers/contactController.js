// ============================================================
// controllers/contactController.js — Contact form CRUD + email
// ============================================================

import Contact from '../models/Contact.js';
import { sendEmail } from '../config/email.js';

// ── Email Templates ───────────────────────────────────────────

const adminNotificationHtml = ({ name, email, subject, message, date }) => `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#080C14;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#0D1117;border:1px solid #1E293B;border-radius:12px;overflow:hidden;">
    <div style="background:#4F8EF7;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">New Contact Message</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">${date}</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#475569;font-size:13px;width:100px;">Name</td><td style="padding:8px 0;color:#F1F5F9;font-size:14px;font-weight:500;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#4F8EF7;font-size:14px;">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#475569;font-size:13px;">Subject</td><td style="padding:8px 0;color:#F1F5F9;font-size:14px;">${subject}</td></tr>
      </table>
      <div style="margin-top:24px;padding:20px;background:#111827;border-radius:8px;border-left:3px solid #4F8EF7;">
        <p style="margin:0;color:#94A3B8;font-size:14px;line-height:1.7;">${message.replace(/\n/g, '<br/>')}</p>
      </div>
      <p style="margin-top:24px;"><a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="background:#4F8EF7;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:500;">Reply to ${name}</a></p>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #1E293B;text-align:center;">
      <p style="margin:0;color:#475569;font-size:12px;">SharadChandra TechVentures | sinremtech@gmail.com | +91 95031 19046</p>
    </div>
  </div>
</body>
</html>`;

const autoReplyHtml = ({ name, subject }) => `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#080C14;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#0D1117;border:1px solid #1E293B;border-radius:12px;overflow:hidden;">
    <div style="background:#4F8EF7;padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600;">Thanks for reaching out</h1>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">SharadChandra TechVentures</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#F1F5F9;font-size:16px;font-weight:500;">Hi ${name},</p>
      <p style="color:#94A3B8;font-size:15px;line-height:1.7;">We've received your message regarding <strong style="color:#F1F5F9;">"${subject}"</strong> and wanted to confirm it reached us.</p>
      <p style="color:#94A3B8;font-size:15px;line-height:1.7;">We review every enquiry personally and will reply within <strong style="color:#F1F5F9;">24 hours</strong> on business days.</p>
      <div style="margin:28px 0;padding:20px;background:#111827;border-radius:8px;border-left:3px solid #10B981;">
        <p style="margin:0;color:#94A3B8;font-size:13px;">If your enquiry is urgent, you can also reach us directly:</p>
        <p style="margin:8px 0 0;color:#F1F5F9;font-size:14px;">📧 sinremtech@gmail.com<br/>📞 +91 95031 19046 (Mon–Sat, 10am–7pm IST)</p>
      </div>
      <p style="color:#94A3B8;font-size:15px;line-height:1.7;">Thanks again for considering us.</p>
      <p style="color:#F1F5F9;font-size:14px;font-weight:500;margin-top:24px;">— The sinrem team</p>
    </div>
    <div style="padding:16px 32px;border-top:1px solid #1E293B;text-align:center;">
      <p style="margin:0;color:#475569;font-size:11px;">You're receiving this because you submitted a form on sinrem.tech</p>
    </div>
  </div>
</body>
</html>`;

// ── Submit Contact ────────────────────────────────────────────
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject = 'Other', message } = req.body;

    const contact = await Contact.create({ name, email, subject, message });

    const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Send emails in parallel — don't block the response if email fails
    const emailPromises = [
      sendEmail({
        to:      process.env.ADMIN_EMAIL,
        subject: `New Contact: ${subject} from ${name}`,
        html:    adminNotificationHtml({ name, email, subject, message, date }),
      }),
      sendEmail({
        to:      email,
        subject: 'Thanks for reaching out — SharadChandra TechVentures',
        html:    autoReplyHtml({ name, subject }),
      }),
    ];

    // Attempt emails but don't fail the request if they error
    const results = await Promise.allSettled(emailPromises);
    const emailFailed = results.some((r) => r.status === 'rejected');

    res.status(201).json({
      success: true,
      message: emailFailed
        ? 'Message saved. Email notification could not be sent right now.'
        : 'Message sent successfully. We\'ll reply within 24 hours.',
      id: contact._id,
    });
  } catch (err) {
    console.error('[contactController.submitContact]', err.message);
    res.status(500).json({ success: false, message: 'Failed to submit message' });
  }
};

// ── Get All Contacts (admin) ──────────────────────────────────
export const getAllContacts = async (req, res) => {
  try {
    let { isRead, page = 1, limit = 20 } = req.query;
    
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(500, Math.max(1, parseInt(limit, 10) || 20));

    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip  = (page - 1) * limit;
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      total,
      pages:   Math.ceil(total / limit),
      page,
      data:    contacts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Mark Read ────────────────────────────────────────────────
export const markRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Delete Contact ────────────────────────────────────────────
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
