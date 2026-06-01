# Discovery PR

This document summarizes the findings from the initial discovery phase, outlining the issues identified based on the P0 priorities and the `npm audit` / `tsc` checks. No code changes have been made in this PR; we are awaiting review of this discovery before proceeding with fixes.

## 1. P0 Execution Findings

### `npm install` (root)
```
added 239 packages, and audited 240 packages in 13s

31 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (7 moderate, 1 critical)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
 npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
npm notice
npm notice New minor version of npm available! 11.11.0 -> 11.16.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.16.0
npm notice To update run: npm install -g npm@11.16.0
npm notice
```

### `cd frontend && npm install`
```
added 270 packages, and audited 271 packages in 11s

99 packages are looking for funding
  run `npm fund` for details

4 vulnerabilities (3 moderate, 1 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```
**Conclusion on Node Version:** Node 20 is strongly recommended (and practically required by newer React ecosystem deps). We should bump the `engines` node in `package.json` to `>=20.19.0` to enforce this and resolve engine warnings cleanly.

### `npm run dev` (backend)
```
> sinrem@1.0.0 dev
> nodemon server.js

[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
[nodemon] starting `node server.js`
[nodemon] app crashed - waiting for file changes before starting...
 ❌  Missing required environment variable: MONGO_URI. Set it in .env and restart.
```
Works normally when env variables are provided. Port defaults to `5000`.

### `cd frontend && npm run dev`
```
> copy-of-sharadchandra-techventures@0.0.0 dev
> vite

  VITE v6.4.2  ready in 325 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.0.2:3000/
```
Works, Vite proxies to `http://localhost:5000` (which is correctly set in `frontend/vite.config.ts`, but the README falsely mentions `:5001`).

### `cd frontend && npm run build`
```
> copy-of-sharadchandra-techventures@0.0.0 build
> vite build

vite v6.4.2 building for production...
transforming...
✓ 2169 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                     3.22 kB │ gzip:  1.17 kB
... (assets output omitted for brevity) ...
dist/assets/react-dom-vendor-BgbIt6BQ.js          180.88 kB │ gzip: 56.45 kB
✓ built in 7.59s
```
Fails due to TypeScript errors when `vite build` triggers type checking:
```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

## 2. npm audit advisories

### Backend (`npm audit --omit=dev`)
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

protobufjs  <=7.5.7
Severity: critical
Arbitrary code execution in protobufjs - https://github.com/advisories/GHSA-xq3m-2v4x-88gg
... (7 sub-vulnerabilities omitted for brevity) ...
fix available via `npm audit fix`
node_modules/protobufjs

qs  6.11.1 - 6.15.1
Severity: moderate
qs has a remotely triggerable DoS: qs.stringify crashes with TypeError on null/undefined entries in comma-format arrays when encodeValuesOnly is set - https://github.com/advisories/GHSA-q8mj-m7cp-5q26
fix available via `npm audit fix`
node_modules/qs

ws  8.0.0 - 8.20.0
Severity: moderate
ws: Uninitialized memory disclosure - https://github.com/advisories/GHSA-58qx-3vcg-4xpx
fix available via `npm audit fix`
node_modules/ws

7 vulnerabilities (6 moderate, 1 critical)

To address all issues, run:
  npm audit fix
```

### Frontend (`cd frontend && npm audit --omit=dev`)
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

protobufjs  <=7.5.7
Severity: high
... (8 sub-vulnerabilities omitted for brevity) ...
fix available via `npm audit fix`
node_modules/protobufjs

ws  8.0.0 - 8.20.0
Severity: moderate
ws: Uninitialized memory disclosure - https://github.com/advisories/GHSA-58qx-3vcg-4xpx
fix available via `npm audit fix`
node_modules/ws

4 vulnerabilities (3 moderate, 1 high)

To address all issues, run:
  npm audit fix
```

## 3. TypeScript errors (`cd frontend && npx tsc --noEmit`)
```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

## 4. Proposed PRs (Follow-up)

1.  **P0 - Fix Deps & Node Engine**: Bump `engines.node` to `>=20.19.0` in the root `package.json`. Run `npm audit fix` across both root and frontend to patch `protobufjs`, `qs`, `ws`, `postcss`, and `nodemailer`. Add justification to the PR description for dependency updates.
2.  **P0 - Fix Vite Types & TS Build**: Add `"vite/client"` to `compilerOptions.types` in `frontend/tsconfig.json` to resolve `import.meta.env` errors. Fix the import of `DynamicServiceCategory` (now `ServiceCategory`) in `HorizontalScrollShowcase.tsx`.
3.  **P0 - Fix README & Vite Port Alignment**: Update `README.md` to consistently refer to backend port `:5000` (resolving the incorrect `:5001` mention).
4.  **P0 - Fix Vanilla vs. SPA Routing**: In `server.js`, configure the SPA (`frontend/dist/index.html`) as the canonical root at `/` while removing or redirecting the vanilla `index.html` file to avoid collisions. Document this design decision in the PR and README.
5.  **P0 - Validate API Routes**: Audit the remaining `/api/*` POST endpoints for validation using `express-validator` to prevent any 5xx errors from invalid payloads.

## 5. Ambiguities & Clarifications needed from Anuj

*   **Canonical Root:** The README notes both `index.html` (vanilla) and `frontend/dist/index.html` (SPA) compete for `/`. I plan to make the React SPA the canonical root at `/`, effectively rendering the vanilla root `index.html` legacy. Should the vanilla index be deleted entirely, or renamed to something like `legacy.html`? I will default to renaming it to `legacy.html` and setting the SPA to the root.
*   **Vite Proxy Port:** The README mentions backend is on `:5000`, but Vite proxies to `:5001`. The backend defaults to `:5000` and `vite.config.ts` targets `:5000`. I will correct the `README.md` documentation to match the codebase (`:5000`).
