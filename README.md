# sinrem — SharadChandra TechVentures

> Official website for **SharadChandra TechVentures** (sinrem.tech) — a boutique Indian IT services studio.  
> Full-stack monorepo: Express/MongoDB backend + React/TypeScript SPA frontend + Vanilla HTML admin panel.

---

## Tech Stack

| Layer        | Technology                                           |
|--------------|------------------------------------------------------|
| Backend      | Node.js 18+ · Express · MongoDB · Mongoose           |
| Frontend SPA | React 19 · TypeScript · Vite · Tailwind CSS · Framer Motion |
| Vanilla Site | HTML · Vanilla CSS · Vanilla JS (served from root `index.html`) |
| Admin Panel  | Vanilla HTML/CSS/JS (served at `/admin`)             |
| AI Chatbot   | Google Gemini API (server-side proxy via `/api/ai`)  |
| Auth         | JWT (access token 15m + refresh token 7d httpOnly cookie) |
| Email        | Nodemailer · Gmail SMTP · Google Apps Script (Sheets)  |
| File Uploads | Multer · PDF/Word only · 5MB max                     |
| Security     | Helmet · CORS · bcrypt · express-validator · rate limiting |

---

## Data Architecture

**Public-facing content is static — not database-driven.**

All services, products, case studies, and pricing data live in `frontend/lib/content.ts`. The frontend imports directly from this file with no API calls or loading states.

Dynamic data (contact submissions, job applications) still flows through the MongoDB backend via REST API.

| Data Type      | Source                           | How consumed                         |
|----------------|----------------------------------|--------------------------------------|
| Services       | `frontend/lib/content.ts`        | Direct import in `Services.tsx`      |
| Products       | `frontend/lib/content.ts`        | Direct import in `Services.tsx`      |
| Case Studies   | `frontend/lib/content.ts`        | Via `useProjects()` in `lib/api.ts`  |
| Pricing        | `frontend/lib/content.ts`        | Direct import in `Pricing.tsx`       |
| Contact forms  | Google Apps Script → Sheets + Email | POST from `Contact.tsx`              |
| Contact forms  | MongoDB → `/api/contact` (fallback) | POST from `Contact.tsx`              |
| Job apps       | MongoDB → `/api/jobs`            | POST from `Careers.tsx`              |

---

## Project Structure

