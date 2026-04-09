// ── API Base URL ──────────────────────────────────────────────
// In development: Vite proxies /api → localhost:5000 (vite.config.ts)
// In production (Vercel): set VITE_API_URL to your backend URL
//   e.g. https://your-backend.onrender.com
// If not set, falls back to relative /api (works when frontend + backend
// are on the same origin, e.g. served by Express).
export const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') // strip trailing slash
  : '';

export function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}
