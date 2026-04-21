import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
  ogType?: string;
  jsonLd?: Record<string, any>;
}

const DOMAIN = 'https://sinremtech.in';

export function useSEO({ title, description, path, ogType = "website", jsonLd }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, content: string) => {
      const node = document.querySelector(selector) as HTMLMetaElement | null;
      if (node) node.content = content;
    };

    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }

    setMeta('meta[name="robots"]', "index, follow");
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[property="og:type"]', ogType);
    setMeta('meta[name="twitter:card"]', "summary_large_image");
    setMeta('meta[property="og:image"]', "https://sinremtech.in/og-image.png");
    setMeta('meta[name="twitter:image"]', "https://sinremtech.in/og-image.png");

    if (path) {
      const canonicalUrl = `${DOMAIN}${path}`;
      const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (link) link.href = canonicalUrl;
      setMeta('meta[property="og:url"]', canonicalUrl);
    }

    const scriptId = "org-jsonld";
    const existingScript = document.getElementById(scriptId);
    if (jsonLd) {
      const script = existingScript || document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("id", scriptId);
      script.textContent = JSON.stringify(jsonLd);
      if (!existingScript) document.head.appendChild(script);
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [title, description, path, ogType, jsonLd]);
}
