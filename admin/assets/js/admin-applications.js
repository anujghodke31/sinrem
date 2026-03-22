// ============================================================
// admin/assets/js/admin-applications.js
// ============================================================

import { fetchWithAuth } from './admin-auth.js';

let allApps       = [];
let currentFilter = 'all';
const PAGE_SIZE   = 20;
let currentPage   = 1;

const tbody      = document.getElementById('apps-tbody');
const modal      = document.getElementById('app-modal');
const modalBody  = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

function openModal(content) { modalBody.innerHTML = content; modal.classList.add('open'); }
function closeModal()        { modal.classList.remove('open'); }
window.closeModal = closeModal;

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

async function fetchApps() {
  const res  = await fetchWithAuth('/api/jobs?limit=200');
  if (!res.ok) return;
  const json = await res.json();
  allApps = json.data || [];
  renderTable();
}

function filtered() {
  return currentFilter === 'all'
    ? allApps
    : allApps.filter((a) => a.status.toLowerCase() === currentFilter);
}

function renderTable() {
  const data  = filtered();
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = data.slice(start, start + PAGE_SIZE);

  if (!page.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No applications found.</td></tr>';
    return;
  }

  tbody.innerHTML = page.map((a, i) => `
    <tr class="${a.isRead ? '' : 'unread'}" data-id="${a._id}">
      <td>${start + i + 1}</td>
      <td class="td-name">${a.name}</td>
      <td class="td-email">${a.email}</td>
      <td>${a.position}</td>
      <td>${a.experience}</td>
      <td class="td-date">${fmtDate(a.createdAt)}</td>
      <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
      <td>
        <div class="td-actions">
          <button class="action-btn" onclick="viewApp('${a._id}')">View</button>
          <button class="action-btn delete" onclick="deleteApp('${a._id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.viewApp = (id) => {
  const a = allApps.find((x) => x._id === id);
  if (!a) return;

  if (!a.isRead) {
    fetchWithAuth(`/api/jobs/${id}/read`, { method: 'PATCH' });
    a.isRead = true; renderTable();
  }

  const statuses = ['New', 'Reviewed', 'Shortlisted', 'Rejected'];

  openModal(`
    <h2 class="modal-title">${a.position} Application</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td class="text-muted" style="padding:6px 0;width:110px;font-size:13px;">Name</td><td style="font-size:14px;color:var(--text-primary);">${a.name}</td></tr>
      <tr><td class="text-muted" style="padding:6px 0;font-size:13px;">Email</td><td><a href="mailto:${a.email}" class="text-accent" style="font-size:14px;">${a.email}</a></td></tr>
      ${a.phone ? `<tr><td class="text-muted" style="padding:6px 0;font-size:13px;">Phone</td><td style="font-size:14px;color:var(--text-primary);">${a.phone}</td></tr>` : ''}
      <tr><td class="text-muted" style="padding:6px 0;font-size:13px;">Experience</td><td style="font-size:14px;color:var(--text-primary);">${a.experience}</td></tr>
      ${a.portfolio ? `<tr><td class="text-muted" style="padding:6px 0;font-size:13px;">Portfolio</td><td><a href="${a.portfolio}" target="_blank" class="text-accent" style="font-size:14px;">${a.portfolio}</a></td></tr>` : ''}
      ${a.resumePath ? `<tr><td class="text-muted" style="padding:6px 0;font-size:13px;">Resume</td><td><a href="/uploads/${a.resumePath.split('/').pop()}" class="text-accent" style="font-size:14px;">Download (${a.resumeOriginalName || 'resume'})</a></td></tr>` : ''}
      <tr><td class="text-muted" style="padding:6px 0;font-size:13px;">Date</td><td style="font-size:13px;color:var(--text-muted);">${fmtDate(a.createdAt)}</td></tr>
    </table>
    ${a.message ? `<div style="background:var(--bg-surface);border-radius:8px;padding:16px;margin-bottom:20px;border-left:3px solid var(--accent);"><p style="color:var(--text-secondary);font-size:14px;line-height:1.7;white-space:pre-wrap;">${a.message}</p></div>` : ''}
    <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <select id="status-select" style="background:var(--bg-primary);border:1px solid var(--border);color:var(--text-primary);padding:8px 12px;border-radius:6px;font-size:14px;">
        ${statuses.map((s) => `<option value="${s}" ${s === a.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
      <button class="btn btn-primary btn-sm" onclick="updateStatus('${a._id}')">Update Status</button>
      <button class="btn btn-danger btn-sm" onclick="deleteApp('${a._id}');closeModal()">Delete</button>
    </div>
  `);
};

window.updateStatus = async (id) => {
  const status = document.getElementById('status-select').value;
  await fetchWithAuth(`/api/jobs/${id}/status`, {
    method: 'PATCH',
    body:   JSON.stringify({ status }),
  });
  const a = allApps.find((x) => x._id === id);
  if (a) { a.status = status; renderTable(); }
  closeModal();
};

window.deleteApp = async (id) => {
  if (!confirm('Delete this application? This cannot be undone.')) return;
  await fetchWithAuth(`/api/jobs/${id}`, { method: 'DELETE' });
  allApps = allApps.filter((a) => a._id !== id);
  renderTable();
};

document.querySelectorAll('[data-filter]').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    currentPage   = 1;
    document.querySelectorAll('[data-filter]').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderTable();
  });
});

fetchApps();
