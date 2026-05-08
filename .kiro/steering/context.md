---
inclusion: auto
---

# Sinrem Project Context — Always Loaded

## Identity
- **Brand:** Sinrem Tech (legal: Sharadchandra TechVentures Pvt. Ltd.)
- **Domain:** sinremtech.in
- **Email:** info@sinrem.tech
- **Phone:** +91 9503119046
- **WhatsApp:** 919503119046
- **Address:** Anjali Nagar, Katraj, Pune, Maharashtra 411046
- **Founded:** April 2023
- **LinkedIn:** https://www.linkedin.com/company/sharadchandra-techventures/
- **Instagram:** https://www.instagram.com/sinrem_

## Architecture
- **Monorepo** with backend at root, React SPA in `frontend/`
- **Backend:** Node.js 18+ · Express · MongoDB · Mongoose · ESM modules
- **Frontend:** React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion
- **Admin Panel:** Vanilla HTML/CSS/JS at `/admin` (NOT part of React SPA)
- **AI Chatbot:** Gemini API proxied server-side via `/api/ai/chat`
- **Auth:** JWT access token (15m) + httpOnly refresh cookie (7d)
- **Deployment:** Frontend → Vercel | Backend → Render | DB → MongoDB Atlas

## Critical Rules
1. ALL public content (services, products, case studies, pricing, clients, testimonials, academy) is **STATIC** in `frontend/lib/content.ts`. No API calls for public data.
2. Dynamic data (contact forms, job applications) flows through MongoDB REST API.
3. Gemini API key is **NEVER** exposed to the browser. All AI calls go through `/api/ai/chat`.
4. Dev runs TWO servers: backend :5000, Vite SPA :3000 (proxies /api → backend).
5. ESM throughout backend — no `require()`.
6. Contact form submits to Google Apps Script (Sheets + email) as primary, Express `/api/contact` as fallback.
7. `text-muted` class is BANNED — always use `text-muted-foreground` for muted text.
8. All colors must use CSS variables or Tailwind `dark:` variants — no hardcoded hex for text/backgrounds.

## Key Files
| Purpose | File |
|---------|------|
| All public content | `frontend/lib/content.ts` |
| Site metadata | `frontend/lib/site.ts` |
| Theme tokens | `frontend/index.css` |
| Tailwind config | `frontend/tailwind.config.js` |
| React router | `frontend/App.tsx` |
| AI knowledge (frontend) | `frontend/lib/knowledge.ts` |
| AI knowledge (backend) | `controllers/aiKnowledge.js` |
| AI proxy controller | `controllers/aiController.js` |
| Express entry | `server.js` |
| SEO hook | `frontend/lib/useSEO.ts` |
| API base URL | `frontend/lib/apiBase.ts` |

## Data Sources in content.ts
- `serviceCategories` — 4 categories, 11 services with modal detail data
- `products` — Dhruv AI, NOVUS Academia
- `caseStudies` — Shree Metal, CVK Engineers, C4i4, House of Amrth
- `clients` — 7 clients (Aadya Exim, Entrelogy, CVK, Malhar, Shree Metal, C4i4, House of Amrth)
- `testimonials` — 4 real client quotes with ratings
- `techStack` — 5 categories (Web, AI, Mobile, Cloud, Business Tools)
- `academy` — 3 courses (Design Thinking ₹299, AI Foundation ₹499, Business AI ₹999)
- `aboutStats` — 100% Recurring, 20+ Clients, 2+ Years, 3 Verticals
- `companyTimeline` — 6 milestones (April 2023 → December 2025)

## Pages & Routes
| Route | Page | Status |
|-------|------|--------|
| `/` | Home | ✅ Live |
| `/services` | Services | ✅ Live |
| `/case-studies` | Case Studies + Products | ✅ Live |
| `/case-studies/:slug` | Case Study Detail | ✅ Live |
| `/about` | About | ✅ Live |
| `/contact` | Contact | ✅ Live |
| `/careers` | Careers (4 open roles) | ✅ Live |
| `/technologies` | Technologies | ✅ Live |
| `/blog` | Blog | ✅ Live |
| `/academy` | Academy | ✅ Live |
| `/login` | Members Login (demo) | ✅ Hidden from nav |
| `/dashboard` | Dashboard (demo) | ✅ Hidden from nav |
| `/tools/stack-architect` | Stack Architect tool | ✅ Live |
| `/tools/roi-calculator` | ROI Calculator tool | ✅ Live |
| `/games/packet-flow` | Packet Flow game | ✅ Live |

## API Endpoints
| Route | Auth | Purpose |
|-------|------|---------|
| `POST /api/auth/login` | public | Admin JWT login |
| `POST /api/contact` | public (rate-limited) | Contact form |
| `POST /api/jobs` | public (rate-limited) | Job application + resume |
| `GET /api/projects` | public | Portfolio projects |
| `POST /api/ai/chat` | public (20 req/15min) | Gemini AI proxy |
| `GET /health` | public | Health check |

## Environment Variables
**Backend (.env):** PORT, NODE_ENV, MONGO_URI, JWT_SECRET, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD, FRONTEND_URL, GEMINI_API_KEY

**Frontend (.env.local):** VITE_API_URL (empty in dev), VITE_APPS_SCRIPT_URL (Google Apps Script URL), GEMINI_API_KEY

## Recent Changes Log
- Phase 1: Security audit — bcrypt, rate limiting, HTTPS, Gemini key moved server-side
- Phase 2: Contrast fix (text-muted → text-muted-foreground across 14 files), Preloader redesign, AI chatbot debug, Python icon overlap fix
- Phase 3: Clients marquee, Testimonials carousel, Academy section with courses, StatBar on About, WhatsApp button with SVG, real service modal data, updated site.ts with full contact info
- SEO: BrowserRouter, per-page titles via useSEO hook, sitemap.xml, robots.txt, OG tags
- Deployment: Vercel (frontend) + Render (backend) + Google Apps Script (contact form)
- Removed AiOrb chatbot from frontend entirely — replaced all "Ask AI" buttons with WhatsApp links across Home, Services, Contact, StackArchitect
- WhatsApp floating button is now the sole bottom-right CTA (bigger, proper SVG icon, bottom-6 position)
- Removed AiProvider wrapper from App.tsx, removed AiOrb lazy import
- Bundle size reduced ~130KB (no more react-markdown, @google/genai in frontend)
- Pricing page: Removed entirely
- LinkedIn: Updated to correct company URL
- Email: Updated to info@sinrem.tech (site.ts) and pranit@sinremtech.in (backend .env)
