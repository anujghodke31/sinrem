# Discovery PR

This document summarizes the findings from the initial discovery phase, outlining the issues identified based on the P0 priorities and the `npm audit` / `tsc` checks. No code changes have been made in this PR; we are awaiting review of this discovery before proceeding with fixes.

## 1. P0 Errors Output (with full output)

### `npm install` at repo root
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
added 270 packages, and audited 271 packages in 12s

99 packages are looking for funding
  run `npm fund` for details

6 vulnerabilities (3 moderate, 3 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

### `cd frontend && npm run dev`
Works without errors, but the Vite proxy successfully points to `http://localhost:5000` whereas the README states it points to `5001`.

### `cd frontend && npm run build` (Build errors excerpt)
While Vite finishes the build process, it fails type checks under the hood during `tsc --noEmit`. Also, there is a known collision between vanilla `index.html` and the SPA fallback in `server.js`.

## 2. Dependency Advisories (`npm audit`)

### Backend `npm audit --omit=dev`
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
protobuf.js: Code injection through bytes field defaults in generated toObject code - https://github.com/advisories/GHSA-66ff-xgx4-vchm
protobuf.js: Denial of service from crafted field names in generated code - https://github.com/advisories/GHSA-2pr8-phx7-x9h3
protobuf.js: Prototype injection in generated message constructors - https://github.com/advisories/GHSA-fx83-v9x8-x52w
protobuf.js: Code generation gadget after prototype pollution - https://github.com/advisories/GHSA-75px-5xx7-5xc7
protobuf.js: Process-wide denial of service through unsafe option paths - https://github.com/advisories/GHSA-jvwf-75h9-cwgg
protobuf.js: Denial of service through unbounded protobuf recursion - https://github.com/advisories/GHSA-685m-2w69-288q
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
protobufjs: Denial of Service via unbounded recursive JSON descriptor expansion - https://github.com/advisories/GHSA-jggg-4jg4-v7c6
fix available via `npm audit fix`
node_modules/protobufjs

qs  6.11.1 - 6.15.1
Severity: moderate
qs has a remotely triggerable DoS: qs.stringify crashes with TypeError on null/undefined entries in comma-format arrays when encodeValuesOnly is set - https://github.com/advisories/GHSA-q8mj-m7cp-5q26
fix available via `npm audit fix`
node_modules/qs
  body-parser  1.20.3 - 1.20.4 || 2.0.0-beta.1 - 2.0.2
  Depends on vulnerable versions of qs
  node_modules/body-parser
  express  4.21.0 - 4.22.1 || 5.0.0-alpha.1 - 5.0.1
  Depends on vulnerable versions of qs
  node_modules/express

ws  8.0.0 - 8.20.0
Severity: moderate
ws: Uninitialized memory disclosure - https://github.com/advisories/GHSA-58qx-3vcg-4xpx
fix available via `npm audit fix`
node_modules/ws

7 vulnerabilities (6 moderate, 1 critical)
```

### Frontend `cd frontend && npm audit --omit=dev`
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
protobuf.js: Code injection through bytes field defaults in generated toObject code - https://github.com/advisories/GHSA-66ff-xgx4-vchm
protobuf.js: Denial of service from crafted field names in generated code - https://github.com/advisories/GHSA-2pr8-phx7-x9h3
protobuf.js: Prototype injection in generated message constructors - https://github.com/advisories/GHSA-fx83-v9x8-x52w
protobuf.js: Code generation gadget after prototype pollution - https://github.com/advisories/GHSA-75px-5xx7-5xc7
protobuf.js: Process-wide denial of service through unsafe option paths - https://github.com/advisories/GHSA-jvwf-75h9-cwgg
protobuf.js: Denial of service through unbounded protobuf recursion - https://github.com/advisories/GHSA-685m-2w69-288q
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
protobufjs: Denial of Service via unbounded recursive JSON descriptor expansion - https://github.com/advisories/GHSA-jggg-4jg4-v7c6
fix available via `npm audit fix`
node_modules/protobufjs

react-router  7.0.0 - 7.14.2
Severity: high
React Router's vendored turbo-stream v2 allows arbitrary constructor invocation via TYPE_ERROR deserialization leading to Unauth RCE - https://github.com/advisories/GHSA-49rj-9fvp-4h2h
React Router's same-origin redirect with path starting // causes open redirect via protocol-relative URL reinterpretation - https://github.com/advisories/GHSA-2j2x-hqr9-3h42
React Router vulnerable to DoS via unbounded path expansion in __manifest endpoint - https://github.com/advisories/GHSA-8x6r-g9mw-2r78
React Router vulnerable to Denial of Service via reflected user input in single-fetch - https://github.com/advisories/GHSA-rxv8-25v2-qmq8
fix available via `npm audit fix`
node_modules/react-router
  react-router-dom  7.0.0-pre.0 - 7.14.1
  Depends on vulnerable versions of react-router
  node_modules/react-router-dom

ws  8.0.0 - 8.20.0
Severity: moderate
ws: Uninitialized memory disclosure - https://github.com/advisories/GHSA-58qx-3vcg-4xpx
fix available via `npm audit fix`
node_modules/ws

6 vulnerabilities (3 moderate, 3 high)
```

## 3. TypeScript Errors (`cd frontend && npx tsc --noEmit`)
```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

## 4. Proposed Follow-up PRs
1. **[P0] Node Version & Deps Update**: Update `engines` in root `package.json` to `>=20.19.0`, fix Node 18 peer/engine warnings by enforcing Node 20, and run `npm audit fix` for root and frontend.
2. **[P0] Fix Frontend TS & Build Errors**: Resolve `DynamicServiceCategory` import in `HorizontalScrollShowcase.tsx` and add `vite/client` to `frontend/tsconfig.json` to resolve `import.meta.env` typing issues.
3. **[P0] Fix Port Config & README**: Fix the `README.md` to consistently reference `:5000` everywhere (instead of `:5001`), matching the Vite proxy and backend.
4. **[P0] Fix server.js Routing & Canonical Root**: Update `server.js` to serve `frontend/dist` as the canonical SPA at `/`, removing routing collision with the vanilla `index.html`. Add `/health` endpoint and verify `node server.js` boots cleanly.
5. **[P0] Fix Seed Script & API Errors**: Ensure `scripts/seed.js` checks handles duplicate runs gracefully. Add simple request validation rules via `express-validator` to any 5xx throwing routes under `/api/*`.

## 5. Ambiguities requiring clarification
Hi Anuj, before proceeding with the P0 fixes, I have a couple of questions:
- **Canonical Root:** The README notes both `index.html` (vanilla) and `frontend/dist/index.html` (SPA) compete for `/`. Should I make the SPA the canonical root and rename the vanilla site to `legacy.html`?
- **Backend Port**: The Vite proxy targets `localhost:5000` but the README mentions `:5001`. My plan is to document everything as port `5000`. Does this sound correct?
