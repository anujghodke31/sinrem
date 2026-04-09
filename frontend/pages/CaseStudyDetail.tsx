import React, { useRef } from 'react';
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { useProjects } from "../lib/api";
import { ArrowLeft, ArrowRight, Check, Quote, Zap, Layers, Box } from "lucide-react";
import { cn } from "../lib/cn";
import { 
  IndustrialVisual, 
  BlueprintVisual, 
  NetworkVisual, 
  OrganicVisual 
} from "../components/animated/ProjectVisuals";

// --- Theme Configurations ---

type ThemeConfig = {
  name: string;
  colors: {
    lightBg: string;      // Pastel BG for light mode cards
    solid: string;        // Solid brand color (for buttons/stickers)
    border: string;       // Border color class
    text: string;         // Text color class
    shadow: string;       // Light mode shadow
    darkBorder: string;   // Dark mode neon border
    darkShadow: string;   // Dark mode neon shadow
    darkText: string;     // Dark mode text highlight
  };
  icon: React.ReactNode;
};

const THEMES: Record<string, ThemeConfig> = {
  "shree-metal-industries": {
    name: "Green",
    colors: {
      lightBg: "bg-wati-greenLight",
      solid: "bg-wati-green",
      border: "border-wati-dark",
      text: "text-wati-dark",
      shadow: "shadow-hard",
      darkBorder: "dark:border-wati-green",
      darkShadow: "dark:shadow-[6px_6px_0px_0px_#00E785]",
      darkText: "dark:text-wati-green",
    },
    icon: <Zap size={24} />,
  },
  "cvk-engineers": {
    name: "Blue",
    colors: {
      lightBg: "bg-wati-blueLight",
      solid: "bg-wati-blue",
      border: "border-wati-dark",
      text: "text-wati-dark",
      shadow: "shadow-hard",
      darkBorder: "dark:border-wati-blue",
      darkShadow: "dark:shadow-[6px_6px_0px_0px_#4FC3FF]",
      darkText: "dark:text-wati-blue",
    },
    icon: <Layers size={24} />,
  },
  "c4i4-technical-manual": {
    name: "Pink",
    colors: {
      lightBg: "bg-wati-pinkLight",
      solid: "bg-wati-pink",
      border: "border-wati-dark",
      text: "text-wati-dark",
      shadow: "shadow-hard",
      darkBorder: "dark:border-wati-pink",
      darkShadow: "dark:shadow-[6px_6px_0px_0px_#F9B4FF]",
      darkText: "dark:text-wati-pink",
    },
    icon: <Box size={24} />,
  },
  "house-of-amrth-visuals": {
    name: "Yellow",
    colors: {
      lightBg: "bg-[#FFF7D1]",
      solid: "bg-wati-yellow",
      border: "border-wati-dark",
      text: "text-wati-dark",
      shadow: "shadow-hard",
      darkBorder: "dark:border-wati-yellow",
      darkShadow: "dark:shadow-[6px_6px_0px_0px_#FFE96E]",
      darkText: "dark:text-wati-yellow",
    },
    icon: <Zap size={24} />,
  },
};

// Fallback theme
const DEFAULT_THEME: ThemeConfig = THEMES["shree-metal-industries"];

// Map slugs to visuals
const visualMap: Record<string, React.ReactNode> = {
  "shree-metal-industries": <IndustrialVisual />,
  "cvk-engineers": <BlueprintVisual />,
  "c4i4-technical-manual": <NetworkVisual />,
  "house-of-amrth-visuals": <OrganicVisual />,
};

// --- Sub-component ---

