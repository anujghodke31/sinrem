# Discovery Report

This document outlines the initial findings from running the P0 commands, dependency advisories, TypeScript errors, and a proposed plan for follow-up PRs.

## 1. Output from P0 Commands

### `npm install` (Root)
```text
npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
added 239 packages, and audited 240 packages in 11s
```

### `cd frontend && npm install`
```text
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
added 270 packages, and audited 271 packages in 11s
```

### `npm run dev` (Root)
```text
> sinrem@1.0.0 dev
> nodemon server.js

[nodemon] starting `node server.js`
❌  Missing required environment variable: MONGO_URI. Set it in .env and restart.
[nodemon] app crashed - waiting for file changes before starting...
```

### `cd frontend && npm run dev`
```text
  VITE v6.4.2  ready in 213 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.0.2:3000/
```

### `cd frontend && npm run build`
```text
✓ 2169 modules transformed.
✓ built in 7.78s
(No blocking Vite warnings were observed during the build step, however TypeScript errors exist).
```

### `node server.js`
```text
❌  Missing required environment variable: MONGO_URI. Set it in .env and restart.
```

### `npm run seed`
```text
> sinrem@1.0.0 seed
> node scripts/seed.js

❌  MONGO_URI is not set in .env
```

## 2. Dependency Advisories (`npm audit --omit=dev`)

### Root (`npm audit --omit=dev`)
7 vulnerabilities (6 moderate, 1 critical)
- **Critical:** `protobufjs` (Arbitrary code execution, Prototype injection, DoS)
- **Moderate:** `nodemailer` (SMTP Command Injection)
- **Moderate:** `qs` (DoS)
- **Moderate:** `ws` (Uninitialized memory disclosure)
- **Moderate:** `@protobufjs/utf8` (Overlong UTF-8 decoding)

### Frontend (`cd frontend && npm audit --omit=dev`)
6 vulnerabilities (3 moderate, 3 high)
- **High:** `react-router` / `react-router-dom` (RCE via TYPE_ERROR deserialization, DoS, Open Redirect)
- **High:** `protobufjs` (Code injection, Prototype injection, DoS)
- **Moderate:** `postcss` (XSS via unescaped output)
- **Moderate:** `ws` (Uninitialized memory disclosure)
- **Moderate:** `@protobufjs/utf8` (Overlong UTF-8 decoding)

## 3. TypeScript Errors (`tsc --noEmit` in `frontend/`)
```text
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

## 4. Proposed Ordered List of Follow-up PRs

1. **Fix: Fix frontend TypeScript errors and missing environment variables logic**
   - Add `"vite/client"` to `compilerOptions.types` in `frontend/tsconfig.json` to resolve `ImportMeta` errors.
   - Fix the broken import `DynamicServiceCategory` in `HorizontalScrollShowcase.tsx` (using `ServiceCategory` from `lib/content.ts` instead).
   - Ensure `npm run dev` and `npm run seed` fallback correctly or exit gracefully when `.env` is absent, while strictly enforcing `MONGO_URI`.
2. **Fix: Enforce Node.js versions and fix root package dependencies**
   - Add `.nvmrc` with Node 20 LTS.
   - Update `engines` in `package.json` to require Node >= 20.19.0.
   - Upgrade vulnerable dependencies (`protobufjs`, `react-router`, `nodemailer`, `qs`, `ws`) via `npm audit fix`.
3. **Fix: Configure Express server for SPA canonical routing and resolve port configurations**
   - Rename `index.html` to `legacy.html` and configure `server.js` to serve `frontend/dist/index.html` at the canonical root (`/`) to prevent routing collisions.
   - Update `README.md` to clarify the `:5000` port vs `:5001` documentation and canonical routing decision.
4. **Fix: Audit and tighten Helmet CSP and backend security constraints**
   - Explicitly allow-list Gemini, Google Fonts, Apps Script endpoint, Vercel/Render in CSP.
   - Remove `'unsafe-inline'` / `'unsafe-eval'` if possible.
   - Confirm CORS respects `FRONTEND_URL` and rejects `*` in production.
5. **Fix: Fortify backend validation, ID guards, and Multer constraints**
   - Mount ObjectId guards on `/:id` routes.
   - Cap Multer uploads to 5MB, verify magic bytes, sanitize filenames.
   - Add `express-validator` logic to sanitize all public POST endpoints.
6. **Fix: Standardize backend logging, error handling, and shutdown flow**
   - Update Winston to redact PII (emails, tokens).
   - Catch and mask stack traces in production error handler middleware.
   - Wrap Nodemailer in try/catch and implement `EMAIL_ENABLED` feature flag.
7. **Fix: Implement frontend performance, accessibility, and SEO improvements**
   - Lazy load heavy components (`StackArchitect`, `Dashboard`, `PacketFlow`).
   - Add `<title>` and `<meta>` tags per page, ensure `alt` attributes on images, and check color contrast.

## 5. Ambiguities for Anuj (Maintainer)

- **Canonical Root:** The instructions mention that both the vanilla `index.html` and SPA `frontend/dist/index.html` compete for `/`. I plan to make the SPA the canonical root by renaming the vanilla site to `legacy.html` (as also noted in project memory). Please confirm this is acceptable.
- **AI Orb Key:** You requested we ensure `GEMINI_API_KEY` is not exposed in the browser. I will route the frontend AI widget to use `/api/ai/chat` instead of calling Gemini directly from the client. Let me know if the proxy rate-limiting (20/15min) will be sufficient for the orb's expected usage.
- **Port Discrepancy:** I noticed the README specifies `:5001` in some places but the `PORT` default is `5000`. I will standardize everything (backend port, Vite proxy, and README docs) on port `5000`. Please let me know if you'd prefer port `5001`.
