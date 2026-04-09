import React from 'react';
import { motion, useReducedMotion } from "framer-motion";

export function HeroSignal() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <svg viewBox="0 0 720 420" className="w-full h-auto">
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#25F5B5" stopOpacity="0.9" />
            <stop offset="1" stopColor="#0EDBA0" stopOpacity="0.55" />
          </linearGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <circle cx="520" cy="90" r="70" fill="url(#g)" opacity="0.1" filter="url(#blur)" />
        <circle cx="200" cy="320" r="90" fill="url(#g)" opacity="0.08" filter="url(#blur)" />

        <rect x="90" y="80" width="540" height="270" rx="26" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />

        {/* “Chat / pipeline” lanes */}
        {[
          { y: 150, w: 420 },
          { y: 200, w: 480 },
          { y: 250, w: 360 },
        ].map((row, i) => (
          <g key={i} opacity="0.8">
            <rect x="140" y={row.y} width={row.w} height="14" rx="7" fill="rgba(120,120,120,0.1)" />
          </g>
        ))}

        {/* Animated signal path */}
        <motion.path
          d="M140 140 C 260 110, 320 190, 430 170 S 560 200, 590 150"
          fill="none"
          stroke="url(#g)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0.6 }}
          animate={reduce ? {} : { pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        <motion.circle
          cx="590"
          cy="150"
          r="6"
          fill="#25F5B5"
          initial={reduce ? false : { opacity: 0.4, scale: 0.9 }}
          animate={reduce ? {} : { opacity: [0.35, 1, 0.35], scale: [0.95, 1.2, 0.95] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating accent dots */}
        {[{ x: 170, y: 120 }, { x: 520, y: 290 }, { x: 260, y: 300 }].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="rgba(37,245,181,0.9)"
            initial={reduce ? false : { y: 0, opacity: 0.5 }}
            animate={reduce ? {} : { y: [0, -10, 0], opacity: [0.45, 0.9, 0.45] }}
            transition={{ duration: 3.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}