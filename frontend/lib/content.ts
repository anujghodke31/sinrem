export type ServiceCategory = {
  id: string;
  title: string;
  subtitle: string;
  items: string[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "software-engineering",
    title: "Software Development & Engineering",
    subtitle: "Custom apps, SaaS platforms, APIs, QA, and AI-first builds.",
    items: [
      "Custom Web Application Development",
      "Mobile App Development (Android & iOS)",
      "SaaS Product Development",
      "API Development & Integration",
      "Software Testing & Quality Assurance",
      "IT Automation Solutions",
      "AI/ML-based Software Solutions",
    ],
  },
  {
    id: "web-digital",
    title: "Web & Digital Presence",
    subtitle: "High-performance sites, UI/UX, branding, and ongoing support.",
    items: [
      "Corporate Website Development",
      "E-commerce Development",
      "CMS Development (WordPress, Drupal, Joomla)",
      "Web Hosting & Domain Services",
      "UI/UX Design & Wireframing",
      "Logo & Branding Design",
      "Technical Content Writing",
      "Graphics & Motion Design for Businesses",
      "Landing Page Optimization",
      "Website Maintenance & Support",
    ],
  },
  {
    id: "data-ai",
    title: "Data & AI Solutions",
    subtitle: "Dashboards, analytics, prediction, NLP, and computer vision.",
    items: [
      "Business Intelligence Dashboards",
      "Data Analytics & Visualization",
      "Predictive Analytics",
      "AI Chatbot Development",
      "Natural Language Processing (NLP) Solutions",
      "Image & Video Recognition AI",
      "Recommendation Engine Development",
    ],
  },
  {
    id: "ops-productivity",
    title: "Business Operations & Productivity",
    subtitle: "Systems that improve operational clarity and collaboration.",
    items: [
      "Enterprise Resource Planning (ERP) System",
      "Customer Relationship Management (CRM) Software",
      "Project Management Tools (Trello, Asana, Jira)",
      "Collaboration Tools (Slack, Microsoft Teams)",
      "Office Productivity Suite (Google Workspace, Microsoft 365)",
    ],
  },
  {
    id: "cloud-infra",
    title: "Cloud & Infrastructure",
    subtitle: "Cloud hosting, scalable compute, and ongoing maintenance.",
    items: [
      "Cloud Hosting (AWS, Azure, GCP)",
      "Scalable Servers & Virtual Machines",
      "IT Support & Maintenance System",
    ],
  },
  {
    id: "payments",
    title: "Digital Payments & Transactions",
    subtitle: "Billing, invoicing, accounting and payment gateway integrations.",
    items: [
      "Secure Payment Gateway Integration",
      "Billing & Invoicing Software",
      "Accounting Software Integration (Tally, Zoho Books, QuickBooks)",
    ],
  },
  {
    id: "security",
    title: "Cybersecurity & Compliance",
    subtitle: "Security essentials for modern web operations.",
    items: [
      "SSL Certificates & Website Security",
      "Endpoint Security (antivirus, anti-malware)",
    ],
  },
  {
    id: "advanced",
    title: "Advanced Technologies",
    subtitle: "Optional, scalable acceleration using AI and ML.",
    items: [
      "Artificial Intelligence for customer insights & automation",
      "Machine Learning for recommendations & personalization",
    ],
  },
];

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  features: string[];
  status: string;
  accent: string;
};

