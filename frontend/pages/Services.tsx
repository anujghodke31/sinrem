import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { serviceCategories } from "../lib/content";
import { 
  ArrowRight, Code, Globe, Database, Briefcase, 
  Cloud, CreditCard, ShieldCheck, Cpu, Sparkles, Check
} from "lucide-react";
import { cn } from "../lib/cn";
import { useAi } from "../context/AiContext";

// Map icons to IDs
const iconMap: Record<string, React.ReactNode> = {
  "software-engineering": <Code className="w-6 h-6" />,
  "web-digital": <Globe className="w-6 h-6" />,
  "data-ai": <Database className="w-6 h-6" />,
  "ops-productivity": <Briefcase className="w-6 h-6" />,
  "cloud-infra": <Cloud className="w-6 h-6" />,
  "payments": <CreditCard className="w-6 h-6" />,
  "security": <ShieldCheck className="w-6 h-6" />,
  "advanced": <Cpu className="w-6 h-6" />,
};

// Wati Aesthetic Theme Cycle
const THEME_CYCLE = [
  { 
    name: "Blue",
    lightBg: "bg-wati-blueLight", 
    border: "border-wati-blue", 
    text: "text-wati-blue", 
    darkBorder: "dark:border-wati-blue",
    shadow: "hover:shadow-[4px_4px_0px_0px_#4FC3FF]" 
  },
  { 
    name: "Green",
    lightBg: "bg-wati-greenLight", 
    border: "border-wati-green", 
    text: "text-wati-green", 
    darkBorder: "dark:border-wati-green",
    shadow: "hover:shadow-[4px_4px_0px_0px_#00E785]" 
  },
  { 
    name: "Pink",
    lightBg: "bg-wati-pinkLight", 
    border: "border-wati-pink", 
    text: "text-wati-pink", 
    darkBorder: "dark:border-wati-pink",
    shadow: "hover:shadow-[4px_4px_0px_0px_#F9B4FF]" 
  },
  { 
    name: "Yellow",
    lightBg: "bg-[#FFF7D1]", 
    border: "border-wati-yellow", 
    text: "text-wati-dark", 
    darkBorder: "dark:border-wati-yellow",
    shadow: "hover:shadow-[4px_4px_0px_0px_#FFE96E]" 
  },
];

