// ============================================================
// admin/assets/js/admin-login.js
// POST /api/auth/login → access token stored in memory,
// refresh token set as httpOnly cookie by the server.
// ============================================================

// If a valid session already exists (refresh cookie still good),
// redirect to dashboard silently.
(async () => {
  try {
    const res  = await fetch('/api/auth/refresh', {
      method:      'POST',
      credentials: 'same-origin',
    });
    if (res.ok) {
      window.location.href = '/admin/dashboard.html';
      return;
    }
  } catch {
    // No active session — show the login form normally
  }

  // ── Wire up login form after confirming no existing session ──
  const form      = document.getElementById('login-form');
  const errorEl   = document.getElementById('login-error');
  const card      = document.querySelector('.login-card');
  const submitBtn = form.querySelector('button[type="submit"]');

  function shake() {
    card.classList.add('shake');
    card.addEventListener('animationend', () => card.classList.remove('shake'), { once: true });
  }

  function showError(msg) {
    errorEl.textContent = msg;
    shake();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.textContent   = '';
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Signing in…';

    const username = form.elements.username.value.trim();
    const password = form.elements.password.value;

    if (!username || !password) {
      showError('Please enter your username and password.');
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Sign In';
      return;
    }

    try {
      const res  = await fetch('/api/auth/login', {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'same-origin', // Required so browser stores the httpOnly cookie
        body:        JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (res.status === 423) {
        // Account locked
        showError(json.message || 'Account locked. Try again later.');
        return;
      }

      if (json.success && json.accessToken) {
        // Access token is passed to the dashboard via sessionStorage ONCE.
        // dashboard's admin-auth.js immediately moves it into memory and
        // clears sessionStorage. This avoids the token sitting in storage.
        sessionStorage.setItem('sinrem_init_token', json.accessToken);
        sessionStorage.setItem('sinrem_init_expiry', String(json.expiresIn));
        window.location.href = '/admin/dashboard.html';
      } else {
        showError(json.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      showError('Network error. Is the server running?');
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Sign In';
    }
  });
})();
