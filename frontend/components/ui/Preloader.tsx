import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

const CURVE: [number, number, number, number] = [0.76, 0, 0.24, 1]; // Custom cubic-bezier for the wipe

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
      <div className="flex flex-col items-center justify-center relative z-10 text-white w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 blur-2xl bg-brand-500/25 rounded-full" />
          <div className="relative h-16 sm:h-20">
            <Logo className="h-full w-auto text-brand-500" />
          </div>
        </motion.div>
        <div className="mt-4 text-xs sm:text-sm tracking-[0.4em] uppercase text-brand-400">
          Sinrem
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