export const products: Product[] = [
  {
    slug: "dhruv-ai",
    name: "Dhruv AI",
    tagline: "Your always-on AI Receptionist.",
    description:
      "Dhruv AI is an intelligent AI receptionist that handles inbound calls, schedules appointments, answers FAQs, and routes queries — 24/7, without human intervention. Built for businesses that can't afford to miss a single lead.",
    category: "AI / Conversational",
    features: [
      "24/7 inbound call handling",
      "Appointment scheduling & reminders",
      "Natural language FAQ responses",
      "Smart call routing & escalation",
      "Multi-language support",
      "CRM integration ready",
    ],
    status: "In Development",
    accent: "#00E599",
  },
  {
    slug: "novus-academia",
    name: "NOVUS Academia",
    tagline: "AI-integrated ERP built on European standards.",
    description:
      "NOVUS Academia is a next-generation AI-powered ERP system designed specifically for educational institutions. Built on European standards and technology, it unifies admissions, academics, finance, HR, and compliance into a single intelligent platform.",
    category: "ERP / EdTech",
    features: [
      "AI-driven admissions & enrollment",
      "Academic planning & timetabling",
      "Finance, fees & payroll management",
      "HR & staff lifecycle management",
      "GDPR & European compliance built-in",
      "Real-time analytics dashboard",
    ],
    status: "In Development",
    accent: "#4FC3FF",
  },
];

export type CaseStudy = {
  slug: string;
  company: string;
  title: string;
  challenge: string;
  solution: string[];
  impact: string[];
  testimonial: string;
  attribution: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "shree-metal-industries",
    company: "Shree Metal Industries",
    title: "Establishing a Digital Foundation for Long-Term Growth",
    challenge:
      "Modernize brand image with a professional, reliable digital presence, including a high-performing corporate website and secure branded email infrastructure.",
    solution: [
      "Designed and developed a comprehensive corporate website and secure email accounts within a two-month timeframe.",
      "Produced promotional product videos at a cost-effective rate.",
      "Provided 24/7 technical support for three years with proactive maintenance.",
    ],
    impact: [
      "Immediate credibility through new website and emails.",
      "High-value marketing assets through product videos.",
      "Uninterrupted operation via 24/7 support.",
    ],
    testimonial:
      "Switching to this team was the best decision for our digital needs... The 24/7 support is invaluable, and they always deliver high-quality content... Three years later, we still count on them.",
    attribution: "Senior Management, Shree Metal Industries",
  },
  {
    slug: "cvk-engineers",
    company: "CVK Engineers",
    title: "Delivering a Professional Digital Portfolio on a Tight Deadline",
    challenge:
      "Launch a polished, trustworthy website and portfolio urgently to support a critical project bid, with professional email infrastructure.",
    solution: [
      "Developed a complete website and digital portfolio within 15 days.",
      "Absorbed costs associated with the expedited schedule.",
      "Integrated a sophisticated portfolio section and professional corporate emails.",
      "Offered 24/7 technical support and two years of free website maintenance.",
    ],
    impact: [
      "Elevated client pitching with professional presentation of complex work.",
      "Operational confidence with a fast-loading platform.",
      "Worry-free ownership due to extended maintenance.",
    ],
    testimonial:
      "We were under a massive time crunch, but the team delivered a beautiful, informative website and portfolio in just two weeks... Knowing we also have 24/7 support and two years of free maintenance is incredible value.",
    attribution: "Management Team, CVK Engineers",
  },
  {
    slug: "c4i4-technical-manual",
    company: "C4i4 - Center for Industry 4.0",
    title: "Standardizing Complex AI/Data Science Software with Expert Technical Documentation",
    challenge:
      "Consolidate sophisticated, proprietary AI/web/data science architecture into a single comprehensive reference to improve knowledge transfer.",
    solution: [
      "Completed deep-dive training on Industry 4.0 principles and proprietary software.",
      "Authored an 89-page technical manual over three months.",
      "Covered workflow mapping, full-stack architecture, database schemas, and complex query logic.",
    ],
    impact: [
      "Knowledge standardization replacing fragmented knowledge.",
      "Operational clarity for precise maintenance and upgrades.",
      "Demonstrated ability to absorb complex systems quickly.",
    ],
    testimonial:
      "The technical manual they produced is exceptional... they captured all of it in a clear, 89-page guide. Their team's commitment to understanding Industry 4.0 first was key to the quality.",
    attribution: "Project Head, C4i4",
  },
  {
    slug: "house-of-amrth-visuals",
    company: "House of Amrth",
    title: "Capturing Organic Freshness: High-Impact Product Photography & Video",
    challenge:
      "Create compelling premium visual assets for an organic juice line across print and digital channels.",
    solution: [
      "Executed a two-day dedicated shoot for staging and lighting.",
      "Used high-resolution DSLR and dedicated video cameras.",
      "Deployed a three-member crew (photographers and editor).",
      "Delivered premium color grading with Lightroom Premium.",
    ],
    impact: [
      "Multi-channel utility across website, print catalogue, and Instagram.",
      "Authentic representation of freshness and quality.",
      "High client satisfaction.",
    ],
    testimonial:
      "The team captured the genuine freshness of our organic juices perfectly... The level of detail achieved with the professional camera and Lightroom editing really elevates our brand.",
    attribution: "CEO, House of Amrth",
  },
];


