/* ============================================================
   counter.js — Animated stat counter using requestAnimationFrame
   Data attributes: data-count="20" data-suffix="+"
   ============================================================ */

const counterEls = document.querySelectorAll('[data-count]');

// Ease-out cubic function for natural deceleration
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || '';
  const duration = 1500; // ms
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutCubic(progress);
    const current  = Math.floor(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Ensure exact final value
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

// Trigger animation when the stats container scrolls into view
const statsContainer = document.querySelector('.hero-stats');

if (statsContainer) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counterEls.forEach(animateCounter);
          // Only animate once
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterObserver.observe(statsContainer);
}
