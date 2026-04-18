import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CURVE: [number, number, number, number] = [0.76, 0, 0.24, 1]; // Custom cubic-bezier for the wipe

const MAIN_TEXT = "SHARADCHANDRA";
const SUB_TEXT = "Techventures";

interface PreloaderProps {
  onLoadingComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  // Trigger completion callback when progress hits 100
  useEffect(() => {
    if (progress === 100) {
      // Reduced delay after 100% to make it feel snappier
      const timeout = setTimeout(() => {
        onLoadingComplete();
      }, 500); 
      return () => clearTimeout(timeout);
    }
  }, [progress, onLoadingComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 1.2, ease: CURVE } 
      }}
      // Forced dark background (slate-950) instead of semantic 'bg-bg' to ensure dark preloader always
      className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-8 sm:p-20 overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center relative z-10 mix-blend-difference text-white w-full max-w-7xl">
        
        {/* Top Label (Like 'The Syndicate') */}
        <div className="overflow-hidden mb-4 sm:mb-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="font-display font-bold text-xs sm:text-sm tracking-[0.5em] sm:tracking-[1em] uppercase text-brand-500"
          >
            {SUB_TEXT}
          </motion.div>
        </div>

        {/* Main Text (Like 'AVANT') */}
        <div className="flex flex-wrap justify-center gap-0.5 sm:gap-1 overflow-hidden">
          {MAIN_TEXT.split("").map((char, i) => (
            <motion.span
              key={`main-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.2 + (i * 0.05), // Staggered entry
                duration: 0.5,
                ease: "easeOut"
              }}
              className="font-display font-bold text-[8vw] sm:text-[6vw] leading-none tracking-tighter"
            >
              {char}
            </motion.span>
          ))}
        </div>

      </div>

      {/* Footer / Progress Line */}
      <motion.div 
         initial={{ scaleX: 0 }}
         animate={{ scaleX: 1 }}
         transition={{ duration: 1.5, ease: "easeInOut" }}
         // Forced white/20 instead of muted/20 for visibility on dark bg
         className="absolute bottom-20 left-10 right-10 h-px bg-white/20 origin-left"
      />

      {/* Forced text-slate-400 instead of text-muted-foreground for visibility on dark bg */}
      <div className="absolute bottom-10 left-10 flex items-center gap-4 text-[10px] sm:text-xs font-mono font-bold uppercase text-slate-400 tracking-widest mix-blend-difference">
         <div className="tabular-nums">
            {progress}% — 100% Digital Excellence
         </div>
      </div>

      {/* Background Noise/Grain for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise" />
    </motion.div>
  );
}