// ── Clients ───────────────────────────────────────────────────
export const clients = [
  { name: 'Aadya Exim', logo: '/clients/aadya-exim.svg', url: '#' },
  { name: 'Entrelogy Business School', logo: '/clients/entrelogy.svg', url: '#' },
  { name: 'CVK Engineers', logo: '/clients/cvk-engineers.svg', url: '#' },
  { name: 'Malhar Powertronics', logo: '/clients/malhar-powertronics.svg', url: '#' },
  { name: 'Shree Metal Industries', logo: '/clients/shree-metal.svg', url: '#' },
  { name: 'C4i4 – Center for Industry 4.0', logo: '/clients/c4i4.svg', url: '#' },
  { name: 'House of Amrth', logo: '/clients/house-of-amrth.svg', url: '#' },
];

// ── Testimonials ──────────────────────────────────────────────
export const testimonials = [
  {
    name: 'Senior Management',
    role: 'Shree Metal Industries',
    avatar: '/testimonials/shree-metal.jpg',
    quote: 'Switching to this team was the best decision for our digital needs. They became a reliable partner. The 24/7 support is invaluable, and they always deliver high-quality content without the huge agency price tag. Three years later, we still count on them.',
    rating: 5,
    company: 'Shree Metal Industries',
    companyLogo: '/clients/shree-metal.svg',
    projectTag: 'Website + Email + Video Production',
  },
  {
    name: 'Management Team',
    role: 'CVK Engineers',
    avatar: '/testimonials/cvk-engineers.jpg',
    quote: 'We were under a massive time crunch, but the team delivered a beautiful, informative website and portfolio in just two weeks, exactly as promised. Knowing we also have 24/7 support and two years of free maintenance is incredible value.',
    rating: 5,
    company: 'CVK Engineers',
    companyLogo: '/clients/cvk-engineers.svg',
    projectTag: '15-Day Rapid Deployment',
  },
  {
    name: 'Project Head',
    role: 'C4i4 – Center for Industry 4.0',
    avatar: '/testimonials/c4i4.jpg',
    quote: 'The technical manual they produced is exceptional. Our software has many moving parts — AI, databases, web components — and they captured all of it in a clear, 89-page guide. This document is now the backbone of our technical training.',
    rating: 5,
    company: 'C4i4',
    companyLogo: '/clients/c4i4.svg',
    projectTag: 'AI/Data Science Documentation',
  },
  {
    name: 'CEO',
    role: 'House of Amrth',
    avatar: '/testimonials/house-of-amrth.jpg',
    quote: 'The two-day shoot was incredibly productive. The team captured the genuine freshness of our organic juices perfectly. The professional camera and Lightroom editing really elevates our brand. We could not be happier with the results.',
    rating: 5,
    company: 'House of Amrth',
    companyLogo: '/clients/house-of-amrth.svg',
    projectTag: 'Product Photography & Video',
  },
];