const StrategyCard: React.FC<{ index: number, total: number, content: string, theme: ThemeConfig }> = ({ index, total, content, theme }) => {
  return (
    <div className="flex gap-6 md:gap-10 relative">
      
      {/* 1. Timeline Column */}
      <div className="flex flex-col items-center shrink-0 relative">
         
         {/* Connecting Line (Draws BEHIND the number node) */}
         {index !== total - 1 && (
           <div className={cn(
             "absolute top-10 bottom-[-3rem] w-0.5 -translate-x-1/2 left-1/2 z-0",
             "bg-wati-dark/20 dark:bg-white/20"
           )} />
         )}

         {/* Number Node */}
         <div className={cn(
           "relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center text-2xl md:text-3xl font-black bg-bg transition-colors",
           "border-wati-dark text-wati-dark", // Light Mode Defaults
           theme.colors.darkBorder, theme.colors.darkText // Dark Mode Overrides
         )}>
            <span>0{index + 1}</span>
         </div>
      </div>

      {/* 2. Content Column */}
      <div className="flex-1 pb-12 md:pb-20"> {/* Padding bottom creates the vertical gap */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            "relative p-8 sm:p-10 rounded-[2rem] border-2 transition-all hover:-translate-y-1 group",
            // Light Mode Styles
            theme.colors.lightBg,
            "border-wati-dark shadow-hard",
            // Dark Mode Styles
            "dark:bg-[#121212]",
            theme.colors.darkBorder,
            theme.colors.darkShadow
          )}
        >
          {/* Horizontal Connector (Desktop only) */}
          <div className={cn(
              "hidden md:block absolute top-10 -left-10 w-10 h-0.5",
              "bg-wati-dark/20 dark:bg-white/20"
          )} />

          <div className="inline-block px-3 py-1 rounded-full bg-white/50 dark:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-widest mb-4">
               Phase {index + 1}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-text mb-4">Strategic Execution</h3>
          <p className="text-base md:text-lg text-wati-dark/80 dark:text-white/80 font-medium leading-relaxed">
            {content}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// --- Main Component ---

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { projects, loading } = useProjects();
  
  const index = projects.findIndex((c) => c.slug === slug);
  const cs = projects[index];
  const nextCs = projects.length > 0 ? projects[(index + 1) % projects.length] : undefined;

  // Get active theme or fallback
  const theme = THEMES[slug || ""] || DEFAULT_THEME;

  // Scroll animations for Hero
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  if (loading) {
    return (
      <main className="bg-bg min-h-screen flex items-center justify-center">
        <div className="text-xl font-bold animate-pulse text-muted">Loading Case Study...</div>
      </main>
    );
  }

  if (!cs || !nextCs) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="bg-bg overflow-x-hidden transition-colors duration-300">
      
      {/* 1. Hero Section - Themed */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
        
        {/* Background Decorative Blob matching theme */}
        <div className={cn(
          "absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/3",
          theme.colors.solid
        )} />

        <Container className="relative z-10">
          <div className="mb-12">
             <Link to="/case-studies" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 text-sm font-bold uppercase tracking-wide hover:scale-105 transition-transform group shadow-sm">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Portfolio
             </Link>
          </div>
          
          <motion.div
            style={{ opacity, scale }}
            className="max-w-5xl"
          >
            {/* Themed Company Sticker */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider mb-8 border-2 shadow-[4px_4px_0px_0px_#1D1D1B]",
                theme.colors.solid, // Solid Theme BG
                "text-black border-black" // Always black text/border for contrast on these bright colors
              )}
            >
              {theme.icon}
              {cs.company}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-text mb-12 leading-[0.9]"
            >
              {cs.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4 text-sm font-bold"
            >
               {['Strategy', 'Design', 'Development', 'Scale'].map((tag, i) => (
                 <span key={i} className="px-5 py-2.5 rounded-xl bg-muted/5 border-2 border-muted/20 text-muted uppercase tracking-wide">
                   {tag}
                 </span>
               ))}
            </motion.div>
          </motion.div>
        </Container>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted/50 text-xs font-bold uppercase tracking-widest"
        >
          <span>Scroll</span>
          <div className={cn("w-0.5 h-12", theme.colors.solid)} />
        </motion.div>
      </section>

      {/* 2. The Challenge - Wati Yellow Panel (Kept consistent for "Alert/Problem" vibe) */}
      <section className="py-24 sm:py-32 relative">
        <Container>
          <div className="bg-[#FFF6DC] dark:bg-yellow-900/10 border-2 border-wati-dark dark:border-wati-yellow rounded-[3rem] p-8 sm:p-20 shadow-hard dark:shadow-[8px_8px_0px_0px_#FFE96E] transition-all relative overflow-hidden">
             
             {/* Decorative Tape */}
             <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/10 w-32 h-4 rotate-3 rounded-sm" />

             <div className="grid lg:grid-cols-2 gap-16 items-start relative z-10">
                <div>
                  <div className="inline-block px-4 py-1.5 rounded-lg bg-black text-white dark:bg-wati-yellow dark:text-black text-xs font-bold uppercase tracking-widest mb-8">
                     The Challenge
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-bold text-wati-dark dark:text-white leading-[1.1]">
                    {cs.challenge}
                  </h3>
                </div>
                <div className="text-xl font-medium text-wati-dark/80 dark:text-white/80 leading-relaxed space-y-12">
                  <p>
                    Every project begins with a constraint. For {cs.company}, the goal was not just to update a system, 
                    but to fundamentally rethink how they communicate value to their stakeholders in a digital-first world.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-black/5 dark:border-white/10">
                    <div>
                       <div className="text-5xl font-black text-wati-dark dark:text-white mb-2">24/7</div>
                       <div className="text-xs font-bold text-muted uppercase tracking-wider">Operation</div>
                    </div>
                    <div>
                       <div className="text-5xl font-black text-wati-dark dark:text-white mb-2">100%</div>
                       <div className="text-xs font-bold text-muted uppercase tracking-wider">Uptime Goal</div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </Container>
      </section>

      {/* 3. The Solution (Themed Phase Cards) */}
      <section className="py-24 bg-muted/5 border-y-2 border-black/5 dark:border-white/5">
        <Container>
          <div className="mb-24 max-w-3xl">
            <h2 className={cn("text-sm font-bold uppercase tracking-widest mb-6", theme.colors.darkText, "text-brand-600")}>The Approach</h2>
            <p className="text-4xl sm:text-6xl font-black text-text tracking-tight">
              Precision engineering meets <span className={cn("underline decoration-4 underline-offset-4", theme.colors.darkText, "decoration-current opacity-80")}>creative execution.</span>
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {cs.solution.map((sol, i) => (
               <StrategyCard 
                 key={i} 
                 index={i} 
                 total={cs.solution.length} 
                 content={sol} 
                 theme={theme}
               />
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Impact & Testimonial - Themed */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Impact List */}
            <div>
              <h2 className="text-sm font-bold text-muted uppercase tracking-widest mb-10">Key Outcomes</h2>
              <div className="grid gap-6">
                {cs.impact.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-6 group"
                  >
                    <div className={cn(
                      "mt-1 flex items-center justify-center w-8 h-8 rounded-full shrink-0 border-2 transition-colors",
                      "bg-white border-black text-black", // Default
                      // Hover state uses theme color
                      `group-hover:${theme.colors.solid} group-hover:border-black` 
                    )}>
                      <Check size={16} strokeWidth={4} />
                    </div>
                    <div className="text-xl font-bold text-text leading-tight group-hover:opacity-100 opacity-80 transition-opacity">
                      {item}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonial Card - Themed & Brutalist */}
            <div className="relative">
              {/* Background Offset Layer */}
              <div className="absolute inset-0 bg-black translate-x-4 translate-y-4 rounded-[2rem]" />
              
              <div className={cn(
                "relative rounded-[2rem] p-10 sm:p-14 border-2 border-black",
                theme.colors.solid, // Solid Theme Background
                "text-black"
              )}>
                <Quote size={64} className="mb-8 opacity-20 rotate-180" />
                <blockquote className="text-2xl sm:text-3xl font-bold leading-tight mb-10 tracking-tight">
                  "{cs.testimonial}"
                </blockquote>
                <div className="flex items-center gap-4 pt-8 border-t-2 border-black/10">
                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center font-bold text-lg">
                    {cs.attribution.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-lg uppercase tracking-wide">{cs.attribution}</div>
                    <div className="text-sm font-bold opacity-60 uppercase tracking-widest">{cs.company}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* 5. Next Project Footer - Clean Transition */}
      <Link to={`/case-studies/${nextCs.slug}`} className="block relative group overflow-hidden bg-black text-white py-32">
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          theme.colors.solid
        )} />
        
        <Container className="relative z-10 flex flex-col items-center text-center">
          <div className="text-sm font-bold opacity-50 uppercase tracking-widest mb-6">Next Case Study</div>
          <div className="text-5xl sm:text-7xl font-black mb-10 group-hover:scale-105 transition-transform duration-500">
            {nextCs.company}
          </div>
          <div className={cn(
            "inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold text-black transition-all",
            "bg-white group-hover:bg-brand-500" // Button hover effect
          )}>
            View Project <ArrowRight size={20} />
          </div>
        </Container>
      </Link>
    </main>
  );
}