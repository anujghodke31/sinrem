import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

const EXIT_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const ENTER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PreloaderProps {
  onLoadingComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');

  useEffect(() => {
    // Logo enters (0.6s) → hold (0.4s) → glitch (0.3s) → scan (0.5s) → exit
    const holdTimer = setTimeout(() => setPhase('hold'), 600);
    const exitTimer = setTimeout(() => setPhase('exit'), 1800);
    const completeTimer = setTimeout(() => onLoadingComplete(), 2400);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, ease: EXIT_EASE } }}
    >
      {/* Top half */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#0a0a0a]"
        animate={phase === 'exit' ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 0.5, ease: EXIT_EASE }}
      />
      {/* Bottom half */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0a0a0a]"
        animate={phase === 'exit' ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 0.5, ease: EXIT_EASE }}
      />

      {/* Centered logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={
          phase === 'exit'
            ? { scale: 1.1, opacity: 0 }
            : phase === 'hold'
            ? { scale: 1, opacity: 1, x: [0, -4, 4, -3, 0], transition: { x: { duration: 0.24, ease: 'linear' } } }
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 0.6, ease: ENTER_EASE }}
      >
        {/* Glow */}
        <div className="absolute inset-0 blur-3xl bg-wati-green/20 rounded-full scale-150" />

        {/* Logo */}
        <div className="relative h-16 sm:h-20">
          <Logo className="h-full w-auto text-white drop-shadow-[0_0_30px_rgba(0,229,153,0.4)]" />
        </div>

        {/* Brand text */}
        <motion.div
          className="mt-4 text-xs sm:text-sm tracking-[0.4em] uppercase text-white/60 font-mono"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Sinrem Tech
        </motion.div>

        {/* Scan line */}
        {phase === 'hold' && (
          <motion.div
            className="absolute left-0 right-0 h-px bg-wati-green/60"
            initial={{ top: 0, scaleY: 0 }}
            animate={{ top: '100%', scaleY: 1 }}
            transition={{ duration: 0.5, ease: 'linear', delay: 0.2 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};
