import React from 'react';
import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://sinremtech.in';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sharadchandra TechVentures Pvt. Ltd.",
  "alternateName": "Sinrem Tech",
  "url": BASE_URL,
  "logo": `${BASE_URL}/logo.svg`,
  "foundingDate": "2023",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Anjali Nagar, Durga Hill Soc, 62/1/1, nr. Homi Bangla, Santosh Nagar",
    "addressLocality": "Katraj, Pune",
    "addressRegion": "Maharashtra",
    "postalCode": "411046",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9503119046",
    "contactType": "customer service",
    "email": "info@sinrem.tech",
    "availableLanguage": ["English", "Hindi", "Marathi"]
  },
  "sameAs": [
    "https://www.instagram.com/sinrem_",
    "https://www.linkedin.com/company/sharadchandra-techventures/"
  ],
  "areaServed": ["IN", "GB"],
  "serviceType": [
    "Custom Web Application Development",
    "AI/ML Software Solutions",
    "Mobile App Development",
    "E-commerce Development",
    "Technical Documentation",
    "Product Photography"
  ]
};

type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
};

export default function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const fullTitle = title.includes('Sinrem') ? title : `${title} | Sinrem Tech`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Sinrem Tech" />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="author" content="Sharadchandra TechVentures Pvt. Ltd." />
      <meta name="geo.region" content="IN-MH" />
      <meta name="geo.placename" content="Pune, Maharashtra" />

      <script type="application/ld+json">{JSON.stringify(jsonLd || ORG_SCHEMA)}</script>
    </Helmet>
  );
}
