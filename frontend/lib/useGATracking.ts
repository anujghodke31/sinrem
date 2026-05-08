import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = 'G-XT9Z4WVBJ3';

/**
 * Track page views on client-side route changes.
 * GA4 only auto-tracks initial page load; SPA navigation needs manual config.
 */
export function useGATracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}
