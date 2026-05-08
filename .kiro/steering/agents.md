---
inclusion: auto
---

# Agent Instructions — Sinrem Project

## Before Making Any Change
1. Check `frontend/lib/content.ts` first — if the data exists there, use it. Don't create API calls for static content.
2. Check `frontend/lib/site.ts` for contact info, social links, company name — never hardcode these.
3. Check `frontend/index.css` for CSS variable values before assuming color behavior.
4. Check `frontend/tailwind.config.js` for custom color tokens (wati-green, wati-dark, wati-blue, etc.).

## Color Rules (STRICT)
- **NEVER** use `text-muted` — it maps to the background color and is invisible. Use `text-muted-foreground`.
- **NEVER** hardcode hex colors for text or backgrounds — use CSS variables or Tailwind tokens.
- **ALWAYS** add `dark:` variants when using theme-dependent colors.
- The `wati-*` colors are fixed brand colors (not theme-dependent): green=#00E599, pink=#FF6B9D, yellow=#FFE566, blue=#4FC3FF, dark=#1D1D1B.
- For muted text: use `text-foreground/60` or `text-muted-foreground`.
- For card backgrounds: use `bg-card` (adapts to theme).
- For page backgrounds: use `bg-bg` (adapts to theme).

## Component Patterns
- All new sections should be lazy-loaded: `const X = React.lazy(() => import('./X'))` + `<Suspense>`.
- Use `<Container>` for max-width centering.
- Use `<Button>` component (not raw `<a>` or `<button>`) for CTAs.
- Use `<Badge>` for section labels.
- Framer Motion animations should use `whileInView` with `viewport={{ once: true }}` — not mount animations.
- Images below the fold must have `loading="lazy"`.

## Content Updates
When adding new content:
1. Add the data to `frontend/lib/content.ts` with proper TypeScript types.
2. Import from `content.ts` in the component — never fetch from API for public content.
3. Update the "Data Sources in content.ts" section in `.kiro/steering/context.md`.
4. If it affects AI knowledge, update both `frontend/lib/knowledge.ts` AND `controllers/aiKnowledge.js`.

## SEO
- Every page must call `useSEO({ title, description, path })` from `frontend/lib/useSEO.ts`.
- Titles format: `Page Name | Sinrem Tech`.
- Update `frontend/public/sitemap.xml` when adding new public routes.
- Router is `BrowserRouter` (NOT HashRouter) — clean URLs for Google crawling.

## Deployment
- Frontend builds to `frontend/dist/` via `npm run build` in `frontend/`.
- Vercel serves `frontend/` with root directory set to `frontend`.
- Backend on Render with `node server.js` start command.
- Contact form goes to Google Apps Script (env: `VITE_APPS_SCRIPT_URL`), falls back to `/api/contact`.
- Always rebuild after changes: `cd frontend && npm run build`.

## Testing Checklist After Changes
- [ ] `npm run build` in `frontend/` succeeds with no errors
- [ ] Check both light AND dark mode
- [ ] Check mobile (375px) and desktop (1440px) viewports
- [ ] Verify no `text-muted` (without `-foreground`) in changed files
- [ ] Verify no hardcoded hex colors for text/backgrounds
- [ ] If route added: verify it's in App.tsx, sitemap.xml, and useSEO is called
- [ ] If content added: verify it's in content.ts and context.md is updated

## File Change Log Protocol
After completing any task, update the "Recent Changes Log" section at the bottom of `.kiro/steering/context.md` with a one-line summary of what was changed.