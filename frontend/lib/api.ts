// ── Static Projects / Case Studies ────────────────────────────
// Data is now static — no API call or loading state needed.
// All case study data lives in lib/content.ts (caseStudies array).
export { caseStudies as staticProjects } from './content';

// Backwards-compatible hook so existing pages need no import changes.
// Returns the static array immediately — no loading/error states.
import { caseStudies } from './content';

export function useProjects() {
  return { projects: caseStudies, loading: false, error: null };
}
