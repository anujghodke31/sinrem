# Discovery Phase

This document summarizes the findings from the initial discovery phase, outlining the issues identified based on the P0 priorities and the `npm audit` / `tsc` checks.

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

**Conclusion on Node Version:** Node 20 is strictly required by the frontend dependencies (`@google/genai`, `vitejs/plugin-react`, `react-router`). The backend `package.json` should probably be bumped to `>=20.0.0` or `>=20.19.0`.

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

1.  **P0 - Fix deps & versions:** Update `package.json` engines to `>=20.19.0` to align with frontend dependencies requirement, fix Node 18 peer/engine warnings by enforcing Node 20, and run `npm audit fix` for root and frontend.
2.  **P0 - Fix TS errors:** Fix `DynamicServiceCategory` type missing by adding `export type { ServiceCategory as DynamicServiceCategory } from './content';` to `frontend/lib/api.ts` and fix `ImportMeta` typing (`import.meta.env`) in Vite frontend by adding `"vite/client"` to `compilerOptions.types` in `frontend/tsconfig.json`.
3.  **P0 - Fix Vite proxy & ports:** Update `README.md` to replace instances of `:5001` with `:5000` because the `vite.config.ts` proxy correctly points to `http://localhost:5000`.
4.  **P0 - Build & Server Boot:** The vanilla vs SPA routing collision is a non-issue in code. `server.js` serves SPA at `/` but doesn't serve the vanilla site at root. The `express.static` call on `frontend/dist` intercepts `/` and serves `frontend/dist/index.html`. Thus the vanilla site is completely ignored. I will create a PR to update `README.md` to clarify that the SPA is the canonical root and the vanilla site is not served at root by `server.js`.
5.  **P0 - Seed & API Errors:**
    *   No code changes are needed for API validation! The validation rules are already correctly set in the routes (`contact.js`, `jobs.js`, etc.) using `express-validator` and `validateRequest` middleware.
    *   No code changes are needed for `scripts/seed.js`! It already checks `existing` user via `Admin.findOne` before creating a new one, so it is fully idempotent. I just need to document that `mongod` must be running locally to run the seed script.

## 5. Ambiguities & Clarifications needed from Anuj

*   None! All ambiguities have been resolved through code exploration. The Vite proxy port is `5000` and the canonical root is definitely the SPA since `server.js` ignores the vanilla `index.html`.
