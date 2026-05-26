# Jules Discovery

## 1. P0 Command Errors

**npm install (root)**
- Two vulnerabilities (1 moderate, 1 critical) from nodemailer and protobufjs.
- Deprecation warnings for multer@1.4.5-lts.2 and node-domexception@1.0.0.

**npm install (frontend/)**
- One moderate vulnerability from postcss.
- Deprecation warning for node-domexception@1.0.0.

## 2. Dependency Advisories (npm audit --omit=dev)

**Root**
- nodemailer <=8.0.4 (Moderate): SMTP Command Injection via CRLF in Transport name Option (EHLO/HELO)
- protobufjs <7.5.5 (Critical): Arbitrary code execution in protobufjs

**Frontend**
- postcss <8.5.10 (Moderate): PostCSS has XSS via Unescaped </style> in its CSS Stringify Output

## 3. TypeScript Errors (tsc --noEmit in frontend/)

- `components/ui/HorizontalScrollShowcase.tsx(4,35): error TS2305: Module '../../lib/api' has no exported member 'DynamicServiceCategory'.`
- `lib/apiBase.ts(7,37): error TS2339: Property 'env' does not exist on type 'ImportMeta'.`
- `lib/apiBase.ts(8,17): error TS2339: Property 'env' does not exist on type 'ImportMeta'.`
- `pages/Contact.tsx(43,41): error TS2339: Property 'env' does not exist on type 'ImportMeta'.`

## 4. Proposed Follow-Up PRs

1. **Fix package dependencies & audit:**
   - Run `npm audit fix` on both root and `frontend/`.
   - Update `multer` to 2.x if available and compatible to fix deprecation.
   - Update `package.json` engines to `"node": ">=18.0.0 <=20.x.x"` to pin Node versions properly.
2. **Fix frontend TypeScript errors:**
   - Update `tsconfig.json` in frontend/ to include Vite types for `import.meta.env` (`"types": ["vite/client"]`).
   - Fix `HorizontalScrollShowcase.tsx` missing export by correctly exporting or defining `DynamicServiceCategory` in `lib/api.ts` or importing it from `lib/content.ts` depending on where it belongs.
3. **Configure Development Environment:**
   - Resolve the Vite proxy port ambiguity (proxy target is 5001, but backend runs on 5000). Set `VITE_API_URL` / proxy target to 5000 and update README to clarify.
4. **Fix Production Server configuration:**
   - Define a clear strategy for the vanilla site vs SPA in production (decide whether `index.html` serves the SPA or vanilla site, moving the other to a separate route like `/vanilla`).
5. **Backend stability and security:**
   - Setup global error handling and validation.
   - Add ObjectId validation for Mongo.
   - Security: configure Helmet CSP correctly.

## 5. Ambiguities for Anuj

1. Should the root URL `/` in production serve the vanilla HTML site or the React SPA? They currently collide on `index.html`.
2. Do we want to upgrade `multer` to 2.x (which is still in beta/alpha for years but resolves the vulnerability) or stick with 1.4.5-lts?
3. Should the Vite proxy port explicitly be 5000 (matching backend `PORT`) or should the backend port be 5001?
