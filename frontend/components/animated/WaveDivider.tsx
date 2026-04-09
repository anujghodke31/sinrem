import React from 'react';
import { motion, useReducedMotion } from "framer-motion";

export function WaveDivider() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="relative -mb-2 mt-10">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-10 w-full opacity-70">
        <motion.path
          d="M0,40 C150,90 350,0 600,40 C850,80 1050,20 1200,60 L1200,120 L0,120 Z"
          fill="rgba(14,219,160,.14)"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? {} : { opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
        <motion.path
          d="M0,55 C180,10 360,110 600,55 C840,0 1020,100 1200,45 L1200,120 L0,120 Z"
          fill="rgba(37,245,181,.10)"
          initial={reduce ? false : { x: -16 }}
          whileInView={reduce ? {} : { x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}