```
sinrem/
├── server.js                    Express entry point (ESM)
├── package.json                 Backend dependencies + npm scripts
├── nodemon.json                 Watches only .js/.json, ignores frontend/
├── .env                         Your local secrets (never commit)
├── .env.example                 Template — copy to .env and fill in values
├── .gitignore
│
├── config/
│   ├── db.js                    MongoDB connection (Mongoose)
│   ├── email.js                 Nodemailer transporter + sendEmail helper
│   └── logger.js                Winston logger (file + console)
│
├── models/
│   ├── Admin.js                 Admin user (bcrypt password hash)
│   ├── Contact.js               Contact form submissions
│   ├── BlogPost.js              Blog posts (schema kept; not used by frontend)
│   ├── JobApplication.js        Job applications (resume file reference)
│   └── Project.js               Portfolio projects (schema kept; not used by frontend)
│
├── middleware/
│   ├── authMiddleware.js        JWT Bearer token verification
│   ├── globalLimiter.js         Global scraping/bot rate limiter on /api
│   ├── rateLimiter.js           Strict 5 req/15 min on public POST routes
│   ├── loginLimiter.js          Login-specific brute-force protection
│   ├── upload.js                Multer: PDF/Word only, 5MB max
│   ├── validate.js              express-validator error extractor
│   └── validateId.js            MongoDB ObjectId format guard
│
├── controllers/
│   ├── authController.js        Login → JWT issuance + refresh token
│   ├── contactController.js     Contact form + email notifications
│   ├── blogController.js        Blog CRUD (admin writes only; frontend uses static data)
│   ├── jobController.js         Job applications + email + resume cleanup
│   ├── projectController.js     Portfolio CRUD (admin writes only; frontend uses static data)
│   ├── aiController.js          Gemini AI chat proxy (keeps API key server-side)
│   └── aiKnowledge.js           Static knowledge base fed to the AI
│
├── routes/
│   ├── auth.js                  POST /api/auth/login
│   ├── contact.js               /api/contact
│   ├── blog.js                  /api/blog
│   ├── jobs.js                  /api/jobs
│   ├── projects.js              /api/projects
│   └── ai.js                    POST /api/ai/chat
│
├── scripts/
│   ├── seed.js                  Seeds: admin user only (blog posts & projects are static)
│   └── google-apps-script.js    Google Apps Script for contact form → Sheets + email
│
├── uploads/                     Auto-created. Resume files. Gitignored.
├── logs/                        Auto-created. Winston log files. Gitignored.
│
├── assets/                      Used by root index.html (vanilla site)
│   ├── css/ (20 files)          reset · variables · typography · layout · components
│   │                            navbar · hero · shapegrid · marquee · services
│   │                            whyus · process · techstack · projects · testimonials
│   │                            about · contact · footer · animations · responsive
│   └── js/ (7 files)            main · navbar · mobile-menu · counter
│                                reveal · scroll-progress · shapegrid
│
├── index.html                   Vanilla single-page website (root, served by Express)
│
├── admin/                       Admin panel (served at /admin by Express)
│   ├── index.html               Login page
│   ├── dashboard.html
│   ├── messages.html            Contact form submissions
│   ├── applications.html        Job applications
│   ├── blog.html                Split-panel blog editor
│   ├── projects.html            Drag-and-drop project reorder
│   └── assets/ (css/ + js/)
│
└── frontend/                    React SPA (built output served by Express at /)
    ├── App.tsx                  Router + layout (Header, Footer, AiOrb)
    ├── index.tsx                React 19 entry point
    ├── index.css                Tailwind base + custom tokens
    ├── index.html               Vite HTML shell
    ├── vite.config.ts           Dev server port 3000, proxies /api → :5001
    ├── tailwind.config.js
    ├── postcss.config.cjs
    ├── tsconfig.json
    ├── package.json             Frontend-only deps + dev/build scripts
    ├── .env.local               Frontend env vars (VITE_API_URL, GEMINI_API_KEY)
    │
    ├── pages/
    │   ├── Home.tsx             Landing page (hero, services, case studies, contact)
    │   ├── Services.tsx
    │   ├── CaseStudies.tsx
    │   ├── CaseStudyDetail.tsx
    │   ├── About.tsx
    │   ├── Pricing.tsx
    │   ├── Contact.tsx
    │   ├── Careers.tsx
    │   ├── Login.tsx
    │   ├── Dashboard.tsx        Admin dashboard inside the SPA
    │   ├── NotFound.tsx
    │   ├── tools/
    │   │   ├── StackArchitect.tsx
    │   │   └── RoiCalculator.tsx
    │   └── games/
    │       └── PacketFlow.tsx
    │
    ├── components/
    │   ├── site/
    │   │   ├── Header.tsx       Top navigation bar
    │   │   ├── Footer.tsx
    │   │   └── AiOrb.tsx        Floating Gemini AI chatbot widget
    │   ├── ui/
    │   │   ├── MagicBento.jsx   Animated bento grid (Framer Motion)
    │   │   ├── MagicBento.css   Styles for MagicBento
    │   │   ├── ShapeGrid.jsx    Canvas animated background
    │   │   ├── ShapeGrid.css    Styles for ShapeGrid
    │   │   ├── Preloader.tsx    Full-screen intro animation
    │   │   ├── Logo.tsx
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Container.tsx
    │   │   ├── SectionHeading.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   ├── TechIcons.tsx
    │   │   └── HorizontalScrollShowcase.tsx
    │   ├── animated/
    │   │   ├── AmbientGrid.tsx
    │   │   ├── HeroSignal.tsx
    │   │   ├── InteractiveMesh.tsx
    │   │   ├── ProjectVisuals.tsx
    │   │   └── WaveDivider.tsx
    │   └── motion/
    │       ├── FadeIn.tsx
    │       └── Stagger.tsx
    │
    ├── context/
    │   ├── ThemeContext.tsx      Dark / light mode global state
    │   └── AiContext.tsx        AI chatbot open/close state
    │
    ├── lib/
    │   ├── apiBase.ts           VITE_API_URL resolver (dev proxy vs. production URL)
    │   ├── api.ts               useProjects() — returns static caseStudies (no API call)
    │   ├── content.ts           ★ Single source of truth for all public content
    │   │                        (serviceCategories, products, caseStudies, pricing)
    │   ├── knowledge.ts         AI context knowledge base
    │   ├── site.ts              Site metadata constants
    │   └── cn.ts                clsx + tailwind-merge utility
    │
    ├── public/
    │   └── logo.svg
    └── dist/                    Built output (generated by `npm run build`)
```