export default function ServicesPage() {
  const { openChat } = useAi();
  const { hash } = useLocation();
  const [activeSection, setActiveSection] = useState(serviceCategories[0].id);

  // Handle hash scrolling
  useEffect(() => {
    if (hash) {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(id);
      }
    }
  }, [hash]);

  // Scroll spy effect to update active sidebar link
  useEffect(() => {
    const handleScroll = () => {
      const sections = serviceCategories.map(cat => document.getElementById(cat.id));
      const scrollPosition = window.scrollY + 150; // Offset

      for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative bg-bg transition-colors duration-300">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-brand-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden border-b-2 border-wati-dark/10 dark:border-white/10">
        
        {/* Abstract Blob Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-wati-blue/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <Container className="relative">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-6 scale-110 origin-left">Capabilities</Badge>
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-text mb-8">
                Engineering <br />
                <span className="text-brand-600 dark:text-brand-400 decoration-4 underline decoration-wati-yellow underline-offset-4">
                  Excellence.
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-foreground/70 dark:text-foreground/70 font-medium leading-relaxed max-w-2xl border-l-4 border-foreground/20 pl-6">
                From foundational software to advanced AI systems, we provide the full stack of capabilities required to modernize and scale your enterprise.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Main Content: Sticky Sidebar + Feed */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            
            {/* Sticky Navigation Sidebar */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <nav className="sticky top-28 space-y-2">
                <div className="text-xs font-black text-muted uppercase tracking-widest mb-6 px-3">
                  Service Ecosystem
                </div>
                {serviceCategories.map((cat) => {
                  const isActive = activeSection === cat.id;
                  return (
                    <a
                      key={cat.id}
                      href={`#${cat.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(cat.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        setActiveSection(cat.id);
                      }}
                      className={cn(
                        "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 border-2",
                        isActive 
                          ? "bg-wati-dark text-white border-wati-dark shadow-hard translate-x-2" 
                          : "bg-transparent border-transparent text-foreground/60 hover:text-foreground hover:bg-muted/5 hover:border-muted/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Dot indicator */}
                        <div className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          isActive ? "bg-brand-500" : "bg-muted/30"
                        )} />
                        <span>{cat.title.split(' ')[0]} {cat.title.split(' ')[1]}</span>
                      </div>
                      {isActive && <ArrowRight size={14} className="text-brand-500" />}
                    </a>
                  );
                })}
                
                {/* "Need a custom plan?" Card - Wati Style */}
                <div className="pt-8 px-2">
                  <div className="rounded-[20px] bg-[#FFF6DC] dark:bg-yellow-900/10 border-2 border-wati-dark dark:border-wati-yellow p-6 shadow-hard relative overflow-hidden">
                    <div className="absolute top-2 right-2 text-wati-dark/10">
                        <Sparkles size={40} />
                    </div>
                    <div className="text-sm font-black text-wati-dark dark:text-white mb-2 relative z-10">Need a custom plan?</div>
                    <p className="text-xs font-medium text-wati-dark/70 dark:text-white/70 mb-4 relative z-10">We build specifically for your constraints.</p>
                    <div className="space-y-3 relative z-10">
                       <Button href="/contact" className="w-full text-xs h-10" variant="primary">
                         Book Consultation
                       </Button>
                       <Button 
                         onClick={openChat} 
                         className="w-full text-xs h-10 border-2 border-wati-dark/20 dark:border-white/20 hover:bg-white dark:hover:bg-white/10 transition-colors" 
                         variant="ghost"
                       >
                         Ask AI Assistant
                       </Button>
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            {/* Content Feed */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-24 sm:space-y-32">
              {serviceCategories.map((cat, index) => {
                const theme = THEME_CYCLE[index % THEME_CYCLE.length];
                
                return (
                  <div 
                    key={cat.id} 
                    id={cat.id} 
                    className="scroll-mt-32"
                  >
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10 border-b-2 border-wati-dark/10 dark:border-white/10 pb-8">
                      <div className="flex gap-6">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl border-2 border-wati-dark flex items-center justify-center shadow-hard shrink-0 text-wati-dark",
                          theme.lightBg, // Pastel BG
                          theme.darkBorder, // Neon Border in Dark Mode
                          "dark:bg-transparent dark:text-white"
                        )}>
                          {iconMap[cat.id]}
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-text mb-2">{cat.title}</h2>
                          <p className="text-lg font-medium text-foreground/70">{cat.subtitle}</p>
                        </div>
                      </div>
                      <div className="shrink-0 pt-2">
                        <Button href="/contact" variant="ghost" className="text-sm px-4 h-10 rounded-full border-2 border-wati-dark/20 hover:border-wati-dark hover:bg-transparent">
                          Start Project <ArrowRight size={14} className="ml-2"/>
                        </Button>
                      </div>
                    </div>

                    {/* Grid of Items */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      {cat.items.map((item, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#1A1A1A] border-2 border-wati-dark dark:border-white/20 transition-all duration-300",
                            "hover:-translate-y-1",
                            theme.shadow // Colored Hard Shadow on Hover
                          )}
                        >
                          <div className={cn(
                            "mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-wati-dark",
                            theme.lightBg,
                            theme.text,
                            theme.darkBorder // Neon Border
                          )}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                          <span className="text-base font-bold text-text leading-snug">
                            {item}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Decorative Elements for specific categories */}
                    {cat.id === "software-engineering" && (
                       <div className="mt-8 p-8 rounded-3xl bg-[#1D1D1B] text-white border-2 border-wati-dark relative overflow-hidden shadow-hard">
                          <div className="absolute top-4 right-4 flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500"/>
                             <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                             <div className="w-3 h-3 rounded-full bg-green-500"/>
                          </div>
                          <div className="font-mono text-sm opacity-80 mb-4"># Latest_Tech_Stack.config</div>
                          <div className="flex flex-wrap gap-3">
                            {["React", "Next.js", "Node.js", "Python", "Golang", "AWS", "Docker"].map(t => (
                              <span key={t} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-bold font-mono hover:bg-white/20 transition-colors cursor-default">
                                {t}
                              </span>
                            ))}
                          </div>
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section - Wati Style */}
      <section className="py-24 bg-wati-blueLight dark:bg-blue-900/10 border-t-2 border-wati-dark dark:border-white/10">
        <Container>
           <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-4xl sm:text-5xl font-black text-text mb-8">Ready to upgrade your infrastructure?</h2>
             <p className="text-xl font-medium text-foreground/70 mb-10 max-w-2xl mx-auto">
               Whether you need a simple modernization or a complete digital transformation, we have the team to execute.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Button href="/contact" className="h-14 px-8 text-lg">Start Project</Button>
               <Button href="/case-studies" variant="secondary" className="h-14 px-8 text-lg border-2 border-wati-dark">View Case Studies</Button>
             </div>
           </div>
        </Container>
      </section>
    </main>
  );
}