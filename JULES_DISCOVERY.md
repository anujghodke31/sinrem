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

**Conclusion on Node Version:** Node 20 is strictly required by the frontend dependencies (`@google/genai`, `vitejs/plugin-react`, `react-router`). The backend `package.json` should probably be bumped to `>=20.19.0`.

## 2. Dependency Advisories (`npm audit --omit=dev`)

**Backend:**
```
# npm audit report

@protobufjs/utf8  <=1.1.0
Severity: moderate
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
fix available via `npm audit fix`
node_modules/@protobufjs/utf8

nodemailer  <=8.0.4
Severity: moderate
Nodemailer Vulnerable to SMTP Command Injection via CRLF in Transport name Option (EHLO/HELO)  - https://github.com/advisories/GHSA-vvjj-xcjg-gr5g
fix available via `npm audit fix`
node_modules/nodemailer

protobufjs  <=7.5.5
Severity: critical
Arbitrary code execution in protobufjs - https://github.com/advisories/GHSA-xq3m-2v4x-88gg
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
protobuf.js: Denial of service from crafted field names in generated code - https://github.com/advisories/GHSA-2pr8-phx7-x9h3
protobuf.js: Code injection through bytes field defaults in generated toObject code - https://github.com/advisories/GHSA-66ff-xgx4-vchm
protobuf.js: Prototype injection in generated message constructors - https://github.com/advisories/GHSA-fx83-v9x8-x52w
protobuf.js: Code generation gadget after prototype pollution - https://github.com/advisories/GHSA-75px-5xx7-5xc7
protobuf.js: Process-wide denial of service through unsafe option paths - https://github.com/advisories/GHSA-jvwf-75h9-cwgg
protobuf.js: Denial of service through unbounded protobuf recursion - https://github.com/advisories/GHSA-685m-2w69-288q
fix available via `npm audit fix`
node_modules/protobufjs

3 vulnerabilities (2 moderate, 1 critical)
```

**Frontend:**
```
# npm audit report

@protobufjs/utf8  <=1.1.0
Severity: moderate
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
fix available via `npm audit fix`
node_modules/@protobufjs/utf8

postcss  <8.5.10
Severity: moderate
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output - https://github.com/advisories/GHSA-qx2v-qp2m-jg93
fix available via `npm audit fix`
node_modules/postcss

protobufjs  <=7.5.5
Severity: high
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
protobuf.js: Denial of service from crafted field names in generated code - https://github.com/advisories/GHSA-2pr8-phx7-x9h3
protobuf.js: Code injection through bytes field defaults in generated toObject code - https://github.com/advisories/GHSA-66ff-xgx4-vchm
protobuf.js: Prototype injection in generated message constructors - https://github.com/advisories/GHSA-fx83-v9x8-x52w
protobuf.js: Code generation gadget after prototype pollution - https://github.com/advisories/GHSA-75px-5xx7-5xc7
protobuf.js: Process-wide denial of service through unsafe option paths - https://github.com/advisories/GHSA-jvwf-75h9-cwgg
protobuf.js: Denial of service through unbounded protobuf recursion - https://github.com/advisories/GHSA-685m-2w69-288q
fix available via `npm audit fix`
node_modules/protobufjs

3 vulnerabilities (2 moderate, 1 high)
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
2.  **P0 - Fix TS errors:** Resolve `DynamicServiceCategory` import in `HorizontalScrollShowcase.tsx` by exporting it in `frontend/lib/api.ts` from `frontend/lib/content.ts` and fix `ImportMeta` typing (`import.meta.env`) in Vite frontend by adding `vite/client` to `tsconfig.json` types.
3.  **P0 - Fix Vite proxy & ports:** Ensure port 5000 is correctly referenced in README, fixing the single inaccurate `:5001` reference found in the README. The backend and frontend proxy actually both correctly use 5000 right now.
4.  **P0 - Build & Server Boot:** Fix vanilla vs SPA routing collision in `server.js` by renaming the vanilla `index.html` to `legacy.html`. Document canonical root choice (the React SPA). Ensure `node server.js` serves SPA, `/admin`, `/api`, `/health` properly.
5.  **P0 - Seed & API Errors:** Verify `npm run seed` idempotency. Currently `Admin.findOne` uses `.toLowerCase()` but `Admin.create` does not in `scripts/seed.js`. I will fix it to use `.toLowerCase()` on creation too. Validate and fix any 5xx throwing routes under `/api/*` (check `/api/ai/chat`, `/api/contact`, etc.).
6.  **P1 - Security & correctness:** Tighten Helmet CSP, verify CORS origins, JWT flow, Multer file sizes/extensions, ObjectId validation, express-validator validation.
7.  **P2 - Frontend quality:** TS Strictness, routing, accessibility (WCAG), performance optimization (lazy loading, code splitting), SEO.
8.  **P3 - Backend quality:** Winston logging cleanup, Email try/catch, AI proxy validation & timeout handling, Graceful shutdown.
9.  **P4 - DX & repo hygiene:** GitHub Actions CI, Husky + lint-staged, CONTRIBUTING.md, .nvmrc.

## 5. Ambiguities & Clarifications needed from Anuj

*   **Canonical Root:** The README notes both `index.html` (vanilla) and `frontend/dist/index.html` (SPA) compete for `/`. Which one should be the actual `/` route in production? (My proposal: the React SPA from `frontend/dist` should be `/`, and we can move the vanilla site to a different route like `/legacy.html`, or we can consolidate them. If no preference, I will serve SPA at `/` and rename vanilla index.html to legacy.html.)
*   **Port:** The README mentions backend is on `:5000`, but Vite proxies to `:5001` in one specific section. I will standardize on `:5000` for both backend and proxy, fixing the README.
