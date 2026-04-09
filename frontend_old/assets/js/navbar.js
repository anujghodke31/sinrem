/* ============================================================
   navbar.js — Scroll state class + active nav link detection
   ============================================================ */

const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');

// ── 1. Scroll class toggle ───────────────────────────────
function handleNavScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// Run once on load
handleNavScroll();

// ── 2. Active nav link via IntersectionObserver ──────────
const sections = document.querySelectorAll('main section[id], main div[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        navLinks.forEach((link) => {
          link.classList.remove('active');
          // Match href="#sectionId" to detected section
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  }
);

sections.forEach((section) => sectionObserver.observe(section));
