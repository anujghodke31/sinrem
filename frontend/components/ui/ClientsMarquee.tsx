import React from 'react';
import { motion } from 'framer-motion';
import { clients } from '../../lib/content';

const ClientsMarquee = () => {
  const doubled = [...clients, ...clients];

  return (
    <section className="py-16 overflow-hidden relative">
      <h2 className="text-center text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-10">
        Trusted By
      </h2>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

      <div className="relative flex">
        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 25, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((client, i) => (
            <a
              key={`${client.name}-${i}`}
              href={client.url}
              target={client.url !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
            >
              {/* Text chip fallback — replace with <img> when logos are available */}
              <span className="text-sm font-bold text-foreground/70 px-5 py-2.5 border-2 border-foreground/10 rounded-full whitespace-nowrap hover:border-foreground/30 transition-colors">
                {client.name}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsMarquee;
