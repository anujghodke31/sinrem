# Discovery PR

This document summarizes the findings from the initial discovery phase, outlining the issues identified based on the P0 priorities and the `npm audit` / `tsc` checks. No code changes have been made in this PR; we are awaiting review of this discovery before proceeding with fixes.

## 1. P0 Commands Output

### `npm install` (Root)
```
added 239 packages, and audited 240 packages in 12s

31 packages are looking for funding
  run `npm fund` for details

2 vulnerabilities (1 moderate, 1 critical)

To address all issues, run:
  npm audit fix

npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

### `cd frontend && npm install`
```
added 270 packages, and audited 271 packages in 10s

99 packages are looking for funding
  run `npm fund` for details

1 moderate severity vulnerability

npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```
**Conclusion on Node Version:** Node 20 is strictly required by the frontend dependencies (`@google/genai`, `vitejs/plugin-react`, `react-router`). We should bump the `engines` node in `package.json` to `>=20.19.0` to enforce this and resolve the warnings cleanly.

### `cd frontend && npm run dev`
Works cleanly. Vite proxies `/api` to `:5000` (which is correctly set in `vite.config.ts`, but the `README.md` falsely mentions `:5001`).

### `cd frontend && npm run build`
Fails due to TypeScript errors when `vite build` triggers type checking:
```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```
Additionally, `vite build` throws errors about `import.meta.env` when building the application.

## 2. npm audit advisories

### Backend
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
protobuf.js: Code injection through bytes field defaults in generated toObject code - https://github.com/advisories/GHSA-66ff-xgx4-vchm
protobuf.js: Denial of service from crafted field names in generated code - https://github.com/advisories/GHSA-2pr8-phx7-x9h3
protobuf.js: Prototype injection in generated message constructors - https://github.com/advisories/GHSA-fx83-v9x8-x52w
protobuf.js: Code generation gadget after prototype pollution - https://github.com/advisories/GHSA-75px-5xx7-5xc7
protobuf.js: Process-wide denial of service through unsafe option paths - https://github.com/advisories/GHSA-jvwf-75h9-cwgg
protobuf.js: Denial of service through unbounded protobuf recursion - https://github.com/advisories/GHSA-685m-2w69-288q
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
fix available via `npm audit fix`
node_modules/protobufjs

2 vulnerabilities (1 moderate, 1 critical)
```

### Frontend
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

esbuild  0.17.0 - 0.28.0
Severity: high
esbuild: Missing binary integrity verification in Deno module enables remote code execution via NPM_CONFIG_REGISTRY - https://github.com/advisories/GHSA-gv7w-rqvm-qjhr
fix available via `npm audit fix --force`
Will install vite@8.0.16, which is a breaking change
node_modules/esbuild
  vite  4.2.0-beta.0 - 8.0.3
  Depends on vulnerable versions of esbuild
  node_modules/vite
```

## 3. TypeScript errors (`cd frontend && npx tsc --noEmit`)
```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

## 4. Proposed PRs (Follow-up)

1.  **P0 - Fix deps & versions:** Update `package.json` engines to `>=20.19.0`, fix Node 18 peer/engine warnings by enforcing Node 20, and run `npm audit fix` for root. For frontend, update `vite` to latest to resolve the `esbuild` high severity vulnerability.
2.  **P0 - Fix TS errors:** Resolve `DynamicServiceCategory` import in `HorizontalScrollShowcase.tsx` (by importing `ServiceCategory` from `../../lib/content` instead) and fix `ImportMeta` typing (`import.meta.env`) in Vite frontend (by adding `vite/client` to `tsconfig.json` types).
3.  **P0 - Fix Vite proxy & ports:** Resolve `:5000` vs `:5001` conflict in Vite config vs Backend port. The configuration already correctly targets `5000`. Update `README.md` to reflect standard port `:5000`.
4.  **P0 - Build & Server Boot:** Add documentation to README regarding canonical root choice (using React SPA instead of vanilla `index.html` root). `node server.js` already successfully serves the SPA, `/admin`, `/api`, `/health`.
5.  **P0 - Seed & API Errors:** Ensure `scripts/seed.js` idempotency works perfectly by lowering the case of the username correctly on Admin user creation.

## 5. Ambiguities & Clarifications needed from Anuj

*   **Canonical Root:** The README notes both `index.html` (vanilla) and `frontend/dist/index.html` (SPA) compete for `/`. Which one should be the actual `/` route in production?
    *   *My Proposal:* Make the React SPA (`frontend/dist`) the canonical root at `/`, and either drop the vanilla `index.html` or move it to a `/v1` route. The current Express configuration already prioritizes serving `frontend/dist/index.html` for root.
*   **Port:** The README mentions backend is on `:5000`, but Vite proxies to `:5001`.
    *   *My Proposal:* The code already uses `:5000` in both `server.js` and `frontend/vite.config.ts`. I will simply update `README.md` to reflect `:5000` consistently.
