# Discovery Report for sinrem.tech

## 1. Initial Findings from P0 Commands

### `npm install` (root)
```
added 239 packages, and audited 240 packages in 13s
31 packages are looking for funding
  run `npm fund` for details
8 vulnerabilities (5 moderate, 2 high, 1 critical)
npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

### `cd frontend && npm install`
```
added 270 packages, and audited 271 packages in 14s
99 packages are looking for funding
  run `npm fund` for details
8 vulnerabilities (1 low, 2 moderate, 5 high)
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

### `node server.js`
Before setting `.env`:
```
 ❌  Missing required environment variable: MONGO_URI. Set it in .env and restart.
```
After `cp .env.example .env && node server.js` (with local MongoDB not running):
```
 ❌  MongoDB connection failed: connect ECONNREFUSED 127.0.0.1:27017
```

### `npm run seed`
```
 ❌  Seed failed: connect ECONNREFUSED 127.0.0.1:27017
```
*(Fails gracefully with a caught error when MongoDB is not reachable, but we need to ensure the DB connection is handled smoothly or documented).*

### `npm audit --omit=dev` (Backend)
- `@protobufjs/utf8 <=1.1.0` (Moderate)
- `nodemailer <=9.0.0` (High)
- `protobufjs <=7.6.2` (Critical)
- `qs 6.11.1 - 6.15.1` (Moderate)
- `ws 8.0.0 - 8.20.1` (High)

### `npm audit --omit=dev` (Frontend)
- `@babel/core <=7.29.0` (High)
- `@protobufjs/utf8 <=1.1.0` (Moderate)
- `postcss <8.5.10` (Moderate)
- `protobufjs <=7.6.2` (High)
- `react-router 7.0.0 - 7.15.0` (High)
- `vite <=6.4.2` (High)
- `ws 8.0.0 - 8.20.1` (High)

### `cd frontend && tsc --noEmit`
```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```
*(These TypeScript errors block the build strictness).*

---

## 2. Proposed Ordered List of Follow-up PRs

1. **PR 1: P0 - Type Safety & Dependencies Setup**
   - Fix TypeScript errors (`vite/client` in tsconfig, `DynamicServiceCategory` type export).
   - Pin Node engines in `package.json` for root and frontend to >= 18.
   - Resolve `npm install` peer-dependency warnings and deprecations where safe.

2. **PR 2: P0 - Server Routing & Boot Stabilization**
   - Fix Vite proxy port (syncing backend port 5000 with frontend).
   - Reconcile the canonical root route issue (Vanilla `index.html` vs SPA `frontend/dist/index.html`) in `server.js` and update README to document the decision.
   - Ensure `npm run seed` executes safely on empty DB scenarios.
   - Fix any 5xx-throwing API routes by ensuring proper input validation and try-catch blocks.

3. **PR 3: P1 - Security Audits & Updates**
   - Run `npm audit fix` and manually upgrade vulnerable packages (`protobufjs`, `nodemailer`, `react-router`, `ws`, `vite`).
   - Audit and tighten Helmet CSP and CORS (strict `FRONTEND_URL` in production).
   - Harden JWT handling, multert configuration, input sanitization (stripping HTML from text), and add MongoDB ObjectId validations.

4. **PR 4: P2 - Frontend Quality Improvements**
   - Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` in TS config and address new errors.
   - Setup ESLint/Prettier with scripts.
   - Resolve React 19 deprecations, verify routing/404s, address accessibility (WCAG AA) and performance (lazy-loading).

5. **PR 5: P3 - Backend Reliability & DX Setup**
   - Implement structured Winston logging (PII redaction) and email fallback (try/catch).
   - Refine the AI proxy (`/api/ai/chat`), ensuring Gemini API keys are fully removed from the frontend and strict rate limiting is applied.
   - Setup GitHub Actions CI, pre-commit hooks (Husky), `CONTRIBUTING.md`, and integration tests.

---

## 3. Ambiguities for Clarification

- **Canonical Root URL (`/`)**: Currently, both the vanilla `index.html` and the SPA's `index.html` compete for the root path. Should I set the SPA as the definitive root (`/`) and remove the vanilla `index.html` (or move it to a legacy route), or vice-versa?
- **AI Widget & Gemini API Key**: The frontend `.env.local` references `GEMINI_API_KEY`. The goal is to avoid exposing it to the browser. Can I completely refactor the frontend AI orb to route all prompt requests through the `/api/ai/chat` proxy and strip the Gemini SDK out of the frontend?
