import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../lib/cn";
import { site } from "../../lib/site";
import { 
  Cpu, Database, Globe, Server, Cloud, Zap, Trash2, 
  RotateCcw, Share2, AlertTriangle, CheckCircle2, 
  Box, Layers, ArrowRight, Sparkles
} from "lucide-react";

// --- Types & Data ---

type TechCategory = 'frontend' | 'backend' | 'database' | 'infra';

interface TechComponent {
  id: string;
  name: string;
  category: TechCategory;
  complexity: number; // 1-10
  power: number; // Multiplier for user capacity
  cost: number; // Monthly est. cost in USD
  desc: string;
}

const COMPONENTS: TechComponent[] = [
  // Frontend
  { id: 'next', name: 'Next.js', category: 'frontend', complexity: 4, power: 1.5, cost: 0, desc: 'React framework for production.' },
  { id: 'vite', name: 'Vite/React', category: 'frontend', complexity: 2, power: 1.0, cost: 0, desc: 'Fast, lightweight SPA.' },
  { id: 'remix', name: 'Remix', category: 'frontend', complexity: 5, power: 1.4, cost: 0, desc: 'Full stack web framework.' },
  
  // Backend
  { id: 'node', name: 'Node.js', category: 'backend', complexity: 3, power: 1.2, cost: 10, desc: 'Event-driven JS runtime.' },
  { id: 'go', name: 'Golang', category: 'backend', complexity: 7, power: 2.5, cost: 15, desc: 'High concurrency performance.' },
  { id: 'python', name: 'Python', category: 'backend', complexity: 3, power: 1.0, cost: 12, desc: 'Great for AI/ML integration.' },
  
  // Database
  { id: 'postgres', name: 'PostgreSQL', category: 'database', complexity: 5, power: 2.0, cost: 25, desc: 'Reliable relational database.' },
  { id: 'mongo', name: 'MongoDB', category: 'database', complexity: 4, power: 1.8, cost: 20, desc: 'Flexible NoSQL document store.' },
  { id: 'redis', name: 'Redis', category: 'database', complexity: 3, power: 5.0, cost: 15, desc: 'In-memory caching layer.' },
  
  // Infrastructure
  { id: 'aws', name: 'AWS', category: 'infra', complexity: 9, power: 3.0, cost: 50, desc: 'Comprehensive cloud platform.' },
  { id: 'vercel', name: 'Vercel', category: 'infra', complexity: 1, power: 1.2, cost: 20, desc: 'Zero-config deployment.' },
  { id: 'docker', name: 'Docker', category: 'infra', complexity: 6, power: 1.5, cost: 5, desc: 'Containerization standard.' },
];

const CATEGORY_CONFIG: Record<TechCategory, { label: string, color: string, icon: any }> = {
  frontend: { label: 'Frontend', color: 'text-blue-500 border-blue-500/20 bg-blue-500/5', icon: Globe },
  backend: { label: 'Backend', color: 'text-green-500 border-green-500/20 bg-green-500/5', icon: Server },
  database: { label: 'Data', color: 'text-amber-500 border-amber-500/20 bg-amber-500/5', icon: Database },
  infra: { label: 'Infra', color: 'text-purple-500 border-purple-500/20 bg-purple-500/5', icon: Cloud },
};

// --- Sub-components ---

interface ComponentChipProps {
  item: TechComponent;
  onClick: () => void;
  isSelected: boolean;
}

const ComponentChip: React.FC<ComponentChipProps> = ({ item, onClick, isSelected }) => {
  const config = CATEGORY_CONFIG[item.category];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between w-full p-3 rounded-lg border text-left transition-all duration-200",
        isSelected 
          ? cn("bg-card border-brand-500 shadow-[0_0_15px_-3px_rgba(14,219,160,0.3)]", config.color.split(' ')[0]) // Text color of active
          : "bg-card/50 border-border hover:border-brand-500/50 hover:bg-card"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-md transition-colors", isSelected ? "bg-brand-500 text-black" : "bg-muted/10 text-muted-foreground group-hover:text-text")}>
          <Icon size={16} />
        </div>
        <div>
           <div className={cn("text-sm font-bold transition-colors", isSelected ? "text-text" : "text-muted-foreground group-hover:text-text")}>{item.name}</div>
           <div className="text-[10px] text-muted/60">{item.desc}</div>
        </div>
      </div>
      {isSelected && <CheckCircle2 size={16} className="text-brand-500" />}
    </button>
  );
};

interface GridNodeProps {
  item: TechComponent;
  onRemove: () => void;
}

