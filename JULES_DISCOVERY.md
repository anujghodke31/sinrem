# Discovery PR

This document summarizes the findings from the initial discovery phase, outlining the issues identified based on the P0 priorities and the `npm audit` / `tsc` checks. No code changes have been made in this PR; we are awaiting review of this discovery before proceeding with fixes.

### `npm install`
```
added 239 packages, and audited 240 packages in 12s

31 packages are looking for funding
  run `npm fund` for details

2 vulnerabilities (1 moderate, 1 critical)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
 npm warn deprecated multer@1.4.5-lts.2: Multer 1.x is impacted by a number of vulnerabilities, which have been patched in 2.x. You should upgrade to the latest 2.x version.
npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
npm notice
npm notice New minor version of npm available! 11.11.0 -> 11.14.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.14.1
npm notice To update run: npm install -g npm@11.14.1
npm notice
```

### `cd frontend && npm install`
```
added 270 packages, and audited 271 packages in 10s

99 packages are looking for funding
  run `npm fund` for details

1 moderate severity vulnerability

**Conclusion on Node Version:** Node 20 is strictly required by the frontend dependencies (`@google/genai`, `vitejs/plugin-react`, `react-router`). We should bump the `engines` node in `package.json` to `>=20.19.0` to enforce this and resolve the warnings cleanly.

Run `npm audit` for details.
 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
```

### `cd frontend && npm run dev`
Works, Vite proxies to `:5000` (which is correctly set in `vite.config.ts`, but the README falsely mentions `:5001`).

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
dist/assets/MagicBento-BpRlfAt-.css                 3.79 kB │ gzip:  1.30 kB
dist/assets/index-Dp4Pm5ui.css                     82.79 kB │ gzip: 12.62 kB
dist/assets/NotFound-hrLFK7QK.js                    0.92 kB │ gzip:  0.49 kB
dist/assets/Blog-LqhCvxq_.js                        0.96 kB │ gzip:  0.55 kB
dist/assets/ClientsMarquee-DDfmA_vA.js              1.39 kB │ gzip:  0.73 kB
dist/assets/Technologies-B7bKUKdy.js                1.57 kB │ gzip:  0.75 kB
dist/assets/Testimonials-B9zd7jbU.js                2.34 kB │ gzip:  1.04 kB
dist/assets/AcademySection-D9jQ3447.js              2.75 kB │ gzip:  0.96 kB
dist/assets/Academy-CRpi73HH.js                     2.79 kB │ gzip:  1.11 kB
dist/assets/Careers-DxsmEoqW.js                     5.88 kB │ gzip:  2.38 kB
dist/assets/HorizontalScrollShowcase-Bjyj4I1K.js    6.85 kB │ gzip:  2.35 kB
dist/assets/Contact-CQehnMuP.js                     8.99 kB │ gzip:  2.95 kB
dist/assets/Login-0lIHTohS.js                       9.04 kB │ gzip:  3.29 kB
dist/assets/Services-46_TpJba.js                    9.47 kB │ gzip:  3.30 kB
dist/assets/About-CwQ34Eoy.js                       9.55 kB │ gzip:  3.10 kB
dist/assets/RoiCalculator-DqY7iEdE.js               9.71 kB │ gzip:  3.24 kB
dist/assets/MagicBento-DsbvYqx0.js                  9.80 kB │ gzip:  3.22 kB
dist/assets/Dashboard-o3mgtlrV.js                  10.77 kB │ gzip:  3.11 kB
dist/assets/CaseStudyDetail-DoSAmYoZ.js            10.87 kB │ gzip:  3.21 kB
dist/assets/StackArchitect-52Nkc_fD.js             11.29 kB │ gzip:  3.67 kB
dist/assets/helmet-vendor-Cu8GhC0H.js              14.39 kB │ gzip:  5.30 kB
dist/assets/CaseStudies-Cp6LCbbs.js                14.60 kB │ gzip:  4.33 kB
dist/assets/PacketFlow-DjBTHMb3.js                 17.17 kB │ gzip:  4.87 kB
dist/assets/icons-vendor-C7pTi-_4.js               26.96 kB │ gzip:  6.05 kB
dist/assets/router-vendor-DMF94DVC.js              36.69 kB │ gzip: 13.21 kB
dist/assets/motion-vendor-oNUUZJQE.js              46.88 kB │ gzip: 16.61 kB
dist/assets/gsap-vendor-CB87Sc6I.js                70.32 kB │ gzip: 27.76 kB
dist/assets/index-BN_s2ffJ.js                      79.83 kB │ gzip: 26.99 kB
dist/assets/vendor-CdZsUu8m.js                    152.27 kB │ gzip: 50.79 kB
dist/assets/react-dom-vendor-BgbIt6BQ.js          180.88 kB │ gzip: 56.45 kB
✓ built in 8.24s
```
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

To address all issues, run:
  npm audit fix
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

1 moderate severity vulnerability

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
