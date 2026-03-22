// ============================================================
// admin/assets/js/admin-dashboard.js
// ============================================================

import { fetchWithAuth } from './admin-auth.js';

// ── Time-aware greeting ────────────────────────────────────────
const greetingEl = document.getElementById('greeting-text');
if (greetingEl) {
  const hour   = new Date().getHours();
  const period = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  greetingEl.innerHTML = `Good ${period}, <span>Admin.</span>`;
}

// ── Format date ───────────────────────────────────────────────
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

// ── Fetch helper ──────────────────────────────────────────────
async function apiFetch(url) {
  const res = await fetchWithAuth(url);
  if (!res.ok) return null;
  return res.json();
}

// ── Stat setters ──────────────────────────────────────────────
function setStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '—';
}

// ── Render recent contacts table ──────────────────────────────
function renderMessages(contacts) {
  const tbody = document.getElementById('recent-messages');
  if (!tbody) return;

  if (!contacts.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No messages yet.</td></tr>';
    return;
  }

  tbody.innerHTML = contacts.map((c) => `
    <tr class="${c.isRead ? '' : 'unread'}">
      <td class="td-name">${c.name}</td>
      <td>${c.subject}</td>
      <td class="td-date">${fmtDate(c.createdAt)}</td>
      <td><span class="badge ${c.isRead ? 'badge-read' : 'badge-unread'}">${c.isRead ? 'Read' : 'Unread'}</span></td>
      <td><a href="messages.html" class="action-btn">View</a></td>
    </tr>
  `).join('');
}

// ── Render recent applications table ──────────────────────────
function renderApplications(apps) {
  const tbody = document.getElementById('recent-applications');
  if (!tbody) return;

  if (!apps.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No applications yet.</td></tr>';
    return;
  }

  tbody.innerHTML = apps.map((a) => `
    <tr class="${a.isRead ? '' : 'unread'}">
      <td class="td-name">${a.name}</td>
      <td>${a.position}</td>
      <td class="td-date">${fmtDate(a.createdAt)}</td>
      <td><span class="badge badge-${a.status.toLowerCase()}">${a.status}</span></td>
      <td><a href="applications.html" class="action-btn">View</a></td>
    </tr>
  `).join('');
}

// ── Load all data ──────────────────────────────────────────────
(async () => {
  const [contactRes, appRes] = await Promise.all([
    apiFetch('/api/contact?limit=5'),
    apiFetch('/api/jobs?limit=5'),
  ]);

  if (contactRes) {
    setStat('stat-total-messages',  contactRes.total);
    const unread = contactRes.data?.filter((c) => !c.isRead).length ?? 0;
    setStat('stat-unread-messages', unread);
    renderMessages(contactRes.data || []);

    const badge = document.getElementById('messages-badge');
    if (badge && unread > 0) badge.textContent = unread;
    else if (badge) badge.remove();
  }

  if (appRes) {
    setStat('stat-total-apps', appRes.total);
    const newApps = appRes.data?.filter((a) => a.status === 'New').length ?? 0;
    setStat('stat-new-apps', newApps);
    renderApplications(appRes.data || []);

    const badge = document.getElementById('apps-badge');
    if (badge && newApps > 0) badge.textContent = newApps;
    else if (badge) badge.remove();
  }
})();
