import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../components/ui/Container';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowRight, Zap, Globe, Code, PenTool } from 'lucide-react';

const openRoles = [
  {
    title: 'Frontend Developer',
    type: 'Full-time / Remote',
    icon: <Code size={20} />,
    color: '#4FC3FF',
    description: 'Build fast, accessible React interfaces. You care about performance, clean code, and pixel-perfect UI.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Backend Developer',
    type: 'Full-time / Remote',
    icon: <Zap size={20} />,
    color: '#00E599',
    description: 'Design and build scalable APIs, services, and data pipelines. Node.js, Python, or Go — you pick your weapon.',
    skills: ['Node.js', 'MongoDB', 'REST APIs', 'Docker'],
  },
  {
    title: 'Technical Writer',
    type: 'Part-time / Remote',
    icon: <PenTool size={20} />,
    color: '#FFE566',
    description: 'Turn complex technical concepts into clear, structured documentation. You write for developers and non-developers alike.',
    skills: ['Technical Docs', 'API Docs', 'Markdown', 'Diagrams'],
  },
  {
    title: 'UI/UX Designer',
    type: 'Contract / Remote',
    icon: <Globe size={20} />,
    color: '#FF6B9D',
    description: 'Design intuitive, beautiful product experiences. From wireframes to high-fidelity prototypes — you own the visual layer.',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
  },
];

export default function CareersPage() {
  return (
    <main className="bg-bg min-h-screen">
      {/* Hero */}
      <div className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <Badge className="mb-6">We're Hiring</Badge>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-text mb-6 leading-[0.9]">
              Build the <br />
              <span className="text-wati-green underline decoration-4 decoration-wati-dark dark:decoration-white underline-offset-4">
                future
              </span>{' '}
              with us.
            </h1>
            <p className="text-xl font-bold text-text/70 max-w-xl leading-relaxed">
              We're a small, focused team building bespoke software for real businesses.
              No bureaucracy. No bloat. Just good work with people who care.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Values strip */}
      <div className="border-y-2 border-wati-dark/10 dark:border-white/10 bg-wati-yellow/20 dark:bg-yellow-900/10 py-8">
        <Container>
          <div className="flex flex-wrap gap-6 sm:gap-12 justify-center text-sm font-black uppercase tracking-widest text-wati-dark dark:text-white/80">
            {['Remote-first', 'Async-friendly', 'Ownership culture', 'No micromanagement', 'Ship fast'].map((v) => (
              <span key={v} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-wati-green" />
                {v}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* Open Roles */}
      <section className="py-24">
        <Container>
          <div className="mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-text tracking-tight mb-3">Open Roles</h2>
            <p className="text-text/70 font-medium">All roles are remote. We hire for skill, not location.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {openRoles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-[1.5rem] border-2 border-wati-dark dark:border-white/20 bg-white dark:bg-[#161616] shadow-hard hover:shadow-[8px_8px_0px_0px_#1D1D1B] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <div className="h-1" style={{ backgroundColor: role.color }} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border-2 border-wati-dark dark:border-white/20 flex items-center justify-center" style={{ color: role.color }}>
                        {role.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-wati-dark dark:text-white">{role.title}</h3>
                        <span className="text-xs font-bold text-text/60 uppercase tracking-wide">{role.type}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-text/80 leading-relaxed mb-6 font-medium">{role.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {role.skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-xs font-bold rounded-lg border border-wati-dark/20 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-wati-dark dark:text-white/80">
                        {s}
                      </span>
                    ))}
                  </div>

                  <Button
                    href={`/contact?package=career-${role.title.toLowerCase().replace(/\s+/g, '-')}`}
                    variant="secondary"
                    className="w-full"
                  >
                    Apply Now <ArrowRight size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* General application CTA */}
      <section className="py-20 border-t-2 border-wati-dark/10 dark:border-white/10">
        <Container>
          <div className="rounded-[2rem] border-2 border-wati-dark bg-wati-dark dark:bg-white/5 p-10 sm:p-16 text-center shadow-hard">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Don't see your role?
            </h2>
            <p className="text-white/80 font-medium mb-8 max-w-md mx-auto">
              We're always open to talented people. Send us your work and tell us how you'd contribute.
            </p>
            <Button href="/contact" className="bg-wati-green text-wati-dark border-wati-green hover:bg-[#00D075] px-10 py-4 h-auto text-base">
              Send an Open Application <ArrowRight size={18} />
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
