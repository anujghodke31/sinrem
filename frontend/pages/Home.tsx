
import React, { useRef } from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2, Zap, Layers, Shield, Sparkles, Box, LayoutGrid, Terminal } from "lucide-react";
import { motion, useScroll, useSpring, useTransform, useVelocity, useAnimationFrame, useMotionValue } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HorizontalScrollShowcase } from "../components/ui/HorizontalScrollShowcase";
import { useProjects } from "../lib/api";
import { products } from "../lib/content";
import { cn } from "../lib/cn";
import { useAi } from "../context/AiContext";
import { TechIconSVG } from "../components/ui/TechIcons";
import ShapeGrid from "../components/ui/ShapeGrid";
import MagicBento from "../components/ui/MagicBento";

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
      "absolute flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full border-2 border-black shadow-[4px_4px_0px_0px_#1D1D1B] z-20",
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
         className="relative bg-white p-4 pb-16 border-2 border-black shadow-[8px_8px_0px_0px_#1D1D1B] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-0"
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
                     <span key={i} className="px-2 py-1 text-[10px] uppercase font-bold border border-black rounded-md bg-wati-yellow/50">
                       {tag.split(' ')[0]}
                     </span>
                   ))}
                </div>
                <h3 className="text-2xl font-black text-black leading-tight mb-1">{project.company}</h3>
                <p className="text-sm font-medium text-gray-500 line-clamp-1">{project.title}</p>
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
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v: number) => `${wrap(-20, -45, v)}%`);
  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
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
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap bg-wati-yellow border-y-4 border-black py-4 -rotate-1 scale-105 z-10 relative">
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
  <div className={cn("bg-white border-2 border-black p-6 rounded-2xl shadow-hard flex flex-col relative overflow-hidden group", className)}>
    {title && <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{title}</div>}
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
       <span className="text-sm sm:text-base font-bold text-gray-500 transition-colors duration-300 group-hover:text-black dark:group-hover:text-white">
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
  const { openChat } = useAi();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const { projects, loading } = useProjects();

  return (
    <main className="bg-white text-black">
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-wati-green origin-left z-[100]" style={{ scaleX }} />

      {/* 1. Hero Section - Graph Paper & Stickers */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20 pb-20 bg-white dark:bg-[#121212] transition-colors duration-300">
        
        {/* Animated ShapeGrid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.2] dark:opacity-[0.1]">
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
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" className="w-8 h-8 md:w-10 md:h-10" alt="React"/>
           </Sticker>
           {/* Bottom Left - AWS */}
           <Sticker className="bottom-[20%] left-[8%] md:left-[15%] -rotate-6" delay={0.2}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="AWS"/>
           </Sticker>
           {/* Top Right - Node */}
           <Sticker className="top-[20%] right-[5%] md:right-[12%] -rotate-12" delay={0.3}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" className="w-8 h-8 md:w-10 md:h-10" alt="Node"/>
           </Sticker>
           {/* Bottom Right - Python */}
           <Sticker className="bottom-[25%] right-[10%] md:right-[20%] rotate-6" delay={0.4}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" className="w-8 h-8 md:w-10 md:h-10" alt="Python"/>
           </Sticker>
           </div>
        </div>
        
        <Container className="relative z-10 pointer-events-none">
          <div className="max-w-5xl mx-auto text-center">
            <div className="pointer-events-auto">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-1.5 shadow-[4px_4px_0px_0px_#1D1D1B] mb-8">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-black tracking-wide uppercase">
                  Available for new projects
                </span>
              </div>

              {/* Title with Highlighter Effect */}
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-black dark:text-white leading-[0.9] mb-10 flex flex-col items-center">
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
              <p className="text-xl sm:text-2xl font-bold text-gray-500 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
                Bespoke software solutions. Built for performance, scale, and security. <br className="hidden sm:block"/>
                From websites and e-commerce to SaaS, APIs, and data/AI systems—engineered for scale.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                 <MagneticButton href="/contact">
                    Talk to us <ArrowRight size={20} className="ml-2 inline-block"/>
                 </MagneticButton>
                 <Button href="/services" variant="ghost" className="px-8 py-4 h-auto text-lg rounded-full border-2 border-black bg-white hover:bg-gray-100 dark:border-white dark:text-white dark:bg-[#121212] dark:hover:bg-white/10">
                    Explore services
                 </Button>
              </div>

              {/* Feature Grid - Magic Bento Transition */}
              <div className="mt-24 w-full">
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
              </div>

            </div>
          </div>
        </Container>
      </section>

      {/* 2. Velocity Scroll - Caution Tape */}
      <div className="py-20 bg-white dark:bg-[#121212] overflow-hidden">
        <VelocityScroll baseVelocity={-2}>
           Web Development • Mobile Apps • AI Solutions • Cloud Infrastructure • Cyber Security • UI/UX Design •
        </VelocityScroll>
      </div>

      {/* 2b. Our Products Teaser */}
      <section className="py-20 bg-white dark:bg-[#121212] border-y-2 border-black/5 dark:border-white/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-wati-green" />
                <span className="text-xs font-black uppercase tracking-widest text-wati-green">In-House Products</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
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
                className="group relative rounded-[1.5rem] border-2 border-black bg-white dark:bg-[#161616] shadow-hard hover:shadow-[6px_6px_0px_0px_#1D1D1B] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <div className="h-1" style={{ backgroundColor: product.accent }} />
                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 block">{product.category}</span>
                      <h3 className="text-2xl font-black text-black dark:text-white">{product.name}</h3>
                      <p className="text-sm font-bold mt-0.5" style={{ color: product.accent }}>{product.tagline}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full border-2 border-black/10 dark:border-white/10 text-black/40 dark:text-white/40 shrink-0 ml-3">
                      {product.status}
                    </span>
                  </div>
                  <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed line-clamp-2 mb-5">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((f, fi) => (
                      <span key={fi} className="px-2.5 py-1 text-xs font-bold rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70">
                        {f}
                      </span>
                    ))}
                    {product.features.length > 3 && (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40">
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

      {/* 3. Horizontal Scroll Services */}
      <HorizontalScrollShowcase />

      {/* 4. Featured Work - Polaroid Grid */}
      <section className="py-32 bg-[#f0f0f0] dark:bg-[#1a1a1a] border-y-4 border-black">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
             <div>
                <Badge className="mb-4 bg-wati-blueLight border-black">Selected Works</Badge>
                <h3 className="text-5xl sm:text-6xl font-black text-black dark:text-white tracking-tight">
                  Engineered for <br/>
                  <span className="text-wati-pink underline decoration-4 decoration-black dark:decoration-white underline-offset-4">Impact.</span>
                </h3>
             </div>
             <Button href="/case-studies" variant="secondary" className="border-2 border-black shadow-hard hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
               View All Projects
             </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
             {loading ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-gray-500 font-bold animate-pulse">
                   Loading featured projects...
                </div>
             ) : projects.length === 0 ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-gray-500 font-bold">
                   No featured projects found.
                </div>
             ) : (
               projects.slice(0, 3).map((cs, i) => (
                  <div key={cs.slug} className={cn(i === 1 ? "md:translate-y-16" : "")}>
                     <PolaroidCard project={cs} index={i} />
                  </div>
               ))
             )}
          </div>
        </Container>
      </section>

      {/* 5. Trust / Tech Stack - Bento Grid */}
      <section className="py-32 bg-white dark:bg-[#121212]">
         <Container>
            <div className="text-center mb-20">
               <h2 className="text-5xl sm:text-7xl font-black text-black dark:text-white mb-6">Built on modern foundations.</h2>
               <p className="text-xl font-bold text-gray-500">We don't just write code. We architect systems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
               
               {/* Bento 1: Frontend */}
               <BentoItem className="md:col-span-2 bg-wati-blueLight">
                  <div className="flex justify-between items-start">
                     <div className="space-y-2">
                        <div className="text-3xl font-black">Frontend</div>
                        <p className="font-bold text-black/60">React, Next.js, TypeScript, Tailwind</p>
                     </div>
                     <LayoutGrid size={40} className="text-black/20" />
                  </div>
                  <div className="mt-8 flex gap-4">
                     {/* Decorative pills */}
                     <div className="px-4 py-2 bg-white border-2 border-black rounded-lg shadow-sm font-bold text-sm">SSR</div>
                     <div className="px-4 py-2 bg-white border-2 border-black rounded-lg shadow-sm font-bold text-sm">ISR</div>
                     <div className="px-4 py-2 bg-white border-2 border-black rounded-lg shadow-sm font-bold text-sm">Edge</div>
                  </div>
               </BentoItem>

               {/* Bento 2: Backend */}
               <BentoItem className="bg-wati-greenLight">
                  <div className="space-y-2">
                     <div className="text-3xl font-black">Backend</div>
                     <p className="font-bold text-black/60">Node, Python, Go</p>
                  </div>
                  <div className="mt-8">
                     <Terminal size={60} className="text-black/10 absolute -bottom-4 -right-4 rotate-12" />
                  </div>
               </BentoItem>

               {/* Bento 3: Cloud */}
               <BentoItem className="bg-wati-pinkLight">
                  <div className="space-y-2">
                     <div className="text-3xl font-black">Cloud</div>
                     <p className="font-bold text-black/60">AWS, GCP, Vercel</p>
                  </div>
                  <div className="mt-8 flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500 border border-black"/>
                     <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black"/>
                     <div className="w-3 h-3 rounded-full bg-green-500 border border-black"/>
                  </div>
               </BentoItem>

               {/* Bento 4: AI & Data */}
               <BentoItem className="md:col-span-2 bg-[#FFF7D1]">
                  <div className="flex justify-between items-center">
                     <div>
                        <div className="text-3xl font-black">AI & Data</div>
                        <p className="font-bold text-black/60">TensorFlow, PyTorch, OpenAI</p>
                     </div>
                     <Sparkles size={40} className="text-black/20" />
                  </div>
                  <div className="mt-6 p-4 bg-white/50 border-2 border-black rounded-xl">
                     <code className="text-xs font-mono font-bold">model.predict(user_growth) // Returns 'Exponential'</code>
                  </div>
               </BentoItem>

            </div>
         </Container>
      </section>

      {/* 6. CTA Section - Big Alert */}
      <section className="py-24 bg-white dark:bg-[#121212] overflow-hidden">
         <Container>
            <div className="bg-wati-yellow border-4 border-black rounded-[3rem] p-8 sm:p-20 relative overflow-hidden shadow-[12px_12px_0px_0px_#1D1D1B]">
               
               {/* Decorative Bolt */}
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
                  <p className="text-2xl font-bold text-black/70 mb-12">
                     Start building the future of your business with a partner that understands performance.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button href="/contact" className="h-16 px-10 text-xl bg-white text-black border-2 border-black shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                        Schedule Consultation
                     </Button>
                     <Button onClick={openChat} variant="ghost" className="h-16 px-10 text-xl border-2 border-black text-black hover:bg-black/5">
                        <Sparkles className="mr-2"/> Ask AI Assistant
                     </Button>
                  </div>
               </div>
            </div>
         </Container>

         {/* Powered by Modern Tech Section */}
         <Container className="mt-24">
            <div className="text-center">
               <div className="inline-block px-4 py-1.5 rounded-full border border-black/10 bg-gray-50 text-xs font-bold uppercase tracking-widest text-foreground/50 mb-12">
                  Powered by Modern Tech
               </div>
               
               <div className="flex flex-col gap-10 opacity-80 hover:opacity-100 transition-opacity">
                  {/* Row 1 - 6 Items */}
                  <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-8">
                      <TechItem name="React" color="#61DAFB" />
                      <TechItem name="Next.js" color="currentColor" />
                      <TechItem name="TypeScript" color="#3178C6" />
                      <TechItem name="Node.js" color="#339933" />
                      <TechItem name="Python" color="#3776AB" />
                      <TechItem name="Golang" color="#00ADD8" />
                  </div>
                  
                  {/* Row 2 - 7 Items */}
                  <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-8">
                      <TechItem name="AWS" color="#FF9900" />
                      <TechItem name="Google Cloud" color="#4285F4" />
                      <TechItem name="Docker" color="#2496ED" />
                      <TechItem name="Vercel" color="currentColor" />
                      <TechItem name="Git" color="#F05032" />
                      <TechItem name="PostgreSQL" color="#4169E1" />
                      <TechItem name="MongoDB" color="#47A248" />
                  </div>

                  {/* Row 3 - 5 Items */}
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
    </main>
  );
}
