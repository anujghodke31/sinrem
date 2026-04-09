import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useProjects } from "../lib/api";
import { CaseStudy, products } from "../lib/content";
import { ArrowRight, ArrowUpRight, Sparkles, Zap } from "lucide-react";
import { cn } from "../lib/cn";
import { 
  IndustrialVisual, 
  BlueprintVisual, 
  NetworkVisual, 
  OrganicVisual 
} from "../components/animated/ProjectVisuals";

// Map slugs to visuals
const visualMap: Record<string, React.ReactNode> = {
  "shree-metal-industries": <IndustrialVisual />,
  "cvk-engineers": <BlueprintVisual />,
  "c4i4-technical-manual": <NetworkVisual />,
  "house-of-amrth-visuals": <OrganicVisual />,
};

// --- Sub-components (Moved to top) ---

const CaseStudyRow: React.FC<{ data: CaseStudy, index: number }> = ({ data, index }) => {
  // 3D Tilt Logic
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Wati Theme Cycling
  // Light Mode: Pastel Backgrounds. Dark Mode: Dark BG with Neon Borders/Shadows.
  const themeStyles = [
    { 
        bg: "bg-wati-blueLight", 
        darkBorder: "dark:border-wati-blue", 
        darkShadow: "dark:shadow-[6px_6px_0px_0px_#4FC3FF]" 
    },
    { 
        bg: "bg-wati-greenLight", 
        darkBorder: "dark:border-wati-green", 
        darkShadow: "dark:shadow-[6px_6px_0px_0px_#00E785]" 
    },
    { 
        bg: "bg-wati-pinkLight", 
        darkBorder: "dark:border-wati-pink", 
        darkShadow: "dark:shadow-[6px_6px_0px_0px_#F9B4FF]" 
    },
    { 
        bg: "bg-[#FFF7D1]", 
        darkBorder: "dark:border-wati-yellow", 
        darkShadow: "dark:shadow-[6px_6px_0px_0px_#FFE96E]" 
    },
  ];
  
  const theme = themeStyles[index % themeStyles.length];

  return (
    <section className="relative group perspective-1000 py-6 sm:py-12">
      <Container>
        <Link to={`/case-studies/${data.slug}`} className="block">
          <div className={cn(
              "grid lg:grid-cols-2 gap-8 lg:gap-16 items-center p-8 sm:p-12 rounded-[30px] border-2 transition-all duration-300 group-hover:-translate-y-2",
              "border-wati-dark shadow-hard", // Base styles
              theme.bg, // Light mode bg
              "dark:bg-[#121212] dark:shadow-none", // Dark mode base
              theme.darkBorder, theme.darkShadow // Dark mode neon accents
          )}>
            
            {/* Text Content */}
            <div className={cn("space-y-6 order-2", index % 2 === 0 ? "lg:order-1" : "lg:order-2")}>
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-black border-2 border-wati-dark dark:border-current font-black text-xl text-text shadow-sm">
                    {index + 1}
                  </div>
                  <div className="h-0.5 w-12 bg-wati-dark/20 dark:bg-white/20" />
                  <span className="text-sm font-bold uppercase tracking-widest text-wati-dark/70 dark:text-white/70">{data.company}</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-wati-dark dark:text-white mb-6 leading-tight">
                  {data.title}
                </h2>
                
                <p className="text-lg text-wati-dark/80 dark:text-gray-300 leading-relaxed mb-8 font-medium">
                  {data.challenge}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                   {data.impact.slice(0,2).map((imp, i) => (
                     <div key={i} className="px-4 py-2 rounded-xl bg-white/60 dark:bg-white/5 border-2 border-wati-dark/10 dark:border-white/10 text-xs font-bold text-text">
                        {imp.split(' ').slice(0, 4).join(' ')}...
                     </div>
                   ))}
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide border-b-2 border-current pb-1 group-hover:gap-4 transition-all text-text">
                  Read Case Study <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.div>
            </div>

            {/* Visual Card (Interactive) */}
            <motion.div
              ref={ref}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className={cn(
                "relative aspect-[4/3] rounded-2xl bg-white dark:bg-[#1A1A1A] border-2 border-wati-dark dark:border-white/20 overflow-hidden cursor-pointer order-1 shadow-inner",
                index % 2 === 0 ? "lg:order-2" : "lg:order-1"
              )}
            >
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 opacity-[0.05]" 
                   style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
              />
              
              {/* The Abstract Visual - Centered and Scaled */}
              <div 
                className="absolute inset-0 z-10 flex items-center justify-center text-wati-dark dark:text-white"
                style={{ transform: "translateZ(30px)" }} 
              >
                 <div className="scale-90 opacity-80">
                    {visualMap[data.slug]}
                 </div>
              </div>

              {/* Glass Overlay with Shine */}
              <motion.div 
                style={{ 
                   background: useMotionTemplate`radial-gradient(
                    circle at ${useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])} ${useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])}, 
                    rgba(255,255,255,0.2) 0%, 
                    transparent 60%
                  )`
                }}
                className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
              />

              {/* Floating Label inside card */}
              <div 
                className="absolute bottom-6 left-6 z-30 bg-white dark:bg-black border-2 border-wati-dark dark:border-white px-4 py-2 rounded-full shadow-hard"
                style={{ transform: "translateZ(50px)" }}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-text">View Project</div>
              </div>
            </motion.div>
          </div>
        </Link>
      </Container>
    </section>
  );
}

