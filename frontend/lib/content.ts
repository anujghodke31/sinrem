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

export type PricingTier = {
  name: string;
  price: string;
  features: string[];
  cta: string;
  params: string;
};

export type PricingGroup = {
  id: string;
  title: string;
  subtitle: string;
  tiers: PricingTier[];
  notes?: string[];
};

export const pricing: PricingGroup[] = [
  {
    id: "static",
    title: "Static Website Packages",
    subtitle: "Fast, clean, professional presence with core integrations.",
    tiers: [
      {
        name: "Silver",
        price: "₹4,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Gallery, Contact Us",
          "Email + WhatsApp + Google Map integration",
          "Domain (1 year)",
          "Hosting (1 year)",
        ],
        cta: "Choose Silver",
        params: "static-silver",
      },
      {
        name: "Gold",
        price: "₹6,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Gallery, Contact Us",
          "Email + WhatsApp + Google Map integration",
          "Domain (1 year)",
          "Hosting (1 year)",
        ],
        cta: "Choose Gold",
        params: "static-gold",
      },
      {
        name: "Platinum",
        price: "₹9,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Gallery, Contact Us",
          "Email + WhatsApp + Google Map integration",
          "Domain (1 year)",
          "Hosting (1 year)",
          "1 year maintenance",
          "100 professional webmails (1GB per email)",
        ],
        cta: "Choose Platinum",
        params: "static-platinum",
      },
    ],
    notes: [
      "Rent option: First time payment ₹1000 + domain cost; then ₹500 rent.",
    ],
  },
  {
    id: "wp-ecom",
    title: "E-commerce WordPress Packages",
    subtitle: "Quick launch with store features, blog, and payment integration.",
    tiers: [
      {
        name: "Silver",
        price: "₹9,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Purchase + Add to cart, Contact Us, Gallery",
          "Email + WhatsApp + Google Map integration",
          "Domain (1 year) + Hosting (1 year)",
          "Blog",
          "Payment gateway integration",
          "Shipping",
        ],
        cta: "Choose Silver",
        params: "wp-silver",
      },
      {
        name: "Gold",
        price: "₹14,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Gallery, Contact Us",
          "Email + WhatsApp + Google Map integration",
          "Domain (1 year) + Hosting (1 year)",
          "Blog",
          "Payment gateway integration",
          "Purchase + Add to cart",
          "Shipping",
        ],
        cta: "Choose Gold",
        params: "wp-gold",
      },
      {
        name: "Platinum",
        price: "₹19,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Gallery, Contact Us",
          "Email + WhatsApp + Google Map integration",
          "Domain (1 year) + Hosting (1 year)",
          "Blog",
          "Payment gateway",
          "Purchase + Add to cart",
          "Shipping",
          "1 year maintenance",
          "100 professional webmails (1GB per email)",
        ],
        cta: "Choose Platinum",
        params: "wp-platinum",
      },
    ],
  },
  {
    id: "coded-ecom",
    title: "E-commerce Coded Website Packages",
    subtitle: "Higher performance and flexibility with custom-coded builds.",
    tiers: [
      {
        name: "Silver",
        price: "₹24,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Gallery, Contact Us",
          "Email + WhatsApp + Google Map integration",
          "Purchase + Add to cart",
          "Blog",
          "Payment gateway integration",
          "Shipping",
        ],
        cta: "Choose Silver",
        params: "coded-silver",
      },
      {
        name: "Gold",
        price: "₹32,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Gallery, Contact Us",
          "Email + WhatsApp + Google Map integration",
          "Domain (1 year) + Hosting (1 year)",
          "Blog",
          "Payment gateway",
          "Purchase + Add to cart",
          "Shipping",
        ],
        cta: "Choose Gold",
        params: "coded-gold",
      },
      {
        name: "Platinum",
        price: "₹39,999 + GST",
        features: [
          "Pages: Home, About Us, Services/Product, Gallery, Contact Us",
          "Email + WhatsApp + Google Map integration",
          "Domain (1 year) + Hosting (1 year)",
          "Blog",
          "Payment gateway",
          "Purchase + Add to cart",
          "Shipping",
          "1 year maintenance",
          "100 professional webmails (1GB per email)",
        ],
        cta: "Choose Platinum",
        params: "coded-platinum",
      },
    ],
    notes: [
      "Payment options: 50% advance / 50% after deployment; 40%-20%-20%; EMI 9 months.",
    ],
  },
];