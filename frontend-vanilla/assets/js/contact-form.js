/* ============================================================
   frontend/assets/js/contact-form.js
   Handles contact form → POST /api/contact
   ============================================================ */

const form = document.getElementById('contact-form');
if (!form) throw new Error('contact-form element not found');

// ── Feedback banner helpers ───────────────────────────────────

function showBanner(form, message, isSuccess) {
  // Remove any existing banner
  removeBanner(form);

  const banner = document.createElement('div');
  banner.className = isSuccess ? 'form-banner form-banner--success' : 'form-banner form-banner--error';
  banner.style.cssText = `
    margin-top: 12px;
    padding: 14px 16px;
    border-radius: 8px;
    font-family: var(--font-body, system-ui, sans-serif);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.5;
    ${isSuccess
      ? 'background: rgba(16,185,129,0.08); border: 1px solid #10B981; color: #10B981;'
      : 'background: rgba(239,68,68,0.08); border: 1px solid #EF4444; color: #EF4444;'
    }
  `;
  banner.textContent = message;
  form.insertAdjacentElement('afterend', banner);

  // Auto-remove after 6 seconds
  setTimeout(() => removeBanner(form), 6000);
}

function removeBanner(form) {
  const existing = form.nextElementSibling;
  if (existing && existing.classList.contains('form-banner')) {
    existing.remove();
  }
}

// ── Form submit ───────────────────────────────────────────────

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending…';

  const data = {
    name:    form.elements.name.value.trim(),
    email:   form.elements.email.value.trim(),
    subject: form.elements.subject.value,
    message: form.elements.message.value.trim(),
  };

  try {
    const res  = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    const json = await res.json();

    if (json.success) {
      showBanner(form, "✓ Message sent! We'll reply within 24 hours.", true);
      form.reset();
    } else {
      const msg = json.errors
        ? json.errors.map((e) => e.message).join(', ')
        : json.message || 'Something went wrong. Please try again.';
      showBanner(form, msg, false);
    }
  } catch {
    showBanner(form, 'Network error. Please check your connection.', false);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});
