// ── Static data hooks ─────────────────────────────────────────
// All public content lives in content.ts. No API calls needed.
// These hooks exist for backwards compatibility with page imports.

import { caseStudies, serviceCategories } from './content';

export { caseStudies as staticProjects, type ServiceCategory as DynamicServiceCategory } from './content';

export function useProjects() {
  return { projects: caseStudies, loading: false, error: null };
}

export function useContentServices() {
  return {
    services: serviceCategories.map((s) => ({
      id: s.id,
      title: s.title,
      subtitle: s.subtitle,
      items: s.items,
    })),
    loading: false,
  };
}

export function useHomepageSections() {
  // Return empty — Home.tsx falls back to its defaultTopMidOrder / defaultBottomOrder
  return { sectionKeys: [] as string[] };
}
