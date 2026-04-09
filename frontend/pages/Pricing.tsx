import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { pricing } from "../lib/content";
import { Check, Star } from "lucide-react";
import { cn } from "../lib/cn";

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState(pricing[0].id);
  const activeGroup = pricing.find(p => p.id === activeTab) || pricing[0];

  return (
    <main className="py-16 sm:py-24 bg-bg">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-foreground/60">
            Choose the package that fits your stage of growth. No hidden fees.
          </p>
        </div>

        {/* Tab Slider */}
        <div className="flex justify-center mb-16">
          <div className="bg-white border-2 border-wati-dark shadow-hard p-1.5 rounded-full inline-flex relative overflow-hidden">
            {pricing.map((group) => {
              const isActive = activeTab === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveTab(group.id)}
                  className={cn(
                    "relative px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 z-10",
                    isActive ? "text-text" : "text-muted hover:text-text/80"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 bg-wati-yellow border-2 border-wati-dark rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{group.title.split(' ')[0]} {group.title.includes('Code') ? 'Coded' : ''}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-text">{activeGroup.title}</h2>
                <p className="mt-2 text-foreground/60 max-w-2xl mx-auto">{activeGroup.subtitle}</p>
              </div>

              <div className="grid gap-8 lg:grid-cols-3 items-start px-2">
                {activeGroup.tiers.map((tier, idx) => {
                  // Color Coding Logic
                  // 0 (Silver) -> Growth (Blue)
                  // 1 (Gold) -> Pro (Green)
                  // 2 (Platinum) -> Business (Pink)
                  
                  const isGrowth = idx === 0;
                  const isPro = idx === 1;
                  const isBusiness = idx === 2;

                  return (
                    <div 
                      key={tier.name} 
                      className={cn(
                        "relative flex flex-col h-full rounded-3xl border-2 border-wati-dark p-8 transition-transform duration-300 hover:-translate-y-1",
                        // Force light backgrounds with dark text regardless of theme
                        isGrowth ? "bg-wati-blueLight text-wati-dark" :
                        isPro ? "bg-wati-greenLight text-wati-dark ring-4 ring-wati-green/30" : // Highlight Pro
                        "bg-wati-pinkLight text-wati-dark",
                        isPro ? "scale-105 shadow-[8px_8px_0px_0px_#1D1D1B] z-10" : "shadow-hard"
                      )}
                    >
                      {isPro && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-wati-yellow text-wati-dark border-2 border-wati-dark px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-1 whitespace-nowrap">
                          <Star size={12} fill="currentColor" /> Most Popular
                        </div>
                      )}

                      <div className="mb-6 text-wati-dark">
                        <div className="flex items-center gap-3 mb-4">
                           <div className={cn(
                             "w-12 h-12 rounded-full border-2 border-wati-dark flex items-center justify-center text-wati-dark",
                             isGrowth ? "bg-wati-blue" :
                             isPro ? "bg-wati-green" :
                             "bg-wati-pink"
                           )}>
                              {idx === 0 ? "S" : idx === 1 ? "G" : "P"}
                           </div>
                           <h3 className="text-xl font-bold">{tier.name}</h3>
                        </div>
                        
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black tracking-tight">{tier.price.split(' ')[0]}</span>
                          <span className="text-sm font-bold opacity-70">+ GST</span>
                        </div>
                        <p className="text-xs opacity-60 mt-2 font-medium">per project, one-time</p>
                      </div>

                      <div className="w-full h-0.5 bg-wati-dark/10 mb-6"></div>

                      <ul className="space-y-4 mb-8 flex-1 text-wati-dark">
                        {tier.features.map((f) => (
                          <li key={f} className="flex gap-3 items-start text-sm">
                            <div className={cn(
                              "mt-0.5 rounded-full p-0.5 shrink-0 text-wati-dark",
                              isGrowth ? "bg-wati-blue" :
                              isPro ? "bg-wati-green" :
                              "bg-wati-pink"
                            )}>
                              <Check size={10} strokeWidth={4} />
                            </div>
                            <span className="font-medium opacity-80 leading-snug">{f}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto">
                        <Button 
                          href={`/contact?package=${tier.params}`} 
                          className={cn(
                            "w-full py-4 text-base",
                            // Ensure button colors contrast well with the card background
                            isPro ? "bg-wati-green hover:bg-[#00D075]" : "bg-white hover:bg-gray-50"
                          )}
                          variant={isPro ? 'primary' : 'secondary'}
                        >
                          {tier.cta}
                        </Button>
                        <div className="mt-4 text-center">
                          <a href="/contact" className="text-xs font-bold text-wati-dark/60 underline decoration-2 decoration-wati-dark/20 underline-offset-4 hover:text-wati-dark hover:decoration-wati-dark">
                            Book a demo call
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeGroup.notes?.length ? (
                <div className="mt-16 flex flex-wrap justify-center gap-4">
                  {activeGroup.notes.map((n) => (
                    <div key={n} className="inline-flex items-center gap-2 rounded-xl bg-white border-2 border-wati-dark px-4 py-2 text-sm font-bold shadow-hard text-wati-dark">
                      <span className="w-2 h-2 rounded-full bg-wati-yellow border border-wati-dark"></span>
                      {n}
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </main>
  );
}