// --- Main Component ---

export default function CaseStudiesPage() {
  const { projects, loading, error } = useProjects();
  return (
    <main className="relative bg-bg overflow-hidden transition-colors duration-300">
      <div className="pt-32 pb-16 sm:pt-40 sm:pb-24">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <Badge className="mb-6 scale-110 origin-left">Portfolio</Badge>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-text mb-8">
              Proof in <br />
              <span className="text-brand-600 dark:text-brand-400 decoration-4 underline decoration-wati-yellow underline-offset-4">
                Delivery.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted leading-relaxed font-medium max-w-2xl">
              We don't just claim performance. We engineer it. 
              Explore how we've solved complex challenges for manufacturing, 
              engineering, AI, and retail partners.
            </p>
          </motion.div>
        </Container>
      </div>

      {/* ── Our Products ─────────────────────────────────── */}
      <section className="py-20 border-y-4 border-wati-dark/10 dark:border-white/10 bg-gradient-to-br from-wati-greenLight/40 via-white to-wati-blueLight/40 dark:from-[#0d1a12] dark:via-[#121212] dark:to-[#0d1220]">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-wati-green" size={20} />
              <span className="text-xs font-black uppercase tracking-widest text-wati-green">Built In-House</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-wati-dark dark:text-white tracking-tight mb-4">
              Our Products
            </h2>
            <p className="text-lg text-wati-dark/60 dark:text-white/60 font-medium max-w-xl">
              Beyond client work — products we're building to solve real-world problems at scale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group relative rounded-[2rem] border-2 border-wati-dark dark:border-white/20 bg-white dark:bg-[#161616] shadow-hard hover:shadow-[8px_8px_0px_0px_#1D1D1B] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Accent top bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: product.accent }} />

                <div className="p-8 sm:p-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-wati-dark/10 dark:border-white/10 bg-wati-dark/5 dark:bg-white/5 text-xs font-bold uppercase tracking-widest text-wati-dark/60 dark:text-white/60 mb-4">
                        <Zap size={10} style={{ color: product.accent }} />
                        {product.category}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black text-wati-dark dark:text-white leading-tight">
                        {product.name}
                      </h3>
                      <p className="text-base font-bold mt-1" style={{ color: product.accent }}>
                        {product.tagline}
                      </p>
                    </div>
                    {/* Status badge */}
                    <span className="shrink-0 ml-4 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wide border-2 border-wati-dark/20 dark:border-white/20 text-wati-dark/60 dark:text-white/60 bg-wati-dark/5 dark:bg-white/5">
                      {product.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-base text-wati-dark/70 dark:text-white/70 leading-relaxed mb-8 font-medium">
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-8">
                    {product.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-sm font-medium text-wati-dark/80 dark:text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: product.accent }} />
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide border-b-2 pb-1 w-fit transition-all group-hover:gap-4"
                       style={{ borderColor: product.accent, color: product.accent }}>
                    Learn More <ArrowUpRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Client Work ──────────────────────────────────── */}
      <div className="pt-16 pb-4">
        <Container>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-wati-dark/50 dark:text-white/50">Client Work</span>
            <div className="h-px flex-1 bg-wati-dark/10 dark:bg-white/10" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-wati-dark dark:text-white tracking-tight">
            Case Studies
          </h2>
        </Container>
      </div>

      <div className="flex flex-col gap-4 pb-32">
        {loading ? (
           <Container>
             <div className="py-20 text-center text-xl text-muted animate-pulse">
               Loading projects...
             </div>
           </Container>
        ) : error ? (
           <Container>
             <div className="py-20 text-center text-xl text-red-500">
               Failed to load projects. Please try again later.
             </div>
           </Container>
        ) : projects.length === 0 ? (
           <Container>
             <div className="py-20 text-center text-xl text-muted">
               No projects found. Check back later!
             </div>
           </Container>
        ) : (
          projects.map((cs, index) => (
            <CaseStudyRow key={cs.slug} data={cs} index={index} />
          ))
        )}
      </div>

      {/* Footer CTA area - Wati Style */}
      <section className="py-24 border-t-2 border-wati-dark/10 dark:border-white/10 bg-wati-yellow/10 dark:bg-yellow-900/10">
        <Container>
           <div className="flex flex-col items-center text-center">
             <h2 className="text-4xl font-black text-text mb-8">Have a challenge for us?</h2>
             <Button href="/contact" className="px-10 py-5 text-lg h-auto rounded-xl">
               Start a Project <ArrowRight className="ml-2" />
             </Button>
           </div>
        </Container>
      </section>
    </main>
  );
}