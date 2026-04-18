import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
}

const BASE = 'Sinrem Tech';
const DOMAIN = 'https://sinremtech.in';

export function useSEO({ title, description, path }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = `${title} | ${BASE}`;

    // Meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (meta) meta.content = description;
    }

    // Canonical
    if (path) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (link) link.href = `${DOMAIN}${path}`;

      let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
      if (ogUrl) ogUrl.content = `${DOMAIN}${path}`;
    }

    // OG title + description
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (ogTitle) ogTitle.content = `${title} | ${BASE}`;

    if (description) {
      let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
      if (ogDesc) ogDesc.content = description;
    }
  }, [title, description, path]);
}
