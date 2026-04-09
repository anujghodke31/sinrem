import React from 'react';
import { motion } from "framer-motion";

// 1. Industrial / Manufacturing (Shree Metal)
// Concept: Rotating precision rings and structure.
export function IndustrialVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full opacity-75">
        <defs>
          <linearGradient id="metal-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        
        {/* Outer Ring - Slow Rotate */}
        <motion.circle
          cx="200" cy="200" r="140"
          stroke="url(#metal-grad)" strokeWidth="1.5" fill="none"
          strokeDasharray="4 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle Ring - Counter Rotate */}
        <motion.circle
          cx="200" cy="200" r="100"
          stroke="currentColor" strokeWidth="2" fill="none" strokeOpacity="0.35"
          strokeDasharray="40 10"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Gear-ish shape */}
        <motion.path
          d="M200 130 L200 270 M130 200 L270 200 M150 150 L250 250 M150 250 L250 150"
          stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4"
          animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Central Hub */}
        <circle cx="200" cy="200" r="20" fill="currentColor" fillOpacity="0.15" />
        <circle cx="200" cy="200" r="4" fill="currentColor" />
      </svg>
    </div>
  );
}

// 2. Architectural / Engineering (CVK Engineers)
// Concept: Blueprints, isometric grids, drawing lines.
export function BlueprintVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full opacity-80">
        {/* Grid Background */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2"/>
        </pattern>
        <rect width="400" height="400" fill="url(#grid)" />

        {/* Drawing Lines */}
        <motion.path
          d="M 100 300 L 100 100 L 300 100"
          fill="none" stroke="currentColor" strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 100 300 L 300 300 L 300 100"
          fill="none" stroke="currentColor" strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
        />
        
        {/* Floating Measurements/Nodes */}
        {[
          { cx: 100, cy: 100 }, { cx: 300, cy: 100 }, 
          { cx: 300, cy: 300 }, { cx: 100, cy: 300 }
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.cx} cy={p.cy} r="4"
            fill="currentColor"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 1 + (i * 0.2), type: "spring" }}
          />
        ))}

        {/* Scanning Line */}
        <motion.line
          x1="0" y1="0" x2="400" y2="400"
          stroke="currentColor" strokeWidth="1" strokeOpacity="0.2"
          animate={{ y1: [0, 400], x2: [400, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

// 3. AI / Network (C4i4)
// Concept: Nodes, constellations, data flow.
export function NetworkVisual() {
  const points = [
    { x: 200, y: 100 }, { x: 120, y: 240 }, { x: 280, y: 240 },
    { x: 200, y: 200 }, { x: 150, y: 150 }, { x: 250, y: 150 }
  ];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full opacity-80">
        {/* Connections */}
        <motion.g stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.35">
           {points.map((p1, i) => (
             points.map((p2, j) => {
               if (i >= j) return null;
               return (
                 <motion.line
                   key={`${i}-${j}`}
                   x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                   initial={{ pathLength: 0, opacity: 0 }}
                   whileInView={{ pathLength: 1, opacity: 1 }}
                   transition={{ duration: 1.5, delay: Math.random() }}
                 />
               )
             })
           ))}
        </motion.g>

        {/* Nodes */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x} cy={p.y} r="5"
            fill="currentColor"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2 + Math.random(), 
              repeat: Infinity, 
              delay: Math.random() 
            }}
          />
        ))}

        {/* Pulse Ring */}
        <motion.circle
          cx="200" cy="200" r="80"
          stroke="currentColor" strokeWidth="1.5" fill="none"
          animate={{ scale: [0.8, 1.2], opacity: [0.6, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

// 4. Organic / Fluid (House of Amrth)
// Concept: Soft blob, liquid motion.
export function OrganicVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 400 400" className="w-full h-full opacity-70">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>
        
        <g filter="url(#goo)">
          <motion.circle
            cx="200" cy="200" r="80"
            fill="currentColor"
            animate={{ 
              cx: [190, 210, 190],
              cy: [190, 210, 190],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="240" cy="180" r="50"
            fill="currentColor"
            animate={{ 
              cx: [230, 250, 230],
              cy: [170, 190, 170]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.circle
            cx="170" cy="230" r="60"
            fill="currentColor"
            animate={{ 
              cx: [160, 180, 160],
              cy: [220, 240, 220]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </g>
      </svg>
    </div>
  );
}