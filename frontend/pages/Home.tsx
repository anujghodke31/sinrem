
import React, { Suspense, useRef } from 'react';
import { Link } from "react-router-dom";
import SEO from '../components/site/SEO';
import { ArrowRight, ArrowUpRight, Zap, Sparkles, LayoutGrid } from "lucide-react";
import { motion, useScroll, useSpring, useTransform, useVelocity, useAnimationFrame, useMotionValue, useInView } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useHomepageSections, useProjects } from "../lib/api";
import { products } from "../lib/content";
import { cn } from "../lib/cn";
import { TechIconSVG } from "../components/ui/TechIcons";
import { site } from "../lib/site";
import ShapeGrid from "../components/ui/ShapeGrid";
import { LazySection } from "../components/ui/LazySection";
const HorizontalScrollShowcase = React.lazy(() => import("../components/ui/HorizontalScrollShowcase").then((module) => ({ default: module.HorizontalScrollShowcase })));
const MagicBento = React.lazy(() => import("../components/ui/MagicBento"));
const ClientsMarquee = React.lazy(() => import("../components/ui/ClientsMarquee"));
const Testimonials = React.lazy(() => import("../components/ui/Testimonials"));
const AcademySection = React.lazy(() => import("../components/ui/AcademySection"));

// --- Sub-components ---
// 1. Sticker Component (Floating Tech Icons)
const Sticker: React.FC<{
  children: React.ReactNode,
  className?: string,
  delay?: number
}> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, rotate: -20 }}
    animate={{ opacity: 1, scale: 1, rotate: 0 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 1.5 + delay
    }}
    className={cn(
      "absolute flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-full border-2 border-black dark:border-zinc-600 shadow-[4px_4px_0px_0px_#1D1D1B] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] z-20",
      className
    )}
  >
    {children}
  </motion.div>
);

// 2. Magnetic Button (Wati Style)
const MagneticButton: React.FC<{ children: React.ReactNode, href: string }> = ({ children, href }) => {
  return (
    <Button
      href={href}
      className="px-8 py-4 h-auto text-lg rounded-full bg-wati-green text-black border-2 border-black shadow-[4px_4px_0px_0px_#1D1D1B] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all active:scale-95"
    >
      {children}
    </Button>
  )
}

// 3. Polaroid Project Card
const PolaroidCard: React.FC<{ project: any, index: number }> = ({ project, index }) => {
  // Rotate alternate cards slightly for messy desk look
  const rotate = index % 2 === 0 ? -2 : 2;

  return (
    <Link to={`/case-studies/${project.slug}`} className="group block relative">
      <div
        className="relative bg-card p-4 pb-16 border-2 border-black dark:border-zinc-700 shadow-[8px_8px_0px_0px_#1D1D1B] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-0"
        style={{ transform: `rotate(${rotate}deg)` }}
      >
        {/* Image Area */}
        <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden border-2 border-black mb-6">
          <div className={cn(
            "absolute inset-0 flex items-center justify-center text-9xl font-black text-black/5 group-hover:scale-110 transition-transform duration-700",
            index % 2 === 0 ? "bg-wati-blueLight" : "bg-wati-pinkLight"
          )}>
            {project.company.charAt(0)}
          </div>

          {/* Overlay Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-sm">
            <div className="px-6 py-3 bg-white border-2 border-black shadow-hard rounded-full font-bold text-black transform scale-90 group-hover:scale-100 transition-transform">
              View Case Study
            </div>
          </div>
        </div>

        {/* Content Area (Handwritten style layout) */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex gap-2 mb-3">
              {project.solution.slice(0, 2).map((tag: string, i: number) => (
                <span key={i} className="px-2 py-1 text-[10px] uppercase font-bold border border-foreground/20 rounded-md bg-foreground/5 text-foreground/70">
                  {tag.split(' ')[0]}
                </span>
              ))}
            </div>
            <h3 className="text-2xl font-black text-foreground leading-tight mb-1">{project.company}</h3>
            <p className="text-sm font-medium text-muted-foreground line-clamp-1">{project.title}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-black text-white group-hover:bg-wati-green group-hover:text-black transition-colors">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  )
}

// 4. Velocity Scroll (Caution Tape Style)
function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const VelocityScroll: React.FC<{ children: React.ReactNode, baseVelocity: number }> = ({ children, baseVelocity = 100 }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(wrapperRef, { amount: 0.1 });
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v: number) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    if (!isInView) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });
  return (
    <div ref={wrapperRef} className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap bg-gradient-to-r from-[#ff4d4f] to-[#ff8a00] border-y-4 border-black py-4 -rotate-1 scale-105 z-10 relative">
      <motion.div className="flex whitespace-nowrap text-4xl sm:text-6xl font-black uppercase tracking-tight text-black" style={{ x }}>
        <span className="block mr-12">{children} </span>
        <span className="block mr-12">{children} </span>
        <span className="block mr-12">{children} </span>
        <span className="block mr-12">{children} </span>
      </motion.div>
    </div>
  );
}

