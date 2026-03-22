/* ============================================================
   scroll-progress.js — Updates the top progress bar width on scroll
   ============================================================ */

const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.body.scrollHeight - window.innerHeight;
  const scrolled     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${scrolled}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });

// Initialize on load (in case page starts scrolled)
updateProgress();
