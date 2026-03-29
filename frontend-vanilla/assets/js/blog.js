/* ============================================================
   frontend/assets/js/blog.js
   Fetches published posts from GET /api/blog?limit=3
   and renders them into the #blog-grid element
   ============================================================ */

const grid = document.getElementById('blog-grid');
if (!grid) throw new Error('blog-grid element not found');

// ── Render a single blog card ─────────────────────────────────

function renderCard(post) {
  const card = document.createElement('article');
  card.className = 'blog-card';

  card.innerHTML = `
    <div class="blog-card-inner">
      <span class="tag-accent blog-category mono micro">${post.category}</span>
      <h3 class="blog-title">${post.title}</h3>
      <p class="blog-excerpt">${post.excerpt}</p>
      <footer class="blog-footer">
        <span class="blog-read-time">${post.readTime ? `${post.readTime} min read` : ''}</span>
        <a href="/blog/${post.slug}" class="blog-read-more">Read more <span aria-hidden="true">→</span></a>
      </footer>
    </div>
  `;

  return card;
}

// ── Render "coming soon" placeholder ─────────────────────────

function renderPlaceholder() {
  const el = document.createElement('div');
  el.className = 'blog-soon';
  el.innerHTML = '<p>First post coming soon. We\'re writing something worth reading.</p>';
  return el;
}

// ── Fetch + render ────────────────────────────────────────────

(async () => {
  try {
    const res  = await fetch('/api/blog?limit=3');

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const posts = json.data || [];

    grid.innerHTML = ''; // Clear loading state if any

    if (posts.length === 0) {
      grid.appendChild(renderPlaceholder());
    } else {
      posts.forEach((post) => grid.appendChild(renderCard(post)));
    }
  } catch {
    // Silently hide the blog section on fetch failure
    const section = document.getElementById('blog');
    if (section) section.style.display = 'none';
  }
})();
