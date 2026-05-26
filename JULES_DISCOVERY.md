# Discovery Phase

This document summarizes the findings from the initial discovery phase, outlining the issues identified based on the P0 priorities and the `npm audit` / `tsc` checks. No code changes have been made in this PR; we are awaiting review of this discovery before proceeding with fixes.

## 1. `npm install` Errors (Node 18 & 20)

**Node 20:** `npm install` passes successfully in both root and `frontend/`.

**Node 18:** `npm install` passes, but produces engine warnings in `frontend/` due to dependencies requiring Node 20+:

```
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: '@google/genai@1.48.0',
npm warn EBADENGINE   required: { node: '>=20.0.0' },
npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }
npm warn EBADENGINE }
...
npm warn EBADENGINE   package: '@vitejs/plugin-react@5.2.0',
npm warn EBADENGINE   required: { node: '^20.19.0 || >=22.12.0' },
npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }
...
npm warn EBADENGINE   package: 'react-router@7.13.2',
npm warn EBADENGINE   required: { node: '>=20.0.0' }
...
npm warn EBADENGINE   package: 'react-router-dom@7.13.2',
npm warn EBADENGINE   required: { node: '>=20.0.0' }
```

**Conclusion on Node Version:** Node 20 is strictly required by the frontend dependencies (`@google/genai`, `vitejs/plugin-react`, `react-router`). We should bump the `engines` node in `package.json` to `>=20.19.0` to enforce this and resolve the warnings cleanly.

## 2. Dependency Advisories (`npm audit --omit=dev`)

**Backend:**
```
# npm audit report

nodemailer  <=8.0.4
Severity: moderate
Nodemailer Vulnerable to SMTP Command Injection via CRLF in Transport name Option (EHLO/HELO)  - https://github.com/advisories/GHSA-vvjj-xcjg-gr5g
fix available via `npm audit fix`
node_modules/nodemailer

protobufjs  <7.5.5
Severity: critical
Arbitrary code execution in protobufjs - https://github.com/advisories/GHSA-xq3m-2v4x-88gg
fix available via `npm audit fix`
node_modules/protobufjs

2 vulnerabilities (1 moderate, 1 critical)
```

**Frontend:**
```
# npm audit report

postcss  <8.5.10
Severity: moderate
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output - https://github.com/advisories/GHSA-qx2v-qp2m-jg93
fix available via `npm audit fix`
node_modules/postcss

1 moderate severity vulnerability
```

## 3. TypeScript Errors (`cd frontend && npx tsc --noEmit`)

```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

## 4. Proposed PRs (Follow-up)

1.  **P0 - Fix deps & versions:** Update `package.json` engines to `>=20.19.0`, fix Node 18 peer/engine warnings by enforcing Node 20, and run `npm audit fix` for root and frontend.
2.  **P0 - Fix TS errors:** Resolve `DynamicServiceCategory` import in `HorizontalScrollShowcase.tsx` (by importing `ServiceCategory` from `../../lib/content` instead) and fix `ImportMeta` typing (`import.meta.env`) in Vite frontend (by adding `vite/client` to `tsconfig.json` types).
3.  **P0 - Fix Vite proxy & ports:** Resolve `:5000` vs `:5001` conflict in Vite config vs Backend port. The configuration already correctly targets `5000`. Update `README.md` to reflect standard port `:5000`.
4.  **P0 - Build & Server Boot:** Fix vanilla vs SPA routing collision in `server.js`. Document canonical root choice (using SPA). Ensure `node server.js` serves SPA, `/admin`, `/api`, `/health` properly.
5.  **P0 - Seed & API Errors:** Fix `scripts/seed.js` idempotency (it shouldn't crash if `dotenv` or other env vars are missing during CI, but wait, `dotenv` issue was my local execution. We need to verify `seed.js` handles `MongoServerError` properly on rerun, though current logic seems robust). Validate and add express-validator rules to 5xx throwing routes under `/api/*` if any are missing.

## 5. Ambiguities & Clarifications needed from Anuj

*   **Canonical Root:** The README notes both `index.html` (vanilla) and `frontend/dist/index.html` (SPA) compete for `/`. Which one should be the actual `/` route in production?
    *   *My Proposal:* Make the React SPA (`frontend/dist`) the canonical root at `/`, and either drop the vanilla `index.html` or move it to a `/v1` route. For the purpose of the PRs, I will serve SPA at `/`.
*   **Port:** The README mentions backend is on `:5000`, but Vite proxies to `:5001`.
    *   *My Proposal:* The code already uses `:5000` in both `server.js` and `frontend/vite.config.ts`. I will simply update `README.md` to reflect `:5000` consistently.
