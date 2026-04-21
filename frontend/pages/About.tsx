import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useInView, animate } from 'framer-motion';
import { useSEO } from '../lib/useSEO';
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { site } from "../lib/site";
import { ArrowRight, Target, Lightbulb, Zap, CheckCircle2, Award, Users } from "lucide-react";
import { cn } from "../lib/cn";

// --- Sub-components ---

const StatCounter: React.FC<{ value: number, label: string, suffix?: string }> = ({ value, label, suffix = "" }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (isInView && nodeRef.current) {
      const node = nodeRef.current;
      const controls = animate(0, value, {
        duration: 2,
        onUpdate(value) {
          node.textContent = Math.round(value) + suffix;
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value, suffix]);

  return (
    <div className="text-center p-6 rounded-2xl bg-white dark:bg-card border-2 border-wati-dark dark:border-brand-500 shadow-hard dark:shadow-[4px_4px_0px_0px_#00E785] transition-colors">
      <div ref={nodeRef} className="text-4xl sm:text-5xl font-bold text-wati-dark dark:text-white mb-2 tabular-nums">0</div>
      <div className="text-sm font-bold text-foreground/70 dark:text-foreground/60 uppercase tracking-wider">{label}</div>
    </div>
  )
}

const VisionMissionSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-bg border-b-2 border-wati-dark/10 dark:border-white/10">
      <Container>
        {/* Restoring the LG:GRID-COLS-3 layout where Vision is 2 cols and Mission is 1 col */}
        <div className="grid lg:grid-cols-3 gap-8 h-auto lg:h-[500px]">
          
          {/* Vision - Large Card (Col Span 2) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
                "lg:col-span-2 relative group overflow-hidden rounded-[30px] border-2 p-8 sm:p-12 flex flex-col justify-end transition-all duration-300",
                // Light Mode: Wati Blue Light background, Black Border, Hard Black Shadow
                "bg-[#E3F5FF] border-wati-dark shadow-hard",
                // Dark Mode: Dark Background, Neon Green Border, Neon Green Shadow
                "dark:bg-[#121212] dark:border-brand-500 dark:shadow-[6px_6px_0px_0px_#00E785]",
                "hover:-translate-y-1"
            )}
          >
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-brand-500/10 rounded-full blur-[80px] pointer-events-none" />
             
             {/* Icon */}
             <div className="absolute top-8 right-8 sm:top-12 sm:right-12 p-4 bg-white dark:bg-brand-500/20 border-2 border-wati-dark dark:border-brand-500 rounded-2xl text-wati-dark dark:text-brand-500 shadow-sm z-10">
                <Target size={48} />
             </div>

             <div className="relative z-10">
                <div className="text-sm font-bold text-wati-blue dark:text-brand-400 uppercase tracking-widest mb-4">Our Vision</div>
                <h3 className="text-3xl sm:text-4xl font-bold text-wati-dark dark:text-white mb-6">
                   To engineer intelligent software that redefines the future.
                </h3>
                <p className="text-lg text-wati-dark dark:text-gray-100 max-w-xl leading-relaxed font-medium">
                   We envision a world where technology is a seamless bridge, turning ambitious ideas into global, tangible reality. We empower businesses with clarity, efficiency, and secure growth.
                </p>
             </div>
          </motion.div>

          {/* Mission - Tall Card (Col Span 1) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={cn(
                "lg:col-span-1 relative group overflow-hidden rounded-[30px] border-2 p-8 sm:p-12 flex flex-col justify-end transition-all duration-300",
                // Light Mode: Wati Pink Light background
                "bg-[#FDECFF] border-wati-dark shadow-hard",
                // Dark Mode: Dark Background, Blue Border, Blue Shadow
                "dark:bg-[#121212] dark:border-wati-blue dark:shadow-[6px_6px_0px_0px_#4FC3FF]",
                "hover:-translate-y-1"
            )}
          >
             {/* Decorative Background Elements */}
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/40 dark:bg-wati-blue/10 rounded-full blur-[60px] pointer-events-none" />

             {/* Icon */}
             <div className="absolute top-8 right-8 sm:top-12 sm:right-12 p-4 bg-white dark:bg-wati-blue/20 border-2 border-wati-dark dark:border-wati-blue rounded-2xl text-wati-dark dark:text-wati-blue shadow-sm z-10">
                <Lightbulb size={32} />
             </div>

             <div className="relative z-10">
                <div className="text-sm font-bold text-wati-pink dark:text-wati-blue uppercase tracking-widest mb-4">Our Mission</div>
                <h3 className="text-2xl font-bold text-wati-dark dark:text-white mb-4">
                   Crafting bespoke excellence.
                </h3>
                <p className="text-base text-wati-dark dark:text-gray-100 leading-relaxed font-medium">
                   We pioneer by embracing cutting-edge technologies. Our goal is to transform your operational landscape and deliver competitive advantages.
                </p>
             </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

const StatsSection: React.FC = () => {
  const years = new Date().getFullYear() - site.established;
  
  return (
    <section className="py-20 bg-wati-blueLight dark:bg-zinc-900 border-y-2 border-wati-dark dark:border-white/10">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           <StatCounter value={years} label="Years Experience" suffix="+" />
           <StatCounter value={20} label="Projects Delivered" suffix="+" />
           <StatCounter value={100} label="Uptime Reliability" suffix="%" />
           <StatCounter value={365} label="Support Coverage" suffix=" Days" />
           <StatCounter value={100} label="Recurring Clients" suffix="%" />
        </div>
      </Container>
    </section>
  )
}

const ProcessStep: React.FC<{ step: { title: string, desc: string }, index: number }> = ({ step, index }) => {
  // Wati Color Cycle: Blue -> Green -> Pink -> Yellow
  // Updated for dark mode support
  const colors = [
    "bg-wati-blueLight dark:bg-[#1A1A1A] dark:border-wati-blue",
    "bg-wati-greenLight dark:bg-[#1A1A1A] dark:border-wati-green",
    "bg-wati-pinkLight dark:bg-[#1A1A1A] dark:border-wati-pink",
    "bg-[#FFF7D1] dark:bg-[#1A1A1A] dark:border-wati-yellow" 
  ];
  
  const bgColor = colors[index % colors.length];
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative flex items-center mb-12 md:justify-between",
        isEven ? "md:flex-row-reverse" : "md:flex-row"
      )}
    >
       {/* Desktop Spacer */}
       <div className="hidden md:block w-5/12" />

       {/* Center Node (Timeline Marker) */}
       <div className={cn(
           "absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 z-10 flex items-center justify-center font-black text-lg shadow-hard",
           "bg-white border-wati-dark text-wati-dark",
           "dark:bg-zinc-900 dark:border-brand-500 dark:text-brand-500 dark:shadow-[4px_4px_0px_0px_#00E785]" // Dark mode styles
       )}>
          {index + 1}
       </div>

       {/* Content Card */}
       <div className={cn(
         "w-[calc(100%-4rem)] ml-20 md:ml-0 md:w-5/12 p-8 rounded-3xl border-2 shadow-hard relative",
         "border-wati-dark text-wati-dark",
         "dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] dark:text-white", // Dark mode override
         bgColor
       )}>
          {/* Decorative Connector Line */}
          <div className={cn(
            "hidden md:block absolute top-1/2 -translate-y-1/2 w-8 h-0.5",
            isEven ? "-right-8" : "-left-8",
            "bg-wati-dark dark:bg-brand-500" // High contrast connector in dark mode
          )} />

          <h4 className="text-2xl font-bold mb-3">{step.title}</h4>
          <p className="text-base font-medium text-wati-dark dark:text-gray-200 leading-relaxed">{step.desc}</p>
       </div>
    </motion.div>
  )
}

