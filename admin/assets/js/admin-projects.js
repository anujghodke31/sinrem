// ============================================================
// admin/assets/js/admin-projects.js
// ============================================================

import { fetchWithAuth, ready as authReady } from './admin-auth.js';

let allProjects = [];
let editingId   = null;
let reorderMode = false;

const projectList = document.getElementById('project-list');
const formPanel   = document.getElementById('project-form-panel');
const form        = document.getElementById('project-form');
const formTitle   = document.getElementById('form-heading');

async function fetchProjects() {
  const res  = await fetchWithAuth('/api/projects');
  if (!res.ok) return;
  const json = await res.json();
  allProjects = json.data || [];
  renderList();
}

function renderList() {
  if (!allProjects.length) {
    projectList.innerHTML = '<p class="empty-state">No projects yet. Click "Add Project" to create one.</p>';
    return;
  }

  projectList.innerHTML = allProjects.map((p) => `
    <div
      class="project-row"
      data-id="${p._id}"
      draggable="${reorderMode}"
      style="
        background:var(--bg-card);
        border:1px solid var(--border);
        border-radius:8px;
        padding:16px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin-bottom:8px;
        ${reorderMode ? 'cursor:grab;border-color:var(--accent-dim);' : ''}
      "
    >
      ${reorderMode ? '<span style="color:var(--text-muted);font-size:18px;user-select:none;">⠿</span>' : ''}
      <div style="flex:1;min-width:0;">
        <p style="font-size:15px;font-weight:600;color:var(--text-primary);">${p.title}</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">
          <span style="font-size:11px;background:var(--accent-dim);color:var(--accent);padding:3px 8px;border-radius:100px;">${p.type}</span>
          ${(p.techStack || []).map((t) => `<span style="font-size:11px;background:var(--bg-surface);color:var(--text-muted);padding:3px 8px;border-radius:100px;border:1px solid var(--border);">${t}</span>`).join('')}
          ${p.featured ? '<span style="font-size:11px;background:rgba(251,191,36,0.1);color:#FBB024;padding:3px 8px;border-radius:100px;">Featured</span>' : ''}
        </div>
      </div>
      ${!reorderMode ? `
      <div style="display:flex;gap:8px;flex-shrink:0;">
        <button class="action-btn" onclick="editProject('${p._id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteProject('${p._id}')">Delete</button>
      </div>` : ''}
    </div>
  `).join('');

  if (reorderMode) initDragDrop();
}

function initDragDrop() {
  const rows = projectList.querySelectorAll('.project-row');
  let dragSrc = null;

  rows.forEach((row) => {
    row.addEventListener('dragstart', () => { dragSrc = row; row.style.opacity = '0.4'; });
    row.addEventListener('dragend',   () => { row.style.opacity = '1'; dragSrc = null; });
    row.addEventListener('dragover',  (e) => { e.preventDefault(); row.style.borderColor = 'var(--accent)'; });
    row.addEventListener('dragleave', () => { row.style.borderColor = 'var(--accent-dim)'; });
    row.addEventListener('drop',      async (e) => {
      e.preventDefault();
      row.style.borderColor = 'var(--accent-dim)';
      if (dragSrc && dragSrc !== row) {
        projectList.insertBefore(dragSrc, row);
        await saveOrder();
      }
    });
  });
}

async function saveOrder() {
  const ids = [...projectList.querySelectorAll('.project-row')].map((r) => r.dataset.id);
  await fetchWithAuth('/api/projects/reorder', {
    method: 'PUT',
    body:   JSON.stringify({ ids }),
  });
}

document.getElementById('reorder-btn')?.addEventListener('click', () => {
  reorderMode = !reorderMode;
  const btn = document.getElementById('reorder-btn');
  btn.textContent = reorderMode ? 'Done Reordering' : 'Reorder';
  renderList();
});

document.getElementById('add-project-btn')?.addEventListener('click', () => {
  editingId = null;
  formTitle.textContent = 'Add Project';
  form.reset();
  form.elements.featured.checked = false;
  formPanel.style.display = 'block';
});

window.editProject = (id) => {
  const p = allProjects.find((x) => x._id === id);
  if (!p) return;
  editingId = id;
  formTitle.textContent = 'Edit Project';
  form.elements.title.value       = p.title || '';
  form.elements.type.value        = p.type  || '';
  form.elements.description.value = p.description || '';
  form.elements.techStack.value   = (p.techStack || []).join(', ');
  form.elements.liveUrl.value     = p.liveUrl || '';
  form.elements.featured.checked  = p.featured || false;
  formPanel.style.display = 'block';
};

window.deleteProject = async (id) => {
  if (!confirm('Delete this project?')) return;
  await fetchWithAuth(`/api/projects/${id}`, { method: 'DELETE' });
  allProjects = allProjects.filter((p) => p._id !== id);
  renderList();
  if (editingId === id) { formPanel.style.display = 'none'; editingId = null; }
};

document.getElementById('cancel-project-btn')?.addEventListener('click', () => {
  formPanel.style.display = 'none';
  editingId = null;
  form.reset();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;

  const body = {
    title:       form.elements.title.value.trim(),
    type:        form.elements.type.value,
    description: form.elements.description.value.trim(),
    techStack:   form.elements.techStack.value,
    liveUrl:     form.elements.liveUrl.value.trim(),
    featured:    form.elements.featured.checked,
  };

  const url    = editingId ? `/api/projects/${editingId}` : '/api/projects';
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res  = await fetchWithAuth(url, { method, body: JSON.stringify(body) });
    const json = await res.json();

    if (json.success) {
      await fetchProjects();
      formPanel.style.display = 'none';
      editingId = null;
      form.reset();
    } else {
      alert(json.message || 'Failed to save project.');
    }
  } catch {
    alert('Network error.');
  } finally {
    btn.disabled = false;
  }
});

authReady.then((ok) => { if (ok) fetchProjects(); });
