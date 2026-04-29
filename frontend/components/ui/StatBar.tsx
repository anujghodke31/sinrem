import React from 'react';
import { motion } from 'framer-motion';
import { aboutStats } from '../../lib/content';

const StatBar = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-y-2 border-foreground/10 my-12">
    {aboutStats.map((stat, i) => (
      <motion.div
        key={stat.label}
        className="flex flex-col items-center gap-1 text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.1 }}
      >
        <span className="text-4xl font-black text-wati-green">
          {stat.value}
        </span>
        <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
      </motion.div>
    ))}
  </div>
);

export default StatBar;
