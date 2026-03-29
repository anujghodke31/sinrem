// ============================================================
// admin/assets/js/admin-auth.js
//
// Security model:
//   • Access token → stored in module-scope JS memory ONLY
//     (never written to localStorage / sessionStorage / cookies)
//   • Refresh token → httpOnly cookie managed by the browser
//     (JS cannot read or steal it)
//   • Auto-refresh → schedules a silent POST /api/auth/refresh
//     60 seconds before the access token expires
//   • On any 401 TOKEN_EXPIRED → attempts one silent refresh,
//     then redirects to login if refresh also fails
// ============================================================

// ── In-memory token store ──────────────────────────────────────
let _accessToken   = null;
let _refreshTimer  = null;
let _tokenExpiry   = 0; // Unix ms

// ── Auth ready promise ────────────────────────────────────────
// Resolves true when the initial silent refresh succeeds; false if not.
// Other modules must await this before making authenticated requests.
let _readyResolve;
export const ready = new Promise((resolve) => { _readyResolve = resolve; });

// ── Public: get current access token ─────────────────────────
export const getToken = () => _accessToken;

// ── Public: build Authorization header ───────────────────────
export const authHeaders = () => ({
  Authorization:  `Bearer ${_accessToken}`,
  'Content-Type': 'application/json',
});

// ── Schedule silent refresh 60s before token expires ─────────
function scheduleRefresh(expiresInSeconds) {
  clearTimeout(_refreshTimer);
  const msUntilRefresh = Math.max((expiresInSeconds - 60) * 1000, 5000);
  _refreshTimer = setTimeout(silentRefresh, msUntilRefresh);
}

// ── Silent refresh: POST /api/auth/refresh ────────────────────
// Cookie is sent automatically by the browser.
export async function silentRefresh() {
  try {
    const res  = await fetch('/api/auth/refresh', {
      method:      'POST',
      credentials: 'same-origin', // Sends the httpOnly refresh cookie
    });

    if (!res.ok) {
      // Refresh token expired or was revoked → force re-login
      logout();
      return false;
    }

    const json = await res.json();
    if (json.success && json.accessToken) {
      _accessToken  = json.accessToken;
      _tokenExpiry  = Date.now() + json.expiresIn * 1000;
      scheduleRefresh(json.expiresIn);
      return true;
    }

    logout();
    return false;
  } catch {
    // Network error — don't log out immediately; retry on next API call
    return false;
  }
}

// ── fetchWithAuth: wraps fetch, retries once after token refresh ─
export async function fetchWithAuth(url, options = {}) {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${_accessToken}`,
  };

  const res = await fetch(url, { ...options, headers });

  // If access token just expired, try one silent refresh then retry
  if (res.status === 401) {
    const json = await res.clone().json().catch(() => ({}));
    if (json.code === 'TOKEN_EXPIRED') {
      const refreshed = await silentRefresh();
      if (refreshed) {
        // Retry original request with new token
        return fetch(url, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${_accessToken}` },
        });
      }
    }
    // Not TOKEN_EXPIRED or refresh failed — redirect to login
    logout();
  }

  return res;
}

// ── Logout ────────────────────────────────────────────────────
export function logout() {
  clearTimeout(_refreshTimer);
  _accessToken = null;

  // Tell the server to revoke the refresh token and clear its cookie
  fetch('/api/auth/logout', {
    method:      'POST',
    credentials: 'same-origin',
  }).finally(() => {
    window.location.href = '/admin/index.html';
  });
}

// ── Guard: verify token on page load ─────────────────────────
// On DOMContentLoaded, attempt a silent refresh to get a fresh
// access token using the existing httpOnly refresh cookie.
// If no valid session exists, the server returns 401 → logout.
(async () => {
  const ok = await silentRefresh();
  _readyResolve(ok); // Unblock any awaiting modules
  if (!ok) {
    // silentRefresh already called logout() which redirects
    return;
  }

  // Session is valid — wire up UI now that token is in memory
  document.addEventListener('DOMContentLoaded', () => {
    // Logout buttons
    document.querySelectorAll('[data-logout]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });

    // Mobile sidebar toggle
    const toggle  = document.querySelector('.admin-mobile-toggle');
    const sidebar = document.querySelector('.admin-sidebar');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

      document.addEventListener('click', (e) => {
        if (
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !toggle.contains(e.target)
        ) {
          sidebar.classList.remove('open');
        }
      });
    }

    // Mark active nav link
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'dashboard.html')) {
        link.classList.add('active');
      }
    });
  });
})();
