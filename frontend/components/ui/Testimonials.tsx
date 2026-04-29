import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { testimonials } from '../../lib/content';
import { Container } from './Container';
import { Star } from 'lucide-react';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'text-wati-yellow fill-wati-yellow' : 'text-foreground/10'} />
    ))}
  </div>
);

const Testimonials = () => {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 overflow-hidden">
      <Container className="mb-12">
        <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-3">What Clients Say</h2>
        <p className="text-muted-foreground font-medium">
          Don't take our word for it — hear from the teams we've worked with.
        </p>
      </Container>

      <motion.div ref={constraintsRef} className="overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={constraintsRef}
          className="flex gap-6 px-6 cursor-grab active:cursor-grabbing"
          style={{ width: 'max-content' }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="w-[340px] flex-shrink-0 rounded-2xl border-2 border-foreground/10 bg-card p-8 flex flex-col gap-5 hover:border-wati-green/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <StarRating rating={t.rating} />
                {t.projectTag && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-wati-green bg-wati-green/10 px-2 py-1 rounded-full">
                    {t.projectTag}
                  </span>
                )}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-foreground/10">
                <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-xs font-black text-foreground/50">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        ← drag to scroll →
      </p>
    </section>
  );
};

export default Testimonials;
