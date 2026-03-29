// ============================================================
// admin/assets/js/admin-messages.js
// ============================================================

import { fetchWithAuth, ready as authReady } from './admin-auth.js';

let allContacts   = [];
let currentFilter = 'all';
const PAGE_SIZE   = 20;
let currentPage   = 1;

const tbody      = document.getElementById('messages-tbody');
const modal      = document.getElementById('message-modal');
const modalBody  = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

function openModal(content) { modalBody.innerHTML = content; modal.classList.add('open'); }
function closeModal()        { modal.classList.remove('open'); }

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

async function fetchContacts() {
  const res  = await fetchWithAuth('/api/contact?limit=200');
  if (!res.ok) return;
  const json = await res.json();
  allContacts = json.data || [];
  renderTable();
}

function filtered() {
  return currentFilter === 'unread'
    ? allContacts.filter((c) => !c.isRead)
    : allContacts;
}

function renderTable() {
  const data  = filtered();
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = data.slice(start, start + PAGE_SIZE);

  if (!page.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No messages found.</td></tr>';
    renderPagination(0);
    return;
  }

  tbody.innerHTML = page.map((c, i) => `
    <tr class="${c.isRead ? '' : 'unread'}" data-id="${c._id}">
      <td class="td-date">${start + i + 1}</td>
      <td class="td-name">${c.name}</td>
      <td class="td-email">${c.email}</td>
      <td>${c.subject}</td>
      <td class="td-date">${fmtDate(c.createdAt)}</td>
      <td><span class="badge ${c.isRead ? 'badge-read' : 'badge-unread'}">${c.isRead ? 'Read' : 'New'}</span></td>
      <td>
        <div class="td-actions">
          <button class="action-btn" onclick="viewMessage('${c._id}')">View</button>
          <button class="action-btn delete" onclick="deleteMessage('${c._id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination(data.length);
}

function renderPagination(total) {
  const pages = Math.ceil(total / PAGE_SIZE);
  const el    = document.getElementById('pagination');
  if (!el) return;
  if (pages <= 1) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">← Prev</button>
    <span style="font-size:13px;color:var(--text-muted)">Page ${currentPage} of ${pages}</span>
    <button class="page-btn" ${currentPage >= pages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Next →</button>
  `;
}

window.changePage = (p) => { currentPage = p; renderTable(); };
window.closeModal = closeModal;

window.viewMessage = (id) => {
  const c = allContacts.find((x) => x._id === id);
  if (!c) return;
  if (!c.isRead) markRead(id);

  openModal(`
    <h2 class="modal-title">${c.subject}</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td class="text-muted" style="padding:6px 0;width:70px;font-size:13px;">From</td><td style="font-size:14px;color:var(--text-primary);">${c.name}</td></tr>
      <tr><td class="text-muted" style="padding:6px 0;font-size:13px;">Email</td><td><a href="mailto:${c.email}" class="text-accent" style="font-size:14px;">${c.email}</a></td></tr>
      <tr><td class="text-muted" style="padding:6px 0;font-size:13px;">Date</td><td style="font-size:13px;color:var(--text-muted);">${fmtDate(c.createdAt)}</td></tr>
    </table>
    <div style="background:var(--bg-surface);border-radius:8px;padding:20px;border-left:3px solid var(--accent);margin-bottom:24px;">
      <p style="color:var(--text-secondary);font-size:15px;line-height:1.8;white-space:pre-wrap;">${c.message}</p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <a href="mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}" class="btn btn-primary btn-sm">Reply via Email</a>
      <button class="btn btn-danger btn-sm" onclick="deleteMessage('${c._id}');closeModal()">Delete</button>
    </div>
  `);
};

async function markRead(id) {
  await fetchWithAuth(`/api/contact/${id}/read`, { method: 'PATCH' });
  const c = allContacts.find((x) => x._id === id);
  if (c) { c.isRead = true; renderTable(); }
}

window.deleteMessage = async (id) => {
  if (!confirm('Delete this message? This cannot be undone.')) return;
  await fetchWithAuth(`/api/contact/${id}`, { method: 'DELETE' });
  allContacts = allContacts.filter((c) => c._id !== id);
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

authReady.then((ok) => { if (ok) fetchContacts(); });