const GridNode: React.FC<GridNodeProps> = ({ item, onRemove }) => {
  const config = CATEGORY_CONFIG[item.category];
  const Icon = config.icon;

  return (
    <motion.div
      layoutId={item.id}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={cn(
        "relative aspect-square flex flex-col items-center justify-center p-4 rounded-xl border backdrop-blur-sm shadow-lg",
        // Using bg-card ensures it looks right in both modes (white in light, dark gray in dark)
        "bg-card",
        config.color
      )}
    >
      <button 
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-red-500/10 hover:text-red-500 text-muted/50 transition-colors"
      >
        <Trash2 size={14} />
      </button>
      
      <Icon size={32} className="mb-3 opacity-90" />
      <div className="font-bold text-sm text-center leading-tight text-text">{item.name}</div>
      <div className="mt-2 text-[10px] font-mono opacity-60 uppercase tracking-widest">{config.label}</div>
    </motion.div>
  );
};

// --- Main Page ---

export default function StackArchitectPage() {
  const [stack, setStack] = useState<TechComponent[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // --- Calculations ---
  const metrics = useMemo(() => {
    let baseCapacity = 1000; // Base users
    let totalComplexity = 0;
    let totalCost = 0;
    
    stack.forEach(item => {
      baseCapacity = baseCapacity * item.power;
      totalComplexity += item.complexity;
      totalCost += item.cost;
    });

    // Normalize complexity (0-100)
    const complexityScore = Math.min(100, (totalComplexity / (stack.length * 8)) * 100) || 0;
    
    // Determine Dev Velocity based on complexity
    let velocity = "High";
    if (complexityScore > 40) velocity = "Medium";
    if (complexityScore > 75) velocity = "Low";

    return {
      capacity: Math.round(baseCapacity),
      complexity: Math.round(complexityScore),
      cost: totalCost,
      velocity
    };
  }, [stack]);

  const toggleItem = (item: TechComponent) => {
    if (stack.find(i => i.id === item.id)) {
      setStack(prev => prev.filter(i => i.id !== item.id));
    } else {
      setStack(prev => [...prev, item]);
    }
    // Reset analysis on change
    if (showResults) setShowResults(false);
  };

  const runAnalysis = () => {
    if (stack.length === 0) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20 text-text font-sans selection:bg-brand-500/30 transition-colors duration-300">
      <Container>
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-500 mb-2">
              <Cpu size={20} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Sinrem Labs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text">Stack Architect <span className="text-muted/40">v1.0</span></h1>
            <p className="mt-2 text-muted-foreground max-w-lg">
              Drag-and-drop simulation. Estimate capacity, complexity, and monthly infrastructure costs for your next build.
            </p>
          </div>
          <div className="flex gap-3">
             <Button variant="ghost" onClick={() => setStack([])} className="text-muted-foreground hover:text-text">
                <RotateCcw size={16} className="mr-2" /> Reset
             </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Component Library */}
          <div className="lg:col-span-3 space-y-8">
             {['frontend', 'backend', 'database', 'infra'].map((cat) => (
                <div key={cat}>
                   <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                      {CATEGORY_CONFIG[cat as TechCategory].label}
                   </h3>
                   <div className="space-y-2">
                      {COMPONENTS.filter(c => c.category === cat).map(item => (
                         <ComponentChip 
                            key={item.id} 
                            item={item} 
                            onClick={() => toggleItem(item)}
                            isSelected={!!stack.find(i => i.id === item.id)}
                         />
                      ))}
                   </div>
                </div>
             ))}
          </div>

          {/* CENTER: Canvas */}
          <div className="lg:col-span-6">
             {/* 
                Canvas Container:
                Changed bg-[#0A0A0A] to bg-card/30 or muted/5 to handle light mode.
                Border changed to border-border.
             */}
             <div className="bg-card/50 dark:bg-[#0A0A0A] border border-border rounded-3xl min-h-[600px] relative overflow-hidden flex flex-col transition-colors duration-300">
                
                {/* 
                   Grid Background:
                   Using currentColor to inherit text color.
                   Setting text-border (a darker grey in light mode, lighter grey in dark mode).
                   This makes the grid adapt automatically.
                */}
                <div className="absolute inset-0 opacity-20 pointer-events-none text-gray-300 dark:text-[#333]" 
                     style={{ 
                       backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', 
                       backgroundSize: '40px 40px' 
                     }} 
                />
                
                {/* Header inside canvas */}
                <div className="relative z-10 p-6 flex justify-between items-start pointer-events-none">
                   <div className="text-xs font-mono text-muted/50">System Topology View</div>
                   <div className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase border", stack.length > 0 ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-muted/10 border-border text-muted-foreground")}>
                      {stack.length > 0 ? "System Active" : "Empty Canvas"}
                   </div>
                </div>

                {/* The Stack Grid */}
                <div className="relative z-10 flex-1 p-6">
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {stack.map(item => (
                           <GridNode key={item.id} item={item} onRemove={() => toggleItem(item)} />
                        ))}
                      </AnimatePresence>
                      
                      {/* Empty State / Add Hint */}
                      {stack.length === 0 && (
                         <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted/30 border-2 border-dashed border-border/50 rounded-2xl">
                            <Box size={48} className="mb-4 opacity-50" />
                            <p className="text-sm font-medium">Select components from the left</p>
                         </div>
                      )}
                   </div>
                </div>

                {/* Analysis Overlay */}
                {analyzing && (
                  <div className="absolute inset-0 z-50 bg-bg/80 backdrop-blur-sm flex flex-col items-center justify-center">
                     <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-6" />
                     <div className="font-mono text-brand-500 text-sm animate-pulse">RUNNING_SIMULATION...</div>
                     <div className="mt-2 text-xs text-muted-foreground">Calculating throughput vectors</div>
                  </div>
                )}

             </div>
          </div>

          {/* RIGHT: HUD / Results */}
          <div className="lg:col-span-3 space-y-6">
             
             {/* Action Card */}
             <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="text-sm font-bold text-text mb-4">System Analysis</div>
                <Button 
                   onClick={runAnalysis} 
                   disabled={stack.length === 0 || analyzing}
                   className="w-full relative overflow-hidden"
                >
                   {analyzing ? "Processing..." : "Run Diagnostics"}
                </Button>
             </div>

             {/* Results Panel */}
             <AnimatePresence>
               {(showResults && !analyzing) && (
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 20 }}
                   className="space-y-6"
                 >
                    {/* Capacity */}
                    <div className="bg-card/50 border border-border p-5 rounded-2xl">
                       <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                          <Zap size={14} /> Est. Max Concurrency
                       </div>
                       <div className="text-3xl font-mono font-bold text-text">
                          {metrics.capacity.toLocaleString()} <span className="text-sm text-muted-foreground">users/sec</span>
                       </div>
                    </div>

                    {/* Cost */}
                    <div className="bg-card/50 border border-border p-5 rounded-2xl">
                       <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                          <Cloud size={14} /> Monthly Infra Cost
                       </div>
                       <div className="text-3xl font-mono font-bold text-text">
                          ${metrics.cost} <span className="text-sm text-muted-foreground">/mo</span>
                       </div>
                       <div className="mt-2 text-[10px] text-muted-foreground leading-tight">
                          *Estimate based on standard AWS/Vercel pricing for selected tier.
                       </div>
                    </div>

                    {/* Complexity Meter */}
                    <div className="bg-card/50 border border-border p-5 rounded-2xl">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                             <Layers size={14} /> Complexity Score
                          </div>
                          <div className={cn("text-xs font-bold px-2 py-0.5 rounded", 
                             metrics.complexity < 40 ? "bg-green-500/20 text-green-500" :
                             metrics.complexity < 70 ? "bg-yellow-500/20 text-yellow-500" :
                             "bg-red-500/20 text-red-500"
                          )}>
                             {metrics.complexity < 40 ? "Manageable" : metrics.complexity < 70 ? "Moderate" : "High"}
                          </div>
                       </div>
                       <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${metrics.complexity}%` }}
                             transition={{ duration: 1, ease: "easeOut" }}
                             className={cn("h-full", 
                                metrics.complexity < 40 ? "bg-green-500" :
                                metrics.complexity < 70 ? "bg-yellow-500" :
                                "bg-red-500"
                             )}
                          />
                       </div>
                       <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground bg-muted/10 p-2 rounded-lg border border-border/50">
                          <AlertTriangle size={12} />
                          <span>Dev Velocity Impact: <strong className="text-text">{metrics.velocity}</strong></span>
                       </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="pt-4 border-t border-border space-y-3">
                       <p className="text-sm text-muted-foreground">Need this built for real?</p>
                       <Button href="/contact" variant="secondary" className="w-full text-xs h-10">
                          Consult an Engineer <ArrowRight size={14} />
                       </Button>
                       
                       {/* WhatsApp Consult Button */}
                       <Button 
                         href={site.whatsappLink}
                         variant="ghost" 
                         className="w-full text-xs h-10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/5 hover:border-[#25D366]/50"
                       >
                          Discuss on WhatsApp
                       </Button>
                    </div>

                 </motion.div>
               )}
             </AnimatePresence>
             
             {(!showResults && stack.length > 0) && (
                <div className="p-6 text-center text-sm text-muted/50 italic border border-border/50 rounded-2xl border-dashed">
                   Run diagnostics to see analysis
                </div>
             )}

          </div>

        </div>
      </Container>
    </main>
  );
}