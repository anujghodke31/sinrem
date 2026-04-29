import React from 'react';
import { motion } from 'framer-motion';
import { academy } from '../../lib/content';
import { Container } from './Container';
import { Button } from './Button';
import { ArrowRight, GraduationCap, Check } from 'lucide-react';

const AcademySection = () => (
  <section className="py-24 bg-bg border-y-2 border-foreground/5">
    <Container>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
        {/* Content */}
        <div className="flex flex-col gap-6">
          <span className="text-xs font-black uppercase tracking-widest text-wati-green">
            {academy.tagline}
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            {academy.headline}
          </h2>
          <p className="text-foreground/70 leading-relaxed font-medium">
            {academy.description}
          </p>
          <ul className="flex flex-col gap-3">
            {academy.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                <span className="w-5 h-5 rounded-full bg-wati-green/10 border border-wati-green/30 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-wati-green" />
                </span>
                {f}
              </li>
            ))}
          </ul>
          <Button href={academy.ctaHref} className="w-fit mt-2">
            {academy.ctaLabel} <ArrowRight size={16} />
          </Button>
        </div>

        {/* Courses grid */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={18} className="text-wati-green" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Upcoming Courses</span>
          </div>
          {academy.courses.map((course) => (
            <motion.div
              key={course.title}
              className="rounded-xl border-2 border-foreground/10 bg-card p-5 flex flex-col gap-2 hover:border-wati-green/30 transition-colors"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-wati-green">
                  {course.duration}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-foreground">₹{course.price}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{course.originalPrice}</span>
                </div>
              </div>
              <h4 className="text-base font-bold text-foreground">{course.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {course.highlights.map((h, i) => (
                  <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10">
                    {h}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

export default AcademySection;
