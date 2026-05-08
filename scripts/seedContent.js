// ============================================================
// scripts/seedContent.js — Seed dynamic content (idempotent)
// Run: npm run seed:content
// ============================================================

import 'dotenv/config';
import mongoose from 'mongoose';
import SiteSettings from '../models/SiteSettings.js';
import Page from '../models/Page.js';
import HomepageSection from '../models/HomepageSection.js';
import Service from '../models/Service.js';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in .env');
  process.exit(1);
}

const pages = [
  {
    slug: 'home',
    title: 'Sinrem Tech | AI-Powered Custom Software & App Development',
    metaDescription: 'Sinrem Tech builds AI-powered custom software, web and mobile apps, cloud systems, and automation workflows to help businesses scale securely and faster.',
    canonicalPath: '/',
    ogImage: 'https://sinremtech.in/og-image.png',
    robots: 'index, follow',
    jsonLdType: 'Organization',
    isPublished: true,
  },
  {
    slug: 'about',
    title: 'About Us | Sinrem Tech',
    metaDescription: 'Meet Sinrem Tech, a product engineering team delivering AI-first software, modern cloud systems, and secure digital platforms for growth-focused businesses.',
    canonicalPath: '/about',
    ogImage: 'https://sinremtech.in/og-image.png',
    robots: 'index, follow',
    jsonLdType: 'WebPage',
    isPublished: true,
  },
  {
    slug: 'services',
    title: 'Services | Sinrem Tech',
    metaDescription: 'Explore Sinrem Tech services across AI automation, custom software, web and mobile development, cloud architecture, and secure integration systems.',
    canonicalPath: '/services',
    ogImage: 'https://sinremtech.in/og-image.png',
    robots: 'index, follow',
    jsonLdType: 'WebPage',
    isPublished: true,
  },
  {
    slug: 'technologies',
    title: 'Technologies We Work With | Sinrem Tech',
    metaDescription: 'See the technology stack Sinrem Tech uses across frontend, backend, mobile, databases, DevOps, and AI/ML to build reliable production systems.',
    canonicalPath: '/technologies',
    ogImage: 'https://sinremtech.in/og-image.png',
    robots: 'index, follow',
    jsonLdType: 'WebPage',
    isPublished: true,
  },
  {
    slug: 'connect',
    title: 'Connect With Us | Sinrem Tech',
    metaDescription: 'Connect with Sinrem Tech for AI-first software, app development, product engineering, and digital transformation partnerships built for scale.',
    canonicalPath: '/connect',
    ogImage: 'https://sinremtech.in/og-image.png',
    robots: 'index, follow',
    jsonLdType: 'WebPage',
    isPublished: true,
  },
  {
    slug: 'blog',
    title: 'Blog | Sinrem Tech',
    metaDescription: 'Read practical insights from Sinrem Tech on AI automation, software architecture, product engineering, and real-world digital execution.',
    canonicalPath: '/blog',
    ogImage: 'https://sinremtech.in/og-image.png',
    robots: 'index, follow',
    jsonLdType: 'Article',
    isPublished: true,
  },
  {
    slug: 'academy',
    title: 'Sinrem Academy | Learn. Build. Grow.',
    metaDescription: 'Sinrem Academy delivers practical learning programs in AI workflows, modern development, and production-ready software execution for teams.',
    canonicalPath: '/academy',
    ogImage: 'https://sinremtech.in/og-image.png',
    robots: 'index, follow',
    jsonLdType: 'WebPage',
    isPublished: true,
  },
];

