/* ============================================================
   mobile-menu.js — Hamburger toggle, overlay open/close, body lock
   ============================================================ */

const hamburgerBtn   = document.getElementById('hamburger-btn');
const overlay        = document.getElementById('mobile-menu-overlay');
const closeBtn       = document.getElementById('mobile-close-btn');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

// ── Open menu ────────────────────────────────────────────
function openMenu() {
  overlay.classList.add('open');
  document.body.classList.add('menu-open');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  closeBtn.focus();
}

// ── Close menu ───────────────────────────────────────────
function closeMenu() {
  overlay.classList.remove('open');
  document.body.classList.remove('menu-open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  hamburgerBtn.focus();
}

// ── Event listeners ──────────────────────────────────────
hamburgerBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);

// Close when any mobile nav link is clicked (navigate + close)
mobileNavLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close also on the mobile CTA button
const mobileCta = overlay.querySelector('.mobile-cta');
if (mobileCta) {
  mobileCta.addEventListener('click', closeMenu);
}

// Close on backdrop click (click outside the nav list)
overlay.addEventListener('click', (e) => {
  // Only close if clicking the overlay itself, not its children
  if (e.target === overlay) {
    closeMenu();
  }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) {
    closeMenu();
  }
});