// ── Tech Stack ────────────────────────────────────────────────
export const techStack = [
  {
    category: 'Web Development',
    techs: [
      { name: 'MongoDB' }, { name: 'Express' }, { name: 'React' },
      { name: 'Node.js' }, { name: 'Next.js' }, { name: 'TypeScript' },
      { name: 'Tailwind CSS' }, { name: 'WordPress' },
    ],
  },
  {
    category: 'AI & Data',
    techs: [
      { name: 'Google Gemini' }, { name: 'OpenAI' }, { name: 'Python' },
      { name: 'TensorFlow' }, { name: 'LangChain' }, { name: 'Hugging Face' },
    ],
  },
  {
    category: 'Mobile & APIs',
    techs: [
      { name: 'Android Studio' }, { name: 'WhatsApp API' },
      { name: 'REST APIs' }, { name: 'Firebase' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    techs: [
      { name: 'AWS' }, { name: 'Azure' }, { name: 'Google Cloud' },
      { name: 'Docker' }, { name: 'GitHub Actions' },
    ],
  },
  {
    category: 'Business Tools',
    techs: [
      { name: 'Google Workspace' }, { name: 'Zoho' },
      { name: 'Slack' }, { name: 'Jira' },
    ],
  },
];

// ── Academy ───────────────────────────────────────────────────
export const academy = {
  tagline: 'Learn. Build. Launch.',
  headline: 'Sinrem Trainings',
  description: 'Hands-on courses in AI, design thinking, and business automation — built for students, founders, and professionals who want to build real things.',
  features: [
    'Live cohort-based programs',
    'Real-world project curriculum',
    'Mentorship from industry practitioners',
    'Lifetime access to Sinrem Education Community',
  ],
  ctaLabel: 'Register Now',
  ctaHref: '/academy',
  courses: [
    {
      title: 'Design Thinking',
      duration: '1 Day',
      price: 299,
      originalPrice: 599,
      description: 'Learn how to start your business while still in college. From empathizing to launching.',
      highlights: ['Empathy mapping & ideation', 'Prototype and test your idea', 'Sinrem Education Community membership'],
    },
    {
      title: 'AI Foundation Training',
      duration: '2 Days',
      price: 499,
      originalPrice: 999,
      description: 'Learn the exact working of AI and how to apply it. Hands-on with 20+ AI tools.',
      highlights: ['How AI and LLMs work', 'Hands-on with 20 AI tools', 'Build your own AI chatbot'],
    },
    {
      title: 'Build Your Business Using AI',
      duration: '3 Days',
      price: 999,
      originalPrice: 1999,
      description: 'Learn to build and automate your entire business using AI tools.',
      highlights: ['AI tools for every function', 'Automate marketing & ops', 'Launch by Day 3'],
    },
  ],
};

// ── About Stats ───────────────────────────────────────────────
export const aboutStats = [
  { value: '100%', label: 'Recurring Clients' },
  { value: '20+', label: 'Clients Served' },
  { value: '2+', label: 'Years in Business' },
  { value: '3', label: 'Service Verticals' },
];

export const companyTimeline = [
  { date: 'April 2023', milestone: 'Founded', detail: 'Registered Sharadchandra TechVentures with a focus on web development.' },
  { date: 'December 2023', milestone: 'Expanded Services', detail: 'Launched mobile app development, technical writing, e-commerce, and software maintenance.' },
  { date: 'April 2024', milestone: 'Research Phase', detail: 'Added market research services to help businesses validate new product ideas.' },
  { date: 'December 2024', milestone: 'Sinrem Events', detail: 'Launched hackathons and networking events under the Sinrem Events vertical.' },
  { date: 'April 2025', milestone: 'WhatsApp Business API', detail: 'Launched WhatsApp Business API integration services alongside product photography.' },
  { date: 'December 2025', milestone: 'AI Services + Sinrem Trainings', detail: 'Officially launched AI/ML service offerings and the Sinrem Trainings education vertical.' },
];

export const companyMission = 'To make India digital — helping businesses build their online presence and build automated software systems for growth.';
