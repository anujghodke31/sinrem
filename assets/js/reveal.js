/* ============================================================
   reveal.js — IntersectionObserver fade-up for .reveal elements
   ============================================================ */

// Observe both single .reveal elements and .reveal-group containers
const revealElements = document.querySelectorAll('.reveal, .reveal-group');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Fire once — unobserve after reveal
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12, // trigger when 12% of element is visible
    rootMargin: '0px 0px -20px 0px',
  }
);

revealElements.forEach((el) => revealObserver.observe(el));
