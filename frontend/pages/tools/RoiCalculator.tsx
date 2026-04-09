import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue, animate } from 'framer-motion';
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../lib/cn";
import { 
  Calculator, AlertTriangle, TrendingDown, Clock, 
  ArrowRight, DollarSign, Activity, Eye, AlertCircle 
} from "lucide-react";

// --- Components ---

// Animated Counter for the "Ticker" effect
const Ticker = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = animate(prevValue.current, value, {
      duration: 0.8,
      ease: "circOut",
      onUpdate(v) {
        node.textContent = Math.round(v).toLocaleString('en-IN');
      },
    });

    prevValue.current = value;
    return () => controls.stop();
  }, [value]);

  return <span ref={ref} />;
};

const SliderControl = ({ 
  label, value, min, max, step, onChange, unit, suffix = "" 
}: { 
  label: string, value: number, min: number, max: number, step: number, 
  onChange: (v: number) => void, unit?: React.ReactNode, suffix?: string 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-4">
        <label className="text-sm font-bold text-muted uppercase tracking-wider">{label}</label>
        <div className="text-xl font-mono font-bold text-text bg-card border border-border px-3 py-1 rounded-lg shadow-sm group-hover:border-brand-500/50 transition-colors">
           {unit} {value.toLocaleString()} {suffix}
        </div>
      </div>
      <div className="relative w-full h-8 flex items-center">
         {/* Custom Track */}
         <div className="absolute w-full h-2 bg-muted/20 rounded-full overflow-hidden">
            <div 
               className="h-full bg-brand-500 transition-all duration-100 ease-out" 
               style={{ width: `${percentage}%` }}
            />
         </div>
         {/* Native Range Input (Invisible but interactive) */}
         <input 
            type="range" min={min} max={max} step={step} value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute w-full h-full opacity-0 cursor-pointer z-10"
         />
         {/* Custom Thumb */}
         <div 
            className="absolute w-6 h-6 bg-white dark:bg-brand-500 rounded-full shadow-lg border-2 border-white pointer-events-none transition-all duration-100 ease-out flex items-center justify-center"
            style={{ left: `calc(${percentage}% - 12px)` }}
         >
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
         </div>
      </div>
    </div>
  );
};

// --- Main Calculator ---