// 5. Bento Grid Item
const BentoItem: React.FC<{ children: React.ReactNode, className?: string, title?: string }> = ({ children, className, title }) => (
  <div className={cn("bg-card border-2 border-black dark:border-zinc-700 p-6 rounded-2xl shadow-hard flex flex-col justify-between relative overflow-hidden group min-h-[180px]", className)}>
    {title && <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{title}</div>}
    {children}
  </div>
);

// 6. Tech Item Component
const TechItem: React.FC<{ name: string, color: string, className?: string }> = ({ name, color, className }) => {
  const style = { "--hover-color": color } as React.CSSProperties;
  return (
    <div className={cn("flex items-center gap-3 group select-none cursor-default", className)} style={style}>
      <div className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--hover-color)] transition-transform duration-300 group-hover:scale-110">
        <TechIconSVG name={name} className="w-full h-full fill-current" />
      </div>
      <span className="text-sm sm:text-base font-bold text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        {name}
      </span>
    </div>
  )
}

// --- Main Page Component ---

interface HomePageProps {
  isPreloading?: boolean;
  shouldAnimate?: boolean;
}

export default function HomePage({ isPreloading, shouldAnimate }: HomePageProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { projects } = useProjects();
  const { sectionKeys } = useHomepageSections();
  const enabledSections = new Set(sectionKeys);
  const useApiSections = sectionKeys.length > 0;
  const isSectionEnabled = (key: string) => (useApiSections ? enabledSections.has(key) : true);
  const defaultTopMidOrder = ["products", "showcase", "featured-work", "tech-stack", "cta"];
  const topMidSectionOrder = useApiSections
    ? sectionKeys.filter((key) => defaultTopMidOrder.includes(key))
    : defaultTopMidOrder;
  const defaultBottomOrder = ["trusted-by", "testimonials", "academy"];
  const bottomSectionOrder = useApiSections
    ? sectionKeys.filter((key) => defaultBottomOrder.includes(key))
    : defaultBottomOrder;

  return (
    <main className="bg-bg text-foreground">
      <SEO title="Sinrem Tech | AI-Powered Custom Software & App Development" description="Sinrem Tech builds AI-powered custom software, web and mobile apps, cloud systems, and automation workflows to help businesses scale securely and faster." canonical="/" />
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-wati-green origin-left z-[100]" style={{ scaleX }} />

      {/* 1. Hero Section - Graph Paper & Stickers */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-10 bg-bg transition-colors duration-300">

        {/* Animated ShapeGrid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.12] dark:opacity-[0.18]">
          <ShapeGrid
            direction="diagonal"
            speed={0.5}
            borderColor="currentColor"
            squareSize={40}
            hoverFillColor="#00E599"
            shape="square"
            hoverTrailAmount={4}
          />
        </div>

        {/* Floating Stickers — clipped to hero bounds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="relative w-full h-full max-w-[1400px] mx-auto">
            {/* Top Left - React */}
            <Sticker className="top-[15%] left-[5%] md:left-[10%] rotate-12" delay={0.1}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" className="w-8 h-8 md:w-10 md:h-10" alt="React" loading="lazy" />
            </Sticker>
            {/* Bottom Left - AWS */}
            <Sticker className="hidden md:flex bottom-[20%] left-[8%] md:left-[15%] -rotate-6" delay={0.2}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="AWS" loading="lazy" />
            </Sticker>
            {/* Top Right - Node */}
            <Sticker className="top-[20%] right-[5%] md:right-[12%] -rotate-12" delay={0.3}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" className="w-8 h-8 md:w-10 md:h-10" alt="Node" loading="lazy" />
            </Sticker>
            {/* Bottom Right - Python */}
            <Sticker className="hidden md:flex bottom-[8%] right-[3%] md:bottom-[16%] md:right-[8%] rotate-6 opacity-80" delay={0.4}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" className="w-8 h-8 md:w-10 md:h-10" alt="Python" loading="lazy" />
            </Sticker>
          </div>
        </div>

        <Container className="relative z-10 pointer-events-none">
          <div className="max-w-5xl mx-auto text-center">
            <div className="pointer-events-auto">

              {/* Title with Highlighter Effect */}
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.9] mb-10 flex flex-col items-center">
                <span className="block mb-2">Build your next</span>
                <span className="block mb-2">platform with</span>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                  <span className="relative inline-block px-4 rotate-1">
                    <span className="absolute inset-0 bg-wati-green -skew-x-6 border-2 border-black shadow-[4px_4px_0px_0px_#1D1D1B]" />
                    <span className="relative z-10 text-black">Performance</span>
                  </span>
                  <span className="text-gray-400">&</span>
                  <span className="relative inline-block px-2 -rotate-1">
                    <span className="absolute inset-0 bottom-1 border-b-8 border-wati-pink w-full" />
                    <span className="relative z-10">Security.</span>
                  </span>
                </div>
              </h1>

              {/* Subtitle - Restored Full Content */}
              <p className="text-xl sm:text-2xl font-bold text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
                Bespoke software solutions. Built for performance, scale, and security. <br className="hidden sm:block" />
                From AI-powered websites and e-commerce to SaaS, APIs, and data automation systems-engineered for scale.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                <MagneticButton href="/contact">
                  Talk to us <ArrowRight size={20} className="ml-2 inline-block" />
                </MagneticButton>
                <Button href="/services" variant="ghost" className="px-8 py-4 h-auto text-lg rounded-full border-2 border-foreground/30 text-foreground hover:bg-foreground/5">
                  Explore services
                </Button>
              </div>

            </div>
          </div>
        </Container>
      </section>

      <LazySection placeholderMinHeight="520px" className="bg-bg">
        {/* 1B. Feature Grid - Magic Bento Transition (Moved OUT of Hero Section) */}
        <section className="bg-bg flex flex-col items-center justify-center pb-16 transition-colors duration-300 relative z-20 -mt-16">
          <Container>
            <div className="w-full pt-8">
              <Suspense fallback={<div className="h-[420px] w-full rounded-2xl border border-foreground/10 bg-card/40" />}>
                <MagicBento
                  textAutoHide={true}
                  enableStars
                  enableSpotlight
                  enableBorderGlow={true}
                  enableTilt={false}
                  enableMagnetism={false}
                  clickEffect
                  spotlightRadius={400}
                  particleCount={12}
                  glowColor="0, 229, 153"
                  disableAnimations={false}
                />
              </Suspense>
            </div>
          </Container>
        </section>
      </LazySection>

      <LazySection placeholderMinHeight="220px" className="bg-bg">
        {/* 2. Velocity Scroll - Caution Tape */}
        <div className="py-10 bg-bg overflow-hidden">
          <VelocityScroll baseVelocity={-2}>
            Web Development • Mobile Apps • AI Solutions • AI Automation • Cloud Infrastructure • Cyber Security • UI/UX Design •
          </VelocityScroll>
        </div>
      </LazySection>

      {topMidSectionOrder.map((sectionKey) => {
        if (sectionKey === "products" && isSectionEnabled("products")) {
          return (
            <LazySection key={sectionKey} placeholderMinHeight="760px" className="bg-bg">
              <section className="py-16 bg-bg border-y-2 border-foreground/5">
                <Container>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={16} className="text-wati-green" />
                        <span className="text-xs font-black uppercase tracking-widest text-wati-green">In-House Products</span>
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                        Our Products
                      </h2>
                    </div>
                    <Link to="/case-studies" className="text-sm font-black uppercase tracking-wide underline underline-offset-4 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">
                      View All Work →
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {products.map((product, i) => (
                      <motion.div
                        key={product.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="group relative rounded-[1.5rem] border-2 border-black dark:border-zinc-700 bg-card shadow-hard hover:shadow-[6px_6px_0px_0px_#1D1D1B] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                      >
                        <div className="h-1" style={{ backgroundColor: product.accent }} />
                        <div className="aspect-video border-b border-foreground/10 bg-black/10">
                          <img
                            src={`https://images.unsplash.com/photo-${i === 0 ? "1518770660439-4636190af475" : "1461749280684-dccba630e2f6"}?auto=format&fit=crop&w=900&q=65`}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-7">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <span className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">{product.category}</span>
                              <h3 className="text-2xl font-black text-foreground">{product.name}</h3>
                              <p className="text-sm font-bold mt-0.5" style={{ color: product.accent }}>{product.tagline}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full border-2 border-foreground/10 text-foreground/40 shrink-0 ml-3">
                              {product.status}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2 mb-5">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {product.features.slice(0, 3).map((f, fi) => (
                              <span key={fi} className="px-2.5 py-1 text-xs font-bold rounded-lg border border-foreground/10 bg-foreground/5 text-foreground/70">
                                {f}
                              </span>
                            ))}
                            {product.features.length > 3 && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded-lg border border-foreground/10 bg-foreground/5 text-foreground/40">
                                +{product.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Container>
              </section>
            </LazySection>
          );
        }

        if (sectionKey === "showcase" && isSectionEnabled("showcase")) {
          return (
            <LazySection key={sectionKey} placeholderMinHeight="600px" className="bg-bg">
              <Suspense fallback={<div className="h-[60vh] bg-bg" />}>
                <HorizontalScrollShowcase />
              </Suspense>
            </LazySection>
          );
        }

        if (sectionKey === "featured-work" && isSectionEnabled("featured-work")) {
          return (
            <LazySection key={sectionKey} placeholderMinHeight="900px" className="bg-[#f0f0f0] dark:bg-[#1a1a1a]">
              <section className="py-20 bg-[#f0f0f0] dark:bg-[#1a1a1a] border-y-4 border-black">
                <Container>
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                      <Badge className="mb-4 bg-wati-blueLight border-black">Selected Works</Badge>
                      <h3 className="text-5xl sm:text-6xl font-black text-foreground tracking-tight">
                        Engineered for <br />
                        <span className="text-wati-pink underline decoration-4 decoration-foreground dark:decoration-white underline-offset-4">Impact.</span>
                      </h3>
                    </div>
                    <Button href="/case-studies" variant="secondary" className="border-2 border-black shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                      View All Projects
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {projects.slice(0, 3).map((cs, i) => (
                      <div key={cs.slug} className={cn(i === 1 ? "md:translate-y-16" : "")}>
                        <PolaroidCard project={cs} index={i} />
                      </div>
                    ))}
                  </div>
                </Container>
              </section>
            </LazySection>
          );
        }

        if (sectionKey === "tech-stack" && isSectionEnabled("tech-stack")) {
          return (
            <LazySection key={sectionKey} placeholderMinHeight="600px" className="bg-bg">
              <section className="py-20 bg-bg">
                <Container>
                  <div className="text-center mb-12">
                    <h2 className="text-5xl sm:text-7xl font-black text-foreground mb-6">Built on modern foundations.</h2>
                    <p className="text-xl font-bold text-muted-foreground">We don't just write code. We architect systems.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <BentoItem className="md:col-span-2 bg-wati-blueLight dark:bg-zinc-800/60">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <div className="text-3xl font-black text-foreground">Web Development</div>
                          <p className="font-bold text-foreground/60">MongoDB, Express, React, Node.js, Next.js</p>
                        </div>
                        <LayoutGrid size={36} className="text-foreground/20 shrink-0" />
                      </div>
                      <div className="flex flex-wrap gap-3 mt-auto">
                        {['React', 'Next.js', 'Node.js', 'Express', 'TypeScript', 'Tailwind CSS', 'WordPress'].map((name) => (
                          <div key={name} className="flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-zinc-700/70 rounded-xl border border-black/10 dark:border-zinc-600">
                            <TechIconSVG name={name} className="w-5 h-5" />
                            <span className="text-xs font-bold text-foreground">{name}</span>
                          </div>
                        ))}
                      </div>
                    </BentoItem>
                    <BentoItem className="bg-wati-greenLight dark:bg-zinc-800/60">
                      <div className="space-y-1 mb-6">
                        <div className="text-3xl font-black text-foreground">AI & Data</div>
                        <p className="font-bold text-foreground/60">Gemini, OpenAI, Python, TensorFlow</p>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-auto">
                        {['Google Gemini', 'OpenAI', 'Python', 'TensorFlow', 'LangChain'].map((name) => (
                          <div key={name} className="flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-zinc-700/70 rounded-xl border border-black/10 dark:border-zinc-600">
                            <TechIconSVG name={name} className="w-5 h-5" />
                            <span className="text-xs font-bold text-foreground">{name}</span>
                          </div>
                        ))}
                      </div>
                    </BentoItem>
                    <BentoItem className="bg-wati-pinkLight dark:bg-zinc-800/60">
                      <div className="space-y-1 mb-6">
                        <div className="text-3xl font-black text-foreground">Cloud & DevOps</div>
                        <p className="font-bold text-foreground/60">AWS, Azure, GCP, Docker</p>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-auto">
                        {['AWS', 'Azure', 'Google Cloud', 'Docker', 'GitHub Actions'].map((name) => (
                          <div key={name} className="flex items-center gap-2 px-3 py-2 bg-white/70 dark:bg-zinc-700/70 rounded-xl border border-black/10 dark:border-zinc-600">
                            <TechIconSVG name={name} className="w-5 h-5" />
                            <span className="text-xs font-bold text-foreground">{name}</span>
                          </div>
                        ))}
                      </div>
                    </BentoItem>
                    <BentoItem className="md:col-span-2 bg-[#FFF7D1] dark:bg-zinc-800/60">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="text-3xl font-black text-foreground">Mobile & Business</div>
                          <p className="font-bold text-foreground/60">Android, Firebase, Slack, Jira</p>
                        </div>
                        <Sparkles size={36} className="text-foreground/20 shrink-0" />
                      </div>
                      <div className="flex flex-wrap gap-3 mt-auto">
                        {['Android Studio', 'Firebase', 'MongoDB', 'PostgreSQL', 'Slack', 'Jira'].map((name) => (
                          <div key={name} className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-zinc-700/70 rounded-xl border border-black/10 dark:border-zinc-600">
                            <TechIconSVG name={name} className="w-5 h-5" />
                            <span className="text-xs font-bold text-foreground">{name}</span>
                          </div>
                        ))}
                      </div>
                    </BentoItem>
                  </div>
                </Container>
              </section>
            </LazySection>
          );
        }

        if (sectionKey === "cta" && isSectionEnabled("cta")) {
          return (
            <LazySection key={sectionKey} placeholderMinHeight="500px" className="bg-bg">
              <section className="py-16 bg-bg overflow-hidden">
                <Container>
                  <div className="bg-wati-yellow border-4 border-black rounded-[3rem] p-8 sm:p-14 relative overflow-hidden shadow-[12px_12px_0px_0px_#1D1D1B]">
                    <div className="absolute -top-10 -right-10 text-black/10 rotate-12">
                      <Zap size={300} />
                    </div>
                    <div className="relative z-10 max-w-3xl">
                      <div className="inline-block px-4 py-2 bg-black text-white font-bold uppercase tracking-widest rounded-lg mb-6">
                        Ready to Scale?
                      </div>
                      <h2 className="text-5xl sm:text-7xl font-black text-black mb-8 leading-[0.9]">
                        Stop wrestling with legacy code.
                      </h2>
                      <p className="text-2xl font-bold text-black/70 mb-12">Start building the future of your business with a partner that understands performance.</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button href="/contact" className="h-16 px-10 text-xl bg-white text-black border-2 border-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                          Schedule Consultation
                        </Button>
                        <Button href={site.whatsappLink} variant="ghost" className="h-16 px-10 text-xl border-2 border-black text-black hover:bg-black/5">
                          Chat on WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>
                </Container>
                <Container className="mt-24">
                  <div className="text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 text-xs font-bold uppercase tracking-widest text-foreground/60 mb-12">
                      Powered by Modern Tech
                    </div>
                    <div className="flex flex-col gap-10 opacity-80 hover:opacity-100 transition-opacity">
                      <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-8">
                        <TechItem name="React" color="#61DAFB" />
                        <TechItem name="Next.js" color="currentColor" />
                        <TechItem name="TypeScript" color="#3178C6" />
                        <TechItem name="Node.js" color="#339933" />
                        <TechItem name="Python" color="#3776AB" />
                        <TechItem name="Golang" color="#00ADD8" />
                      </div>
                      <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-8">
                        <TechItem name="AWS" color="#FF9900" />
                        <TechItem name="Google Cloud" color="#4285F4" />
                        <TechItem name="Docker" color="#2496ED" />
                        <TechItem name="Vercel" color="currentColor" />
                        <TechItem name="Git" color="#F05032" />
                        <TechItem name="PostgreSQL" color="#4169E1" />
                        <TechItem name="MongoDB" color="#47A248" />
                      </div>
                      <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-8">
                        <TechItem name="TensorFlow" color="#FF6F00" />
                        <TechItem name="PyTorch" color="#EE4C2C" />
                        <TechItem name="OpenCV" color="#5C3EE8" />
                        <TechItem name="FastAPI" color="#009688" />
                        <TechItem name="Selenium" color="#43B02A" />
                      </div>
                    </div>
                  </div>
                </Container>
              </section>
            </LazySection>
          );
        }

        return null;
      })}

      {bottomSectionOrder.map((sectionKey) => {
        if (sectionKey === "trusted-by" && isSectionEnabled("trusted-by")) {
          return (
            <LazySection key={sectionKey} placeholderMinHeight="200px" className="bg-bg">
              <Suspense fallback={null}>
                <ClientsMarquee />
              </Suspense>
            </LazySection>
          );
        }

        if (sectionKey === "testimonials" && isSectionEnabled("testimonials")) {
          return (
            <LazySection key={sectionKey} placeholderMinHeight="520px" className="bg-bg">
              <Suspense fallback={null}>
                <Testimonials />
              </Suspense>
            </LazySection>
          );
        }

        if (sectionKey === "academy" && isSectionEnabled("academy")) {
          return (
            <LazySection key={sectionKey} placeholderMinHeight="500px" className="bg-bg">
              <Suspense fallback={null}>
                <AcademySection />
              </Suspense>
            </LazySection>
          );
        }

        return null;
      })}
    </main>
  );
}
