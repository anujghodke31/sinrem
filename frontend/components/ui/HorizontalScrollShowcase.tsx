
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { serviceCategories } from "../../lib/content";
import { ArrowRight, Code, Globe, Database, Briefcase, Cloud, CreditCard, ShieldCheck, Cpu } from "lucide-react";
import { Link } from 'react-router-dom';
import { cn } from "../../lib/cn";

// 8 Distinct Pastel Colors for Wati Aesthetic
const CARD_THEMES = [
  { bg: "bg-wati-blueLight", border: "border-wati-blue", text: "text-wati-blue", shadow: "shadow-[8px_8px_0px_0px_#4FC3FF]" },
  { bg: "bg-wati-greenLight", border: "border-wati-green", text: "text-wati-green", shadow: "shadow-[8px_8px_0px_0px_#00E785]" },
  { bg: "bg-wati-pinkLight", border: "border-wati-pink", text: "text-wati-pink", shadow: "shadow-[8px_8px_0px_0px_#F9B4FF]" },
  { bg: "bg-[#FFF7D1]", border: "border-wati-yellow", text: "text-wati-dark", shadow: "shadow-[8px_8px_0px_0px_#FFE96E]" },
  { bg: "bg-[#E0E7FF]", border: "border-indigo-400", text: "text-indigo-600", shadow: "shadow-[8px_8px_0px_0px_#818CF8]" },
  { bg: "bg-[#FFEDD5]", border: "border-orange-400", text: "text-orange-600", shadow: "shadow-[8px_8px_0px_0px_#FB923C]" },
  { bg: "bg-[#F3E8FF]", border: "border-purple-400", text: "text-purple-600", shadow: "shadow-[8px_8px_0px_0px_#C084FC]" },
  { bg: "bg-[#CCFBF1]", border: "border-teal-400", text: "text-teal-600", shadow: "shadow-[8px_8px_0px_0px_#2DD4BF]" },
];

const iconMap: Record<string, React.ReactNode> = {
  "software-engineering": <Code className="w-8 h-8" />,
  "web-digital": <Globe className="w-8 h-8" />,
  "data-ai": <Database className="w-8 h-8" />,
  "ops-productivity": <Briefcase className="w-8 h-8" />,
  "cloud-infra": <Cloud className="w-8 h-8" />,
  "payments": <CreditCard className="w-8 h-8" />,
  "security": <ShieldCheck className="w-8 h-8" />,
  "advanced": <Cpu className="w-8 h-8" />,
};

// --- Sub-component ---

const ServiceCard: React.FC<{ service: typeof serviceCategories[0], index: number }> = ({ service, index }) => {
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  return (
    <div className={cn(
        "group relative h-[65vh] w-[85vw] sm:w-[450px] shrink-0 flex flex-col justify-between overflow-hidden rounded-[2rem] border-4 transition-all duration-300 hover:-translate-y-2",
        theme.bg,
        "border-wati-dark", // Always black borders for contrast
        "shadow-hard", // Base hard shadow
        "hover:shadow-[12px_12px_0px_0px_#1D1D1B]" // Deeper shadow on hover
    )}>
      
      {/* Card Header & Content */}
      <div className="p-8 sm:p-10 h-full flex flex-col">
         <div className="flex items-start justify-between mb-6 shrink-0">
           <div className={cn(
             "w-16 h-16 rounded-2xl border-2 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_#1D1D1B]",
             theme.text
           )}>
              {iconMap[service.id]}
           </div>
           <span className="text-6xl font-black text-black/10 font-sans">0{index + 1}</span>
         </div>

         <div className="mb-auto">
            <h3 className="text-3xl sm:text-4xl font-black text-wati-dark mb-4 leading-[1.1] tracking-tight">
                {service.title}
            </h3>
            <p className="text-lg font-bold text-wati-dark/60 leading-snug">
                {service.subtitle}
            </p>
         </div>
         <div className="mt-8">
             <div className="flex flex-wrap gap-2">
                {service.items.slice(0, 3).map((item, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full border border-black/20 bg-white/60 text-xs font-bold text-black backdrop-blur-sm">
                     {item}
                  </span>
                ))}
                {service.items.length > 3 && (
                  <span className="px-3 py-1.5 rounded-full border border-black/20 bg-white/60 text-xs font-bold text-black backdrop-blur-sm">
                     +{service.items.length - 3} more
                  </span>
                )}
             </div>
         </div>
      </div>
    </div>
  );
}

// --- Main Component ---

export function HorizontalScrollShowcase() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-85%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-bg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-12 px-8 sm:px-24 items-center">
          
          {/* Intro Title Card */}
          <div className="flex h-[60vh] w-[80vw] sm:w-[500px] shrink-0 flex-col justify-center p-8">
             <div className="inline-block px-4 py-1.5 rounded-full bg-wati-yellow border-2 border-black text-xs font-black uppercase tracking-widest mb-6 w-fit shadow-[4px_4px_0px_0px_#1D1D1B]">
                The Ecosystem
             </div>
             <h2 className="text-6xl sm:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-8">
               Complete <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-wati-blue to-wati-green">
                 Capabilities.
               </span>
             </h2>
             <p className="text-xl font-bold text-muted max-w-sm leading-relaxed">
               A full deck of engineering services designed to scale your business from zero to one, and one to a billion.
             </p>
             <div className="mt-12 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center bg-white">
                   <ArrowRight size={24} className="animate-bounce" />
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">Scroll Down</span>
             </div>
          </div>

          {/* Service Cards */}
          {serviceCategories.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index} 
            />
          ))}

          {/* End CTA Card */}
          <div className="h-[65vh] w-[85vw] sm:w-[450px] shrink-0 flex items-center justify-center">
             <Link to="/services" className="group relative flex h-full w-full flex-col items-center justify-center rounded-[2rem] bg-black text-white border-4 border-black hover:scale-105 transition-transform duration-300 shadow-hard">
                <div className="w-24 h-24 rounded-full bg-wati-green border-4 border-black flex items-center justify-center text-black mb-8 group-hover:rotate-12 transition-transform">
                   <ArrowRight size={48} />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tight">View All</h3>
                <p className="mt-2 font-bold text-white/50">Services</p>
             </Link>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
