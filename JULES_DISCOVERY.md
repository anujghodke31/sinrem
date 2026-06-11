### JULES_DISCOVERY.md

#### P0 Findings

1. **`npm install`**:
   - Root `npm install`:
```
added 239 packages, and audited 240 packages in 12s

31 packages are looking for funding
  run `npm fund` for details

8 vulnerabilities (7 moderate, 1 critical)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
```
   - `frontend/npm install`:
```
added 270 packages, and audited 271 packages in 11s

99 packages are looking for funding
  run `npm fund` for details

6 vulnerabilities (3 moderate, 3 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
npm notice New minor version of npm available! 11.11.0 -> 11.17.0
```
   - No strict peer-dependency conflicts natively blocking installation on Node 18+ and Node 22 (`v22.22.1`), but they do have multiple vulnerability advisories.
   - `npm install` requires engines pinning for strict `package.json` constraints as per requirements.

2. **`npm run dev`**:
   - Works for backend (started smoothly locally on `:5000`).
   - For the Vite proxy to work correctly, the port for proxy in `vite.config.ts` correctly targets `http://localhost:5000` but `README.md` mentioned `5001`. Need to align `README.md` to `5000`.
   - Reconciled: Proxy correctly uses `http://localhost:5000`. Need to update README.md.

3. **`cd frontend && npm run build` (TypeScript + Vite)**:
   - Vite builds successfully:
```
vite v6.4.2 building for production...
transforming...
✓ 2169 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                     3.22 kB │ gzip:  1.17 kB
dist/assets/MagicBento-BpRlfAt-.css                 3.79 kB │ gzip:  1.30 kB
...
✓ built in 7.70s
```
   - TypeScript compiler found multiple errors preventing strict compliance or build confidence:
```
components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '"../../lib/api"' has no exported member 'DynamicServiceCategory'.
lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.
```
   - Need to fix `ImportMeta` TS definitions by including `"types": ["vite/client"]` in `frontend/tsconfig.json`.
   - Need to fix the missing `DynamicServiceCategory` type by properly exporting it in `frontend/lib/api.ts` or mapping `ServiceCategory` directly.

4. **`node server.js` boot**:
   - `server.js` boots fine and mounts basic health endpoint properly. No conflicts seen statically with SPA (`frontend/dist/index.html`) vs root vanilla page since both try to hit `/`.

5. **`npm run seed`**:
   - Fails when `MONGO_URI` is not set: `❌  MONGO_URI is not set in .env`
   - Tested using `mongodb-memory-server` and verified that running the seed function twice works idempotently without crashing (first run creates user, second run updates password).

#### Dependency Advisories (`npm audit`)
- Backend `npm audit` shows 7 vulnerabilities (6 moderate, 1 critical), including `@protobufjs/utf8`, `nodemailer`, `protobufjs`, `qs`, `ws`.
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
... (truncated for brevity)
fix available via `npm audit fix`
node_modules/protobufjs

qs  6.11.1 - 6.15.1
Severity: moderate
qs has a remotely triggerable DoS...
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
- Frontend `npm audit` shows 6 vulnerabilities.
Need to run `npm audit fix` where applicable.

#### Follow-up PRs Proposal
1. **Fix: Root P0 Configuration and Build Stability**
   - Pin engines (`>=20.19.0`) in root `package.json` and fix peer-deps.
   - Resolve TS `ImportMeta` errors (`vite/client` in `tsconfig.json`).
   - Fix `DynamicServiceCategory` TS error.
   - Align `README.md` Vite proxy port to `5000`.

2. **Fix: Dependency Advisories**
   - Run `npm audit fix` for root and frontend to address moderate and critical vulnerabilities.
   - Add/Update to un-deprecated versions where safe to do so.

3. **Fix: Seed Script Environment requirement**
   - Address the `npm run seed` missing `MONGO_URI` and graceful handling for automated pipelines where applicable, although no fix strictly needed if users configure `.env` correctly.

4. **Fix: API Route Validation and Error Handling**
   - Review `/api/*` endpoints for strict express-validator sanitization.
   - Add strict type assertions and Object ID validations.

5. **Ambiguities & Clarifications needed from Anuj**
   - No major ambiguities found at this stage; all errors and warnings have a clear path to resolution according to the provided instructions.
   - Question: Are we retaining the vanilla site root index.html? If so, we need to pick the definitive canonical root (SPA vs Vanilla) to fix routing fallback.
