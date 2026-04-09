// ============================================================
// Google Apps Script — Sinrem Enquiry Form Handler
// Paste this into Extensions → Apps Script in your Google Sheet
// Deploy as Web App: Execute as "Me", Access "Anyone"
// ============================================================

const SHEET_NAME   = 'Sheet1';
const NOTIFY_EMAIL = 'zendeneha12@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Append row to sheet
    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name    || '',
      data.email   || '',
      data.subject || 'General',
      data.message || '',
      'New'
    ]);

    // Send notification email
    sendNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Enquiry received.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotification(data) {
  const subject = `New Enquiry: ${data.subject || 'General'} from ${data.name}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
      <h2 style="color:#1D1D1B;margin-bottom:4px;">New Enquiry — Sinrem</h2>
      <p style="color:#666;font-size:13px;margin-top:0;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:16px 0;"/>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#888;font-size:13px;width:80px;">Name</td>
            <td style="padding:8px 0;font-weight:600;color:#1D1D1B;">${data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;font-size:13px;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#00E599;">${data.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#888;font-size:13px;">Subject</td>
            <td style="padding:8px 0;color:#1D1D1B;">${data.subject || 'General'}</td></tr>
      </table>
      <div style="margin-top:16px;padding:16px;background:#fff;border-left:4px solid #00E599;border-radius:4px;">
        <p style="margin:0;color:#333;line-height:1.7;">${(data.message || '').replace(/\n/g, '<br/>')}</p>
      </div>
      <p style="margin-top:20px;">
        <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject || 'Your Enquiry')}"
           style="background:#1D1D1B;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;">
          Reply to ${data.name}
        </a>
      </p>
      <p style="color:#aaa;font-size:11px;margin-top:24px;">Sinrem — sinremtech@gmail.com</p>
    </div>
  `;

  MailApp.sendEmail({
    to:       NOTIFY_EMAIL,
    subject:  subject,
    htmlBody: html,
  });
}

// Handle CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Sinrem enquiry endpoint active.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