const ProcessSection: React.FC = () => {
  const steps = [
    { title: "Discover", desc: "We deep dive into your goals, workflows, and constraints. No assumptions, just data." },
    { title: "Design", desc: "Architecting a solution that fits your scale and budget. We create the blueprint." },
    { title: "Build", desc: "Agile development with a focus on security and performance. Code that lasts." },
    { title: "Deploy & Support", desc: "Reliable launch, proactive monitoring, and 24/7 ongoing improvements." },
  ];

  return (
    <section className="py-24 sm:py-32 bg-bg overflow-hidden">
      <Container>
         <div className="mb-20 md:text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-3">The Process</h2>
            <h3 className="text-4xl font-bold text-text mb-6">From concept to code to scale.</h3>
            <p className="text-lg text-foreground/70">A predictable, transparent workflow designed to mitigate risk.</p>
         </div>

         <div className="relative max-w-5xl mx-auto">
            {/* Center Timeline Line */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 rounded-full bg-wati-dark/20 dark:bg-white/20" />
            
            {steps.map((step, i) => (
                <ProcessStep key={i} step={step} index={i} />
            ))}
         </div>
      </Container>
    </section>
  )
}

const CultureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => {
  return (
    <div className="p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-wati-dark/20 dark:border-white/20 hover:bg-white dark:hover:bg-white/10 hover:border-wati-dark dark:hover:border-white/50 transition-all">
       <div className="text-wati-dark dark:text-white mb-2">{icon}</div>
       <div className="font-bold text-wati-dark dark:text-white">{title}</div>
       <div className="text-sm text-wati-dark/70 dark:text-gray-400 font-medium">{desc}</div>
    </div>
  )
}

// --- Main Page Component ---

export default function AboutPage() {
  useSEO({
    title: "About Us | Sinrem Tech",
    description: "Learn about Sinrem Tech, our mission, recurring client trust, and the engineering-first approach we use to deliver scalable AI-ready software systems.",
    path: "/about",
  });
  // Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative bg-bg overflow-hidden transition-colors duration-300">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-20 right-0 w-64 h-64 bg-wati-green rounded-full blur-[100px] opacity-20 pointer-events-none" />
         <div className="absolute bottom-20 left-0 w-64 h-64 bg-wati-blue rounded-full blur-[100px] opacity-20 pointer-events-none" />
         
         <Container className="relative z-10">
            <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge className="mb-8 scale-110">Since {site.established}</Badge>
                  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-text leading-[1.05] mb-8">
                      We build the <span className="relative inline-block">
                        <span className="relative z-10">invisible engine</span>
                        <span className="absolute bottom-2 left-0 w-full h-4 bg-wati-green/40 -z-0 skew-x-12"></span>
                      </span> that powers your growth.
                  </h1>
                  <p className="text-xl sm:text-2xl text-foreground/70 leading-relaxed max-w-2xl mx-auto">
                      Sharadchandra Techventures isn't just a dev shop. We are your strategic technical partner, turning complex constraints into elegant, scalable software.
                  </p>
                </motion.div>
            </div>
         </Container>
      </section>

      {/* Stats Section with Animated Counters */}
      <StatsSection />

      {/* Vision & Mission (Restored 2:1 Layout with Enhanced Aesthetic) */}
      <VisionMissionSection />

      {/* Team / Culture / CTA - The "Built on Clarity" Panel */}
      <section className="py-24 sm:py-32 relative">
        <Container>
          {/* This is the Wati Yellow style panel - Enhanced for Dark Mode */}
          <div className="bg-[#FFF6DC] dark:bg-yellow-900/20 border-r-[6px] border-b-[6px] border-2 border-wati-yellow dark:border-yellow-600 rounded-[30px] p-8 sm:p-16 overflow-hidden relative shadow-sm transition-colors">
             
             <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-wati-dark dark:text-white">
                <div>
                   <div className="inline-block px-4 py-2 bg-wati-yellow text-wati-dark border-2 border-wati-dark rounded-full text-sm font-bold mb-6 shadow-hard dark:shadow-none">
                      Our Promise
                   </div>
                   <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">Built on clarity, execution, and trust.</h2>
                   <p className="text-lg font-medium text-wati-dark/90 dark:text-white/90 mb-8 leading-relaxed">
                      We don't hide behind jargon. We believe in transparent partnerships where you own your code, your data, and your future. No lock-ins, just results.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4">
                      <Button href="/contact" className="px-8 py-4 h-auto text-base">
                        Start a conversation <ArrowRight size={18} />
                      </Button>
                      <Button href={`mailto:${site.email}`} variant="secondary" className="px-8 py-4 h-auto text-base">
                         Email us directly
                      </Button>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-4 translate-y-8">
                      <CultureCard icon={<Users className="w-8 h-8"/>} title="Partner-First" desc="Your goals are our KPIs." />
                      <CultureCard icon={<Award className="w-8 h-8"/>} title="Excellence" desc="Code that scales." />
                   </div>
                   <div className="space-y-4">
                      <CultureCard icon={<Zap className="w-8 h-8"/>} title="Agility" desc="Fast, iterative delivery." />
                      <CultureCard icon={<CheckCircle2 className="w-8 h-8"/>} title="Reliability" desc="24/7 Support mindset." />
                   </div>
                </div>
             </div>
          </div>
        </Container>
      </section>
    </main>
  );
}