# sinrem — SharadChandra TechVentures

> Official website for SharadChandra TechVentures (sinrem.tech) — a boutique Indian IT services company.

---

## Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | Vanilla HTML, CSS, JS   |
| Backend  | Node.js 18+ + Express   |
| Database | MongoDB + Mongoose      |
| Email    | Nodemailer (Gmail SMTP) |
| Auth     | JWT                     |
| Uploads  | Multer                  |

---

## Project Structure

```
sinrem/
├── server.js                    Express app entry point
├── package.json
├── .env.example                 Copy to .env and fill in values
├── .gitignore
│
├── config/
│   ├── db.js                    MongoDB connection
│   └── email.js                 Nodemailer transporter + sendEmail helper
│
├── models/
│   ├── Admin.js                 Admin user (bcrypt password)
│   ├── Contact.js               Contact form submissions
│   ├── BlogPost.js              Blog posts (with auto-slug, read-time)
│   ├── JobApplication.js        Job applications (with resume file ref)
│   └── Project.js               Portfolio projects (with ordering)
│
├── middleware/
│   ├── authMiddleware.js        JWT bearer token verification
│   ├── rateLimiter.js           5 requests/15min per IP on public forms
│   ├── upload.js                Multer: PDF/Word only, max 5MB
│   └── validate.js              express-validator result extractor
│
├── controllers/
│   ├── authController.js        Login → JWT issuance
│   ├── contactController.js     Contact form + HTML email notifications
│   ├── blogController.js        Blog CRUD (public + admin)
│   ├── jobController.js         Job applications + email + resume cleanup
│   └── projectController.js    Portfolio CRUD + reorder
│
├── routes/
│   ├── auth.js                  POST /api/auth/login
│   ├── contact.js               POST /api/contact  (public, rate-limited)
│   │                            GET/PATCH/DELETE /api/contact/* (admin)
│   ├── blog.js                  GET /api/blog  (public)
│   │                            POST/PUT/DELETE /api/blog/* (admin)
│   ├── jobs.js                  POST /api/jobs  (public, rate-limited, multipart)
│   │                            GET/PATCH/DELETE /api/jobs/* (admin)
│   └── projects.js              GET /api/projects  (public)
│                                POST/PUT/DELETE /api/projects/* (admin)
│
├── scripts/
│   └── seed.js                  Seed DB: admin + sample projects + blog posts
│
├── uploads/                     Auto-created. Stores resume files. Gitignored.
│
├── frontend/                    Public website (served as static)
│   ├── index.html
│   └── assets/
│       ├── css/ (21 files)
│       └── js/ (9 files incl. contact-form, jobs-form, blog)
│
└── admin/                       Admin panel (served at /admin)
    ├── index.html               Login page
    ├── dashboard.html
    ├── messages.html
    ├── applications.html
    ├── blog.html                Split-panel editor
    ├── projects.html            Drag-and-drop reorder
    └── assets/
        ├── css/ (9 files)
        └── js/ (7 files)
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your real values:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — a long random secret (use `openssl rand -hex 64`)
- `EMAIL_USER` / `EMAIL_PASS` — Gmail address + [App Password](https://myaccount.google.com/apppasswords)
- `ADMIN_EMAIL` — where to receive contact/application notifications
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — credentials for the initial admin account

### 3. Seed the database

Creates the initial admin user and sample projects/blog posts:

```bash
npm run seed
```

### 4. Run the development server

```bash
npm run dev
```

Visit:
- **Website**: http://localhost:5000
- **Admin panel**: http://localhost:5000/admin

---

## API Reference

| Method | Endpoint                    | Auth     | Description                         |
|--------|-----------------------------|----------|-------------------------------------|
| POST   | `/api/auth/login`           | public   | Admin login → returns JWT           |
| POST   | `/api/contact`              | public   | Submit contact form (rate-limited)  |
| GET    | `/api/contact`              | admin    | List all contact messages           |
| PATCH  | `/api/contact/:id/read`     | admin    | Mark message as read                |
| DELETE | `/api/contact/:id`          | admin    | Delete message                      |
| GET    | `/api/blog`                 | public   | Get published posts                 |
| GET    | `/api/blog/:slug`           | public   | Get single published post           |
| GET    | `/api/blog/admin/all`       | admin    | Get all posts including drafts      |
| POST   | `/api/blog`                 | admin    | Create blog post                    |
| PUT    | `/api/blog/:id`             | admin    | Update blog post                    |
| DELETE | `/api/blog/:id`             | admin    | Delete blog post                    |
| POST   | `/api/jobs`                 | public   | Submit job application + resume     |
| GET    | `/api/jobs`                 | admin    | List applications                   |
| PATCH  | `/api/jobs/:id/status`      | admin    | Update application status           |
| PATCH  | `/api/jobs/:id/read`        | admin    | Mark application as read            |
| DELETE | `/api/jobs/:id`             | admin    | Delete application + resume file    |
| GET    | `/api/projects`             | public   | Get all projects                    |
| POST   | `/api/projects`             | admin    | Create project                      |
| PUT    | `/api/projects/:id`         | admin    | Update project                      |
| DELETE | `/api/projects/:id`         | admin    | Delete project                      |
| PUT    | `/api/projects/reorder`     | admin    | Reorder projects by ID array        |

---

## Security

- **Helmet** — sets 14 security response headers
- **CORS** — origin whitelist from `FRONTEND_URL` env var
- **Rate Limiting** — 5 requests per 15 min on public POST routes
- **JWT** — all admin operations require valid Bearer token
- **bcrypt** — passwords hashed with 12 salt rounds
- **Multer** — file type whitelist (PDF/Word only), 5MB size limit
- **express-validator** — all public inputs validated server-side
- **`.gitignore`** — `.env` and `uploads/` excluded from commits

---

## Deployment Notes

1. Set `NODE_ENV=production` in your hosting environment
2. Use a MongoDB Atlas cluster (not localhost)
3. Use a Gmail App Password, not your real password
4. Point a custom domain at your server and enable HTTPS (Let's Encrypt)
5. Add `FRONTEND_URL=https://sinrem.tech` to your production env vars
6. **Never commit `.env`** — use your host's secret/env management UI

---

© 2025 SharadChandra TechVentures
