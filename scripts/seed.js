// ============================================================
// scripts/seed.js — Seed admin + sample data into MongoDB
// Run: npm run seed
// ============================================================

import 'dotenv/config';
import mongoose from 'mongoose';
import Admin    from '../models/Admin.js';
import Project  from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';

// ── Validate seed environment ──────────────────────────────────
const { MONGO_URI, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

if (!MONGO_URI)         { console.error('❌  MONGO_URI is not set in .env'); process.exit(1); }
if (!ADMIN_USERNAME)    { console.error('❌  ADMIN_USERNAME is not set in .env'); process.exit(1); }
if (!ADMIN_PASSWORD)    { console.error('❌  ADMIN_PASSWORD is not set in .env'); process.exit(1); }
if (ADMIN_PASSWORD.length < 12) {
  console.error('❌  ADMIN_PASSWORD must be at least 12 characters');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    // ── Admin ──────────────────────────────────────────────────
    // Force-replace any existing admin so the new bcrypt cost (14) + 12-char
    // minimum are applied cleanly after the security hardening.
    const existing = await Admin.findOne({ username: ADMIN_USERNAME.toLowerCase() });
    if (existing) {
      // Update password → triggers pre-save hash at cost 14
      existing.password = ADMIN_PASSWORD;
      await existing.save();
      console.log(`✅  Admin password refreshed: ${ADMIN_USERNAME}`);
    } else {
      await Admin.create({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD });
      console.log(`✅  Admin created: ${ADMIN_USERNAME}`);
    }

    // ── Sample Projects ────────────────────────────────────────
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title:       'Business Management Dashboard',
          type:        'Web Application',
          description: 'Full-stack internal dashboard for a logistics firm. Features real-time data tables, role-based access control, and PDF report generation.',
          techStack:   ['Django', 'React', 'PostgreSQL'],
          featured:    true,
          order:       0,
        },
        {
          title:       'Field Service Mobile App',
          type:        'Android App',
          description: 'Android app for on-site technicians to log service reports, capture photos, and sync offline data.',
          techStack:   ['Android', 'SQLite', 'REST API'],
          featured:    true,
          order:       1,
        },
        {
          title:       'API Documentation Suite',
          type:        'Technical Writing',
          description: 'Complete API reference, onboarding guide, and integration tutorials for a SaaS product.',
          techStack:   ['Markdown', 'Docusaurus', 'GitHub'],
          featured:    false,
          order:       2,
        },
      ]);
      console.log('✅  3 sample projects created');
    } else {
      console.log('ℹ️   Projects already exist, skipping.');
    }

    // ── Sample Blog Posts ──────────────────────────────────────
    const postCount = await BlogPost.countDocuments();
    if (postCount === 0) {
      await BlogPost.create([
        {
          title:       'How We Build Android Apps That Don\'t Break After Launch',
          excerpt:     'Our approach to Android development focuses on stability, clean architecture, and long-term maintainability.',
          content:     `<h2>The problem with "fast" development</h2>
<p>Many studios rush Android projects to hit a deadline. The result: a technically working app that falls apart within 6 months of real-world usage. We've seen it happen repeatedly with apps handed to us for rescue.</p>
<h2>Our approach</h2>
<p>We start with a thorough discovery phase — understanding not just what you need today, but how the app will need to evolve. This informs architecture decisions that save enormous time later.</p>
<p>We use clean architecture patterns, write meaningful unit tests, and document every non-obvious decision in our code.</p>`,
          category:    'Insights',
          tags:        ['Android', 'Mobile Development', 'Engineering'],
          isPublished: true,
          author:      'SharadChandra TechVentures',
        },
        {
          title:       'Why Good Technical Documentation Reduces Support Costs by 40%',
          excerpt:     'A well-written API reference isn\'t just nice to have — it\'s a direct cost-reduction tool.',
          content:     `<h2>The hidden cost of bad docs</h2>
<p>Every time a developer emails your support team asking "how do I authenticate?" that's money. If your API documentation was clear, they wouldn't need to ask.</p>
<h2>What makes documentation actually useful</h2>
<p>Good documentation is written from the reader's perspective, not the developer's. It assumes no prior knowledge of your internal systems, uses consistent terminology, and includes real examples — not pseudocode.</p>`,
          category:    'Case Study',
          tags:        ['Technical Writing', 'Documentation', 'API'],
          isPublished: false,
          author:      'SharadChandra TechVentures',
        },
      ]);
      console.log('✅  2 sample blog posts created (1 published, 1 draft)');
    } else {
      console.log('ℹ️   Blog posts already exist, skipping.');
    }

    console.log('\n🌱  Seed complete.\n');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