const services = [
  {
    slug: 'software-engineering',
    title: 'Software Development & Engineering',
    subtitle: 'Custom apps, SaaS platforms, APIs, QA, and AI-first builds.',
    category: 'Engineering',
    modalContent: 'Production-ready software systems for businesses that need speed, security, and maintainability.',
    detailList: [
      'Custom Web Application Development',
      'Mobile App Development (Android & iOS)',
      'SaaS Product Development',
      'API Development & Integration',
      'Software Testing & Quality Assurance',
      'IT Automation Solutions',
      'AI/ML-based Software Solutions',
    ],
    cta: { label: 'Start Project', href: '/connect' },
    sortOrder: 1,
    isPublished: true,
  },
  {
    slug: 'web-digital',
    title: 'Web & Digital Presence',
    subtitle: 'High-performance sites, UI/UX, branding, and ongoing support.',
    category: 'Web',
    modalContent: 'End-to-end digital presence execution from UI design to long-term support.',
    detailList: [
      'Corporate Website Development',
      'E-commerce Development',
      'CMS Development (WordPress, Drupal, Joomla)',
      'Web Hosting & Domain Services',
      'UI/UX Design & Wireframing',
      'Logo & Branding Design',
      'Technical Content Writing',
      'Graphics & Motion Design for Businesses',
      'Landing Page Optimization',
      'Website Maintenance & Support',
    ],
    cta: { label: 'Start Project', href: '/connect' },
    sortOrder: 2,
    isPublished: true,
  },
  {
    slug: 'data-ai',
    title: 'Data & AI Solutions',
    subtitle: 'Dashboards, analytics, prediction, NLP, and computer vision.',
    category: 'AI',
    modalContent: 'AI and data capabilities that convert raw information into action.',
    detailList: [
      'Business Intelligence Dashboards',
      'Data Analytics & Visualization',
      'Predictive Analytics',
      'AI Chatbot Development',
      'Natural Language Processing (NLP) Solutions',
      'Image & Video Recognition AI',
      'Recommendation Engine Development',
    ],
    cta: { label: 'Start Project', href: '/connect' },
    sortOrder: 3,
    isPublished: true,
  },
  {
    slug: 'ops-productivity',
    title: 'Business Operations & Productivity',
    subtitle: 'Systems that improve operational clarity and collaboration.',
    category: 'Operations',
    modalContent: 'Internal systems to streamline teams, operations, and delivery velocity.',
    detailList: [
      'Enterprise Resource Planning (ERP) System',
      'Customer Relationship Management (CRM) Software',
      'Project Management Tools (Trello, Asana, Jira)',
      'Collaboration Tools (Slack, Microsoft Teams)',
      'Office Productivity Suite (Google Workspace, Microsoft 365)',
    ],
    cta: { label: 'Start Project', href: '/connect' },
    sortOrder: 4,
    isPublished: true,
  },
  {
    slug: 'cloud-infra',
    title: 'Cloud & Infrastructure',
    subtitle: 'Cloud hosting, scalable compute, and ongoing maintenance.',
    category: 'Cloud',
    modalContent: 'Reliable cloud setup and operations for high-availability workloads.',
    detailList: [
      'Cloud Hosting (AWS, Azure, GCP)',
      'Scalable Servers & Virtual Machines',
      'IT Support & Maintenance System',
    ],
    cta: { label: 'Start Project', href: '/connect' },
    sortOrder: 5,
    isPublished: true,
  },
  {
    slug: 'payments',
    title: 'Digital Payments & Transactions',
    subtitle: 'Billing, invoicing, accounting and payment gateway integrations.',
    category: 'Payments',
    modalContent: 'Secure payment and finance integrations for smooth business transactions.',
    detailList: [
      'Secure Payment Gateway Integration',
      'Billing & Invoicing Software',
      'Accounting Software Integration (Tally, Zoho Books, QuickBooks)',
    ],
    cta: { label: 'Start Project', href: '/connect' },
    sortOrder: 6,
    isPublished: true,
  },
  {
    slug: 'security',
    title: 'Cybersecurity & Compliance',
    subtitle: 'Security essentials for modern web operations.',
    category: 'Security',
    modalContent: 'Practical security controls and compliance-ready implementation.',
    detailList: [
      'SSL Certificates & Website Security',
      'Endpoint Security (antivirus, anti-malware)',
    ],
    cta: { label: 'Start Project', href: '/connect' },
    sortOrder: 7,
    isPublished: true,
  },
  {
    slug: 'advanced',
    title: 'Advanced Technologies',
    subtitle: 'Optional, scalable acceleration using AI and ML.',
    category: 'R&D',
    modalContent: 'Advanced AI initiatives for personalization, prediction, and automation.',
    detailList: [
      'Artificial Intelligence for customer insights & automation',
      'Machine Learning for recommendations & personalization',
    ],
    cta: { label: 'Start Project', href: '/connect' },
    sortOrder: 8,
    isPublished: true,
  },
];

const homepageSections = [
  { key: 'hero', title: 'Hero', enabled: true, sortOrder: 1, payload: {} },
  { key: 'services', title: 'Services', enabled: true, sortOrder: 2, payload: {} },
  { key: 'products', title: 'Products', enabled: true, sortOrder: 3, payload: {} },
  { key: 'showcase', title: 'Showcase', enabled: true, sortOrder: 4, payload: {} },
  { key: 'featured-work', title: 'Featured Work', enabled: true, sortOrder: 5, payload: {} },
  { key: 'tech-stack', title: 'Tech Stack', enabled: true, sortOrder: 6, payload: {} },
  { key: 'cta', title: 'CTA', enabled: true, sortOrder: 7, payload: {} },
  { key: 'trusted-by', title: 'Trusted By', enabled: true, sortOrder: 8, payload: {} },
  { key: 'testimonials', title: 'Testimonials', enabled: true, sortOrder: 9, payload: {} },
  { key: 'academy', title: 'Academy', enabled: true, sortOrder: 10, payload: {} },
];

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    await SiteSettings.findOneAndUpdate(
      { singletonKey: 'default' },
      {
        $set: {
          singletonKey: 'default',
          siteName: 'Sinrem Tech',
          brandShortName: 'Sinrem',
          logoPrimaryUrl: 'https://sinremtech.in/logo.png',
          email: 'info@sinrem.tech',
          phone: '+91 9503119046',
          whatsapp: '+91 9503119046',
          address: 'Anjali Nagar, Katraj, Pune, MH 411046',
          social: {
            linkedin: 'https://www.linkedin.com/company/sharadchandra-techventures/posts/?feedView=all',
            instagram: 'https://www.instagram.com/sinrem_',
          },
          defaultSeo: {
            ogImage: 'https://sinremtech.in/og-image.png',
            robotsDefault: 'index, follow',
            twitterCard: 'summary_large_image',
          },
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    for (const page of pages) {
      await Page.findOneAndUpdate({ slug: page.slug }, { $set: { ...page, updatedAt: new Date() } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    }

    for (const section of homepageSections) {
      await HomepageSection.findOneAndUpdate(
        { key: section.key },
        { $set: { ...section, updatedAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    for (const service of services) {
      await Service.findOneAndUpdate(
        { slug: service.slug },
        { $set: { ...service, updatedAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('🌱  Content seed complete.');
  } catch (err) {
    console.error('❌  Content seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
