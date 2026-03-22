// ============================================================
// admin/assets/js/admin-blog.js
// ============================================================

import { fetchWithAuth } from './admin-auth.js';

let allPosts  = [];
let editingId = null;

const postList    = document.getElementById('post-list');
const editorPanel = document.getElementById('editor-panel');
const editorTitle = document.getElementById('editor-heading');
const form        = document.getElementById('blog-form');

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

async function fetchPosts() {
  const res  = await fetchWithAuth('/api/blog/admin/all');
  if (!res.ok) return;
  const json = await res.json();
  allPosts = json.data || [];
  renderList();
}

function renderList() {
  if (!allPosts.length) {
    postList.innerHTML = '<p class="empty-state">No posts yet. Click "New Post" to create one.</p>';
    return;
  }

  postList.innerHTML = allPosts.map((p) => `
    <div class="post-row" style="padding:12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px;">
      <div style="flex:1;min-width:0;">
        <p style="font-size:14px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.title}</p>
        <p style="font-size:12px;color:var(--text-muted);margin-top:2px;">${p.category} · ${fmtDate(p.createdAt)}</p>
      </div>
      <span class="badge ${p.isPublished ? 'badge-published' : 'badge-draft'}">${p.isPublished ? 'Published' : 'Draft'}</span>
      <div style="display:flex;gap:6px;flex-shrink:0;">
        <button class="action-btn" onclick="editPost('${p._id}')">Edit</button>
        <button class="action-btn delete" onclick="deletePost('${p._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function newPost() {
  editingId = null;
  editorTitle.textContent = 'New Post';
  form.reset();
  form.elements.isPublished.checked = false;
  editorPanel.style.display = 'block';
}

window.editPost = async (id) => {
  const p = allPosts.find((x) => x._id === id);
  if (!p) return;
  editingId = id;
  editorTitle.textContent = 'Edit Post';

  form.elements.title.value      = p.title || '';
  form.elements.category.value   = p.category || 'Insights';
  form.elements.tags.value       = (p.tags || []).join(', ');
  form.elements.excerpt.value    = p.excerpt || '';
  form.elements.coverImage.value = p.coverImage || '';
  form.elements.isPublished.checked = p.isPublished || false;
  editorPanel.style.display = 'block';

  // Fetch full content
  const res = await fetchWithAuth(`/api/blog/${p.slug}`);
  if (res.ok) {
    const json = await res.json();
    if (json.data) form.elements.content.value = json.data.content || '';
  }
};

window.deletePost = async (id) => {
  if (!confirm('Delete this post? This cannot be undone.')) return;
  await fetchWithAuth(`/api/blog/${id}`, { method: 'DELETE' });
  allPosts = allPosts.filter((p) => p._id !== id);
  renderList();
  if (editingId === id) { editorPanel.style.display = 'none'; editingId = null; }
};

document.getElementById('cancel-btn')?.addEventListener('click', () => {
  editorPanel.style.display = 'none';
  editingId = null;
  form.reset();
});

document.getElementById('new-post-btn')?.addEventListener('click', newPost);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;

  const body = {
    title:       form.elements.title.value.trim(),
    category:    form.elements.category.value,
    tags:        form.elements.tags.value.split(',').map((t) => t.trim()).filter(Boolean),
    excerpt:     form.elements.excerpt.value.trim(),
    content:     form.elements.content.value.trim(),
    coverImage:  form.elements.coverImage.value.trim(),
    isPublished: form.elements.isPublished.checked,
  };

  const url    = editingId ? `/api/blog/${editingId}` : '/api/blog';
  const method = editingId ? 'PUT' : 'POST';

  try {
    const res  = await fetchWithAuth(url, { method, body: JSON.stringify(body) });
    const json = await res.json();

    if (json.success) {
      await fetchPosts();
      editorPanel.style.display = 'none';
      editingId = null;
      form.reset();
    } else {
      alert(json.message || 'Failed to save post.');
    }
  } catch {
    alert('Network error. Please try again.');
  } finally {
    btn.disabled = false;
  }
});

fetchPosts();