---

## Prerequisites

- **Node.js** ≥ 18.0.0
- **MongoDB** running locally (`mongod`) — or a MongoDB Atlas cluster URI
- **npm** ≥ 9
- A **Gmail account** with [App Password](https://myaccount.google.com/apppasswords) enabled
- A **Google Gemini API key** from [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

## Setup from Scratch

### 1. Clone and install backend dependencies

```bash
git clone <repo-url> sinrem
cd sinrem
npm install
```

### 2. Configure the backend environment

```bash
cp .env.example .env
```

Open `.env` and fill in every value:

| Variable | Description |
|---|---|
| `PORT` | Backend port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/sinrem` locally, or your Atlas URI |
| `JWT_SECRET` | Min 32 chars. Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Access token TTL (default `15m`) |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token TTL (default `7d`) |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | Your Gmail address |
| `EMAIL_PASS` | Your Gmail **App Password** (16 chars, not your real password) |
| `ADMIN_EMAIL` | Who receives contact form + job application emails |
| `ADMIN_USERNAME` | Username for the seeded admin account |
| `ADMIN_PASSWORD` | Password ≥12 chars, mixed case + special character |
| `FRONTEND_URL` | `http://localhost:5000` in dev, `https://sinrem.tech` in prod |
| `GEMINI_API_KEY` | From [aistudio.google.com](https://aistudio.google.com/app/apikey) |

### 3. Seed the database

Creates the admin user (blog posts and projects are static — no seeding needed):

```bash
npm run seed
```

> Run this only once. Re-running it will refresh the admin password if the username already exists.

### 4. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 5. Configure the frontend environment

```bash
# frontend/.env.local already exists — edit it:
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Leave **empty** in development (Vite proxy handles it). Set to backend URL in production (e.g. `https://sinrem-backend.onrender.com`). |
| `VITE_APPS_SCRIPT_URL` | Google Apps Script Web App URL for contact form → Google Sheets + email notification. |
| `GEMINI_API_KEY` | Same key as backend — used for client-side Gemini calls inside the AI widget. |

---

## Running in Development

The project uses **two terminal processes** in development:

### Terminal 1 — Backend (Express + MongoDB)

```bash
# from project root
npm run dev
```

Starts the backend on **http://localhost:5000** with `nodemon`.

### Terminal 2 — Frontend (Vite Dev Server)

```bash
cd frontend
npm run dev
```

Starts the React SPA on **http://localhost:3000**.  
Vite automatically proxies all `/api/*` requests to `http://localhost:5000`.

> **Note:** The Vite proxy target is `localhost:5000`. If your backend runs on a different port, update `target` in `frontend/vite.config.ts` to match.

### URLs in Development

| URL | What it serves |
|---|---|
| `http://localhost:3000` | React SPA (Vite hot-reload) |
| `http://localhost:5000` | Express backend + vanilla `index.html` + admin |
| `http://localhost:5000/admin` | Admin panel |
| `http://localhost:5000/api/*` | REST API |

---

## Building for Production

Build the React SPA into `frontend/dist/` — Express will serve this:

```bash
cd frontend
npm run build
cd ..
```

Then start the production server:

```bash
NODE_ENV=production npm start
```

Express serves:
- `frontend/dist/` as the SPA (with SPA fallback for client-side routing)
- `admin/` at `/admin`
- `index.html` (root vanilla page) at the root static path
- All `/api/*` routes

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | public | Admin login → returns JWT access token + sets refresh cookie |

### Contact

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/contact` | public (rate-limited) | Submit contact form |
| GET | `/api/contact` | admin | List all contact messages |
| PATCH | `/api/contact/:id/read` | admin | Mark message as read |
| DELETE | `/api/contact/:id` | admin | Delete message |

### Blog

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/blog` | public | Get all published posts |
| GET | `/api/blog/:slug` | public | Get single published post by slug |
| GET | `/api/blog/admin/all` | admin | Get all posts including drafts |
| POST | `/api/blog` | admin | Create blog post |
| PUT | `/api/blog/:id` | admin | Update blog post |
| DELETE | `/api/blog/:id` | admin | Delete blog post |

> **Note:** The public frontend does not consume `/api/blog`. These endpoints are available for admin use only.

### Jobs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/jobs` | public (rate-limited, multipart/form-data) | Submit job application + resume |
| GET | `/api/jobs` | admin | List all applications |
| PATCH | `/api/jobs/:id/status` | admin | Update application status |
| PATCH | `/api/jobs/:id/read` | admin | Mark application as read |
| DELETE | `/api/jobs/:id` | admin | Delete application + resume file |

### Projects

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/projects` | public | Get all projects |
| POST | `/api/projects` | admin | Create project |
| PUT | `/api/projects/:id` | admin | Update project |
| DELETE | `/api/projects/:id` | admin | Delete project |
| PUT | `/api/projects/reorder` | admin | Reorder by ID array |

> **Note:** The public frontend does not consume `/api/projects`. Case studies are served from `frontend/lib/content.ts`.

### AI Chatbot

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/chat` | public (rate-limited: 20/15 min) | Proxy user message to Gemini |

> The Gemini API key is **never exposed** to the browser. All AI calls go through this server-side proxy.

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | public | Returns `{ status: "ok" }` — for load balancers / uptime monitors |

---

## Security Architecture

| Feature | Implementation |
|---|---|
| **Security Headers** | Helmet with strict CSP, `frameAncestors: 'none'`, HSTS in production |
| **CORS** | Origin whitelist from `FRONTEND_URL` env var |
| **Rate Limiting** | Global bot limiter on all `/api` + strict limiters on public POST routes + login brute-force guard |
| **Authentication** | JWT access tokens (15m) + httpOnly refresh cookie (7d) |
| **Password Hashing** | bcrypt with 12 salt rounds |
| **Input Validation** | express-validator on all public inputs |
| **File Uploads** | Multer: PDF/Word MIME type whitelist + 5MB size cap |
| **HTTPS Enforcement** | Auto-redirect HTTP → HTTPS in production (trust proxy enabled) |
| **ID Validation** | MongoDB ObjectId format checked before any DB query |
| **Logging** | Winston: daily rotating log files + API audit trail |

---

## Deployment

### Frontend → Vercel

The React SPA is deployed to Vercel as a static site.

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Set **Framework Preset** to `Vite`
4. Set **Build Command** to `npm run build`
5. Set **Output Directory** to `dist`
6. Add environment variables:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://sinrem-backend.onrender.com`)
   - `VITE_APPS_SCRIPT_URL` = your Google Apps Script Web App URL
7. Deploy

The `frontend/vercel.json` handles SPA routing (all paths → `index.html`).

### Backend → Render

The Express + MongoDB backend is deployed to Render as a Web Service.

1. Create a **Web Service** on [render.com](https://render.com)
2. Connect the GitHub repo
3. Set **Root Directory** to blank (repo root)
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add all environment variables from `.env.example`:
   - `NODE_ENV=production`
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
   - `ADMIN_EMAIL`, `GEMINI_API_KEY`
   - `FRONTEND_URL` = your Vercel frontend URL
7. Deploy

### Contact Form → Google Apps Script

The contact form can submit directly to Google Sheets + send email notifications without the backend.

1. Create a Google Sheet with headers: `Timestamp | Name | Email | Subject | Message | Status`
2. Open **Extensions → Apps Script** and paste the code from `scripts/google-apps-script.js`
3. Deploy as **Web App** (Execute as: Me, Access: Anyone)
4. Copy the Web App URL and set it as `VITE_APPS_SCRIPT_URL` in Vercel env vars

### MongoDB Atlas

Your backend requires a cloud MongoDB instance:

1. Create a free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user
3. Under **Network Access** → Add `0.0.0.0/0` (allow all)
4. Get the connection string and set it as `MONGO_URI` on Render

> **Never commit `.env`** — use hosting platform environment variable UIs for secrets.

---

## Database Collections

| Collection | Purpose |
|---|---|
| `admins` | Admin user accounts (bcrypt hashed passwords) |
| `contacts` | Contact form submissions |
| `jobapplications` | Job applications with resume file path and status |
| `blogposts` | Schema present; populated via admin panel only |
| `projects` | Schema present; populated via admin panel only |

> **Note:** `blogposts` and `projects` are not consumed by the public frontend. All public content is served statically from `frontend/lib/content.ts`.

---

© 2025 SharadChandra TechVentures · Built with care in India 🇮🇳
