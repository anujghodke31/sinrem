# Discovery PR Findings

This PR contains the discovery findings as requested, with no code changes.

## 1. P0 Errors (Baseline)
### npm install
#### Root `npm install`
```
added 239 packages, and audited 240 packages in 12s

31 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (5 moderate, 2 high, 1 critical)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
 npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

#### Frontend `npm install`
```
added 270 packages, and audited 271 packages in 13s

99 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (1 low, 2 moderate, 5 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

### npm run dev
#### Root `npm run dev`
```
> sinrem@1.0.0 dev
> nodemon server.js

[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
[nodemon] starting `node server.js`
❌  Missing required environment variable: MONGO_URI. Set it in .env and restart.
[nodemon] app crashed - waiting for file changes before starting...
```

#### Frontend Vite Proxy Alignment
The frontend `vite.config.ts` proxies `/api` to `http://localhost:5000`. However, the `README.md` explicitly states:
"The README mentions `:5001` in one place" — this discrepancy requires alignment.

### TypeScript Compilation (frontend)
#### `cd frontend && npx tsc --noEmit`
```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```

## 2. Dependency Advisories (`npm audit --omit=dev`)
### Root
```
# npm audit report

@protobufjs/utf8  <=1.1.0
Severity: moderate
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
fix available via `npm audit fix`
node_modules/@protobufjs/utf8

nodemailer  <=9.0.0
Severity: high
Nodemailer Vulnerable to SMTP Command Injection via CRLF in Transport name Option (EHLO/HELO)  - https://github.com/advisories/GHSA-vvjj-xcjg-gr5g
Nodemailer: CRLF injection in Nodemailer List-* header comments allows arbitrary message header injection - https://github.com/advisories/GHSA-268h-hp4c-crq3
Nodemailer jsonTransport bypasses disableFileAccess and disableUrlAccess during message normalization - https://github.com/advisories/GHSA-wqvq-jvpq-h66f
Nodemailer: Improper TLS Certificate Validation in OAuth2 Token Fetch Enables Credential Interception - https://github.com/advisories/GHSA-r7g4-qg5f-qqm2
Nodemailer: Message-level raw option bypasses disableFileAccess/disableUrlAccess, enabling arbitrary file read and full-response SSRF in the delivered message - https://github.com/advisories/GHSA-p6gq-j5cr-w38f
fix available via `npm audit fix`
node_modules/nodemailer

protobufjs  <=7.6.2
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
protobufjs : Schema-derived names can shadow runtime-significant properties - https://github.com/advisories/GHSA-f38q-mgvj-vph7
protobufjs: Denial of service through unbounded Any expansion during JSON conversion - https://github.com/advisories/GHSA-wcpc-wj8m-hjx6
fix available via `npm audit fix`
node_modules/protobufjs

qs  6.11.1 - 6.15.1
Severity: moderate
qs has a remotely triggerable DoS: qs.stringify crashes with TypeError on null/undefined entries in comma-format arrays when encodeValuesOnly is set - https://github.com/advisories/GHSA-q8mj-m7cp-5q26
fix available via `npm audit fix`
node_modules/qs

ws  8.0.0 - 8.20.1
Severity: high
ws: Uninitialized memory disclosure - https://github.com/advisories/GHSA-58qx-3vcg-4xpx
ws: Memory exhaustion DoS from tiny fragments and data chunks - https://github.com/advisories/GHSA-96hv-2xvq-fx4p
fix available via `npm audit fix`
node_modules/ws
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

protobufjs  <=7.6.2
Severity: high
protobuf.js: Code injection through bytes field defaults in generated toObject code - https://github.com/advisories/GHSA-66ff-xgx4-vchm
protobuf.js: Denial of service from crafted field names in generated code - https://github.com/advisories/GHSA-2pr8-phx7-x9h3
protobuf.js: Prototype injection in generated message constructors - https://github.com/advisories/GHSA-fx83-v9x8-x52w
protobuf.js: Code generation gadget after prototype pollution - https://github.com/advisories/GHSA-75px-5xx7-5xc7
protobuf.js: Process-wide denial of service through unsafe option paths - https://github.com/advisories/GHSA-jvwf-75h9-cwgg
protobuf.js: Denial of service through unbounded protobuf recursion - https://github.com/advisories/GHSA-685m-2w69-288q
protobufjs has overlong UTF-8 decoding - https://github.com/advisories/GHSA-q6x5-8v7m-xcrf
protobufjs: Denial of Service via unbounded recursive JSON descriptor expansion - https://github.com/advisories/GHSA-jggg-4jg4-v7c6
protobufjs : Schema-derived names can shadow runtime-significant properties - https://github.com/advisories/GHSA-f38q-mgvj-vph7
protobufjs: Denial of service through unbounded Any expansion during JSON conversion - https://github.com/advisories/GHSA-wcpc-wj8m-hjx6
fix available via `npm audit fix`
node_modules/protobufjs

react-router  7.0.0 - 7.15.0
Severity: high
React Router's vendored turbo-stream v2 allows arbitrary constructor invocation via TYPE_ERROR deserialization leading to Unauth RCE - https://github.com/advisories/GHSA-49rj-9fvp-4h2h
React Router's same-origin redirect with path starting // causes open redirect via protocol-relative URL reinterpretation - https://github.com/advisories/GHSA-2j2x-hqr9-3h42
React Router vulnerable to DoS via unbounded path expansion in __manifest endpoint - https://github.com/advisories/GHSA-8x6r-g9mw-2r78
React Router vulnerable to Denial of Service via reflected user input in single-fetch - https://github.com/advisories/GHSA-rxv8-25v2-qmq8
React Router: Potential CSRF via PUT/PATCH/DELETE document requests - https://github.com/advisories/GHSA-84g9-w2xq-vcv6
fix available via `npm audit fix`
node_modules/react-router

ws  8.0.0 - 8.20.1
Severity: high
ws: Uninitialized memory disclosure - https://github.com/advisories/GHSA-58qx-3vcg-4xpx
ws: Memory exhaustion DoS from tiny fragments and data chunks - https://github.com/advisories/GHSA-96hv-2xvq-fx4p
fix available via `npm audit fix`
node_modules/ws
```

## 3. Proposed Follow-up PRs
- **PR 1: Dependency & Node Engine Updates (P0)**
  - Pin `engines.node` to `>=20.19.0` in root `package.json`.
  - Add `.nvmrc` with `v20.19.0`.
  - Run `npm audit fix --omit=dev` at root and `frontend/` to patch high/critical vulnerabilities. Update `multer` to 2.x to resolve deprecation warning.
- **PR 2: Frontend TypeScript Fixes (P0)**
  - Add `"vite/client"` to `compilerOptions.types` in `frontend/tsconfig.json` to fix `ImportMeta` errors.
  - Fix missing export `DynamicServiceCategory` in `HorizontalScrollShowcase.tsx` by defining the type inline based on `useContentServices` output structure.
- **PR 3: Dev Environment & Proxy Alignment (P0)**
  - Update `README.md` to consistently refer to port 5000 (removing the incorrect 5001 mention).
  - Add `MONGO_URI` error handling / template guidance.
- **PR 4: Production Build & Routing (P0)**
  - Rename the vanilla `index.html` to `legacy.html` so the SPA (`frontend/dist/index.html`) serves as the canonical root without collision in `server.js`. Update `README.md` to document this rationale.
- **PR 5: Database Seeding & API Validations (P0)**
  - Ensure `npm run seed` correctly handles idempotency.
  - Review and fix any 5xx-throwing routes under `/api/*` reachable with valid input.

## 4. Ambiguities for Clarification
- **Canonical Root:** Currently both `index.html` (vanilla) and `frontend/dist/index.html` (SPA) compete for `/`. My proposal is to make the React SPA (`frontend/dist`) the canonical root and rename the vanilla page to `legacy.html`. Does this approach sound acceptable?
