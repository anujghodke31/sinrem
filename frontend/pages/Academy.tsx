import React from "react";
import SEO from "../components/site/SEO";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { academy } from "../lib/content";
import { ArrowRight, GraduationCap, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function AcademyPage() {
  return (
    <main className="bg-bg py-24 sm:py-32">
      <SEO title="Sinrem Academy | Learn. Build. Launch." description="Hands-on courses in AI, design thinking, and business automation. Live cohort programs starting at ₹299." canonical="/academy" />
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={20} className="text-wati-green" />
            <span className="text-xs font-black uppercase tracking-widest text-wati-green">{academy.tagline}</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground mb-4">{academy.headline}</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl">{academy.description}</p>

          <ul className="flex flex-col gap-3 mb-12">
            {academy.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                <span className="w-5 h-5 rounded-full bg-wati-green/10 border border-wati-green/30 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-wati-green" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {academy.courses.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl border-2 border-foreground/10 bg-card p-6 flex flex-col gap-3 hover:border-wati-green/30 transition-colors"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-wati-green">{course.duration}</span>
                <h3 className="text-lg font-black text-foreground">{course.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{course.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {course.highlights.map((h, hi) => (
                    <span key={hi} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10">{h}</span>
                  ))}
                </div>
                <div className="flex items-baseline gap-2 pt-3 border-t border-foreground/10 mt-auto">
                  <span className="text-2xl font-black text-foreground">₹{course.price}</span>
                  <span className="text-xs text-muted-foreground line-through">₹{course.originalPrice}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <Button href="/contact">
            {academy.ctaLabel} <ArrowRight size={16} />
          </Button>
        </div>
      </Container>
    </main>
  );
}
