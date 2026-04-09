import { useState, useEffect } from 'react';
import { apiUrl } from './apiBase';

// Maps our Express/MongoDB backend "Project" structure to the React frontend's expected UI format
export function useProjects() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(apiUrl('/api/projects'))
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          // Map MongoDB schema to the CaseStudy schema expected by React UI
          const mapped = json.data.map((proj: any) => ({
            slug: proj._id,
            company: proj.type || 'Software Project',
            title: proj.title,
            challenge: proj.description,
            // Fallbacks for UI fields missing in Mongo schema
            solution: ['Custom software engineered by SharadChandra TechVentures'],
            impact: proj.techStack?.length ? proj.techStack : ['Scalable UI', 'Secure Backend', 'Fast Performance'],
            testimonial: 'A great operational addition to our technical stack.',
            attribution: 'Client',
            rawContent: proj.content,
            liveUrl: proj.liveUrl
          }));
          setData(mapped);
        }
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { projects: data, loading, error };
}
