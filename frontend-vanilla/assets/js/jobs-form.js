/* ============================================================
   frontend/assets/js/jobs-form.js
   Handles job application form → POST /api/jobs (multipart)
   ============================================================ */

const form = document.getElementById('jobs-form');
if (!form) throw new Error('jobs-form element not found');

// ── File drop zone enhancement ────────────────────────────────

const fileInput = form.querySelector('input[type="file"]');
const dropArea  = fileInput ? fileInput.closest('.file-drop') : null;

if (fileInput && dropArea) {
  // Show selected file name + size
  fileInput.addEventListener('change', () => {
    const file    = fileInput.files[0];
    const hint    = dropArea.querySelector('.file-hint');
    if (file && hint) {
      hint.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    }
  });

  // Drag-and-drop support
  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('drag-over');
  });

  dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
  });

  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over');
    // Assign dropped files to the file input
    const dt = e.dataTransfer;
    if (dt.files.length) {
      fileInput.files = dt.files;
      fileInput.dispatchEvent(new Event('change'));
    }
  });
}

// ── Feedback banner helpers ───────────────────────────────────

function showBanner(message, isSuccess) {
  removeBanner();
  const banner = document.createElement('div');
  banner.className = 'form-banner';
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
  setTimeout(removeBanner, 6000);
}

function removeBanner() {
  const existing = form.nextElementSibling;
  if (existing && existing.classList.contains('form-banner')) existing.remove();
}

// ── Form submit ───────────────────────────────────────────────

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // File size client-side check before uploading
  if (fileInput && fileInput.files[0]) {
    if (fileInput.files[0].size > 5 * 1024 * 1024) {
      showBanner('File is too large. Please upload a resume under 5MB.', false);
      return;
    }
  }

  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled    = true;
  btn.textContent = 'Submitting…';

  // FormData automatically handles multipart/form-data + file
  const formData = new FormData(form);

  try {
    const res  = await fetch('/api/jobs', {
      method: 'POST',
      body:   formData,
      // Do NOT set Content-Type — browser sets it with boundary
    });
    const json = await res.json();

    if (json.success) {
      showBanner("✓ Application submitted! We'll be in touch.", true);
      form.reset();
      if (dropArea) {
        const hint = dropArea.querySelector('.file-hint');
        if (hint) hint.textContent = 'Click to upload or drag & drop your resume (PDF or Word, max 5MB)';
      }
    } else {
      const msg = json.errors
        ? json.errors.map((e) => e.message).join(', ')
        : json.message || 'Something went wrong. Please try again.';
      showBanner(msg, false);
    }
  } catch {
    showBanner('Network error. Please try again.', false);
  } finally {
    btn.disabled    = false;
    btn.textContent = originalText;
  }
});