export default function RoiCalculatorPage() {
  // State
  const [loadTime, setLoadTime] = useState(3.5);
  const [visitors, setVisitors] = useState(15000);
  const [ticketValue, setTicketValue] = useState(2500);
  
  // Calculations
  const [metrics, setMetrics] = useState({
     bounceIncrease: 0,
     lostCustomers: 0,
     annualLoss: 0,
     severity: 'low'
  });

  useEffect(() => {
    // Logic based on Google/Akamai studies
    // Baseline: 1s load time. 
    // Every 100ms delay = 0.5% to 1% conv drop (Simplified to ~7% per second relative drop)
    
    // Bounce Rate Multiplier based on load time (Non-linear curve)
    let penalty = 0;
    if (loadTime <= 1) penalty = 0;
    else if (loadTime <= 3) penalty = (loadTime - 1) * 0.15; // 15% drop per sec up to 3s
    else if (loadTime <= 5) penalty = 0.3 + (loadTime - 3) * 0.25; // Accelerate drop
    else penalty = 0.8 + (loadTime - 5) * 0.1; // Cap out eventually
    
    // Cap penalty at 90% (almost no one waits 10s)
    penalty = Math.min(penalty, 0.95);

    // Baseline Conversion (Industry Avg)
    const baseConvRate = 0.025; // 2.5%
    
    // Projected Revenue (Ideal)
    const idealMonthlyRev = visitors * baseConvRate * ticketValue;
    
    // Actual Revenue (With Penalty)
    const actualConvRate = baseConvRate * (1 - penalty);
    const actualMonthlyRev = visitors * actualConvRate * ticketValue;
    
    const monthlyLoss = idealMonthlyRev - actualMonthlyRev;
    const annualLoss = monthlyLoss * 12;

    // Severity
    let sev = 'low';
    if (loadTime > 2.5) sev = 'medium';
    if (loadTime > 4) sev = 'critical';

    setMetrics({
      bounceIncrease: Math.round(penalty * 100),
      lostCustomers: Math.round((visitors * baseConvRate * 12) - (visitors * actualConvRate * 12)),
      annualLoss,
      severity: sev
    });

  }, [loadTime, visitors, ticketValue]);

  // Dynamic Insights
  const getInsight = () => {
    if (loadTime < 1.5) return "You are in the top 10% of the web. Keep it up.";
    if (loadTime < 3) return "You are leaking revenue, but it's fixable.";
    if (loadTime < 5) return "Critical: You are invisible to Google and impulsive buyers.";
    return "Emergency: Your site is actively repelling customers.";
  };

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20 text-text font-sans selection:bg-brand-500/30 overflow-hidden relative">
      <Container>
        
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="flex items-center gap-2 text-red-500 mb-4">
             <div className="relative">
               <div className="absolute inset-0 bg-red-500 animate-ping rounded-full opacity-50" />
               <AlertTriangle size={20} className="relative z-10" />
             </div>
             <span className="text-xs font-bold uppercase tracking-[0.2em]">Revenue Leakage Detector</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-6">
            The True Cost of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Latency.</span>
          </h1>
          <p className="text-xl text-muted leading-relaxed">
            Every second of delay isn't just "slow". It's money leaving your pocket. 
            Use this calculator to quantify exactly how much your load time is costing your business annually.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8 bg-card border border-border p-8 rounded-3xl shadow-sm h-fit">
             <div className="pb-4 border-b border-border mb-4">
                <h3 className="font-bold text-lg">Input Metrics</h3>
                <p className="text-sm text-muted">Adjust based on your analytics.</p>
             </div>

             <SliderControl 
                label="Current Load Time" 
                value={loadTime} 
                min={0.5} max={10} step={0.1} 
                onChange={setLoadTime} 
                suffix="s"
             />

             <SliderControl 
                label="Monthly Visitors" 
                value={visitors} 
                min={1000} max={100000} step={1000} 
                onChange={setVisitors} 
             />

             <SliderControl 
                label="Avg. Ticket Value" 
                value={ticketValue} 
                min={100} max={20000} step={100} 
                onChange={setTicketValue} 
                unit="₹"
             />
             
             <div className="pt-6 mt-6 border-t border-border">
                <div className="flex items-start gap-4 p-4 bg-muted/5 rounded-xl border border-border/50">
                   <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
                      <Eye size={18} />
                   </div>
                   <div>
                      <div className="text-xs font-bold uppercase text-muted mb-1">Analysis</div>
                      <p className="text-sm font-medium text-text">{getInsight()}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 space-y-6">
             
             {/* Main Loss Card */}
             <motion.div 
               layout
               className={cn(
                  "relative p-8 sm:p-12 rounded-[2.5rem] border overflow-hidden transition-colors duration-500 flex flex-col justify-center items-center text-center",
                  metrics.severity === 'critical' ? "bg-red-500/10 border-red-500/50" :
                  metrics.severity === 'medium' ? "bg-orange-500/10 border-orange-500/30" :
                  "bg-card border-border"
               )}
             >
                {metrics.severity === 'critical' && (
                  <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
                )}
                
                <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Projected Annual Revenue Loss</h3>
                <div className={cn(
                   "text-5xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tighter mb-4 transition-colors duration-300",
                   metrics.severity === 'critical' ? "text-red-500" :
                   metrics.severity === 'medium' ? "text-orange-500" :
                   "text-text"
                )}>
                   ₹<Ticker value={metrics.annualLoss} />
                </div>
                <div className="text-muted text-lg max-w-md">
                   That's money you are actively earning, but <strong className="text-text">failing to collect</strong> due to UX friction.
                </div>
             </motion.div>

             {/* Secondary Stats */}
             <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-card border border-border p-6 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <TrendingDown size={24} />
                   </div>
                   <div>
                      <div className="text-3xl font-bold text-text">
                         {metrics.bounceIncrease}%
                      </div>
                      <div className="text-xs font-bold text-muted uppercase">Bounce Probability</div>
                   </div>
                </div>
                <div className="bg-card border border-border p-6 rounded-3xl flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Activity size={24} />
                   </div>
                   <div>
                      <div className="text-3xl font-bold text-text">
                         <Ticker value={metrics.lostCustomers} />
                      </div>
                      <div className="text-xs font-bold text-muted uppercase">Lost Customers / Year</div>
                   </div>
                </div>
             </div>

             {/* CTA */}
             <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl p-8 sm:p-10 text-black shadow-xl shadow-brand-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                   <div>
                      <h3 className="text-2xl font-bold mb-2">Stop the bleeding.</h3>
                      <p className="text-black/80 font-medium max-w-sm">
                         We engineer high-performance platforms that capture this revenue.
                      </p>
                   </div>
                   <Button href="/contact" variant="ghost" className="bg-black/20 hover:bg-black/30 text-white border-transparent px-8 py-4 h-auto text-lg rounded-xl">
                      Fix this now <ArrowRight className="ml-2" />
                   </Button>
                </div>
             </div>

          </div>

        </div>

        {/* Psychological Context Cards */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 border-t border-border pt-16">
           <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-red-500">
                 <AlertCircle size={20} />
              </div>
              <h4 className="text-lg font-bold text-text">The "3-Second" Rule</h4>
              <p className="text-sm text-muted leading-relaxed">
                 53% of mobile users abandon a site that takes longer than 3 seconds to load. If you are at 3.5s, you are literally halving your mobile traffic.
              </p>
           </div>
           <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-orange-500">
                 <DollarSign size={20} />
              </div>
              <h4 className="text-lg font-bold text-text">SEO Penalty</h4>
              <p className="text-sm text-muted leading-relaxed">
                 Google uses Core Web Vitals as a ranking factor. Slow sites don't just lose customers; they lose the ability to acquire new ones organically.
              </p>
           </div>
           <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-brand-500">
                 <Activity size={20} />
              </div>
              <h4 className="text-lg font-bold text-text">Compound Effect</h4>
              <p className="text-sm text-muted leading-relaxed">
                 A 1-second delay reduces customer satisfaction by 16%. Dissatisfied customers don't return. The long-term LTV loss is far higher than the calculator shows.
              </p>
           </div>
        </div>

      </Container>
    </main>
  );
}