
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container } from "../components/ui/Container";
import { 
  Activity, CheckCircle2, Clock, Shield, Users, BarChart3, 
  ArrowUpRight, ArrowDownRight, Zap, Plus, FileText, Download,
  Flag, Rocket, Hammer, Search
} from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "../components/ui/Button";

// --- Mock Data ---

const tickets = [
  { id: "ST-4022", title: "Integrate Payment Gateway", status: "In Progress", type: "Feature" },
  { id: "ST-4023", title: "Mobile Menu Glitch", status: "Review", type: "Bug" },
  { id: "ST-4024", title: "Update Security Headers", status: "Done", type: "Security" },
];

const activity = [
  { time: "2 min ago", text: "Automated Backup Completed", type: "system" },
  { time: "1 hr ago", text: "Dev Team pushed updates to Staging", type: "git" },
  { time: "3 hr ago", text: "New Feature Request: Dark Mode Toggle", type: "request" },
  { time: "5 hr ago", text: "Security Scan: 0 Vulnerabilities found", type: "security" },
];

// --- Components ---

const StatCard = ({ title, value, trend, trendDir, icon: Icon, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-card/50 border border-border p-6 rounded-2xl relative overflow-hidden group hover:border-brand-500/30 transition-colors"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-muted/10 rounded-xl text-muted-foreground group-hover:text-brand-500 group-hover:bg-brand-500/10 transition-colors">
        <Icon size={20} />
      </div>
      {trend && (
        <div className={cn("flex items-center text-xs font-bold px-2 py-1 rounded-full", trendDir === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")}>
           {trendDir === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
           {trend}
        </div>
      )}
    </div>
    <div className="text-3xl font-bold text-text mb-1">{value}</div>
    <div className="text-sm text-muted-foreground">{title}</div>
  </motion.div>
);

const ProjectMilestone = () => {
  const steps = [
    { name: "Discovery", status: "complete", icon: Search },
    { name: "Design", status: "complete", icon: Hammer },
    { name: "Build", status: "active", icon: Rocket },
    { name: "Launch", status: "pending", icon: Flag },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="font-bold text-text flex items-center gap-2">
            <Rocket size={18} className="text-brand-500" /> Project Status
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full">
            On Track
          </div>
        </div>
        
        <div className="relative mb-8">
          {/* Progress Bar Background */}
          <div className="absolute top-5 left-0 w-full h-1 bg-muted/10 rounded-full" />
          
          {/* Active Progress */}
          <div className="absolute top-5 left-0 w-[66%] h-1 bg-brand-500 rounded-full" />

          <div className="relative flex justify-between">
            {steps.map((step, i) => {
               const Icon = step.icon;
               return (
                 <div key={i} className="flex flex-col items-center gap-3">
                   <div className={cn(
                     "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-card",
                     step.status === 'complete' ? "border-brand-500 text-brand-500" :
                     step.status === 'active' ? "border-brand-500 text-black bg-brand-500 shadow-lg shadow-brand-500/40" :
                     "border-muted/20 text-muted-foreground"
                   )}>
                     <Icon size={16} />
                   </div>
                   <div className={cn(
                     "text-xs font-medium",
                     step.status === 'pending' ? "text-muted-foreground" : "text-text"
                   )}>
                     {step.name}
                   </div>
                 </div>
               )
            })}
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted/5 rounded-xl border border-border/50 text-sm">
         <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Focus</div>
         <span className="text-text font-medium leading-relaxed">Integrating Stripe API and finalizing checkout flow for the Q3 release.</span>
      </div>
    </div>
  )
}

// Simple SVG Line Chart Component
const SimpleChart = () => (
  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
    <motion.path
      d="M0,35 Q10,35 20,20 T40,25 T60,10 T80,15 T100,5"
      fill="none"
      stroke="url(#gradient)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#0EDBA0" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#0EDBA0" stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Fill area */}
    <motion.path
      d="M0,35 Q10,35 20,20 T40,25 T60,10 T80,15 T100,5 V40 H0 Z"
      fill="url(#fillGradient)"
      opacity="0.2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ delay: 1, duration: 1 }}
    />
    <defs>
      <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0EDBA0" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#0EDBA0" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake loading state for dashboard
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-bg pt-24 pb-20">
      <Container>
        
        {/* Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-gradient-to-r from-brand-500/10 to-blue-500/10 border border-brand-500/20 flex items-center gap-4"
        >
          <div className="p-2 bg-brand-500 text-black rounded-lg shrink-0">
             <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">Experience Total Transparency</h3>
            <p className="text-sm text-muted-foreground">
              This is a live demo of our Client Portal. When you partner with Sinrem Tech, you get full access to monitoring, sprints, and code health.
            </p>
          </div>
        </motion.div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Project Dashboard</div>
             <h1 className="text-3xl font-bold text-text">Sharadchandra Ecosystem <span className="text-brand-500">.Live</span></h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-wide">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Active
             </div>
             <div className="text-sm text-muted-foreground font-mono">
                v2.4.0
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <StatCard 
              title="Total Visitors" 
              value="1.2M" 
              trend="12%" 
              trendDir="up" 
              icon={Users} 
              delay={0.1} 
           />
           <StatCard 
              title="Avg. Load Time" 
              value="42ms" 
              trend="3ms" 
              trendDir="up" 
              icon={Clock} 
              delay={0.2} 
           />
           <StatCard 
              title="Uptime (30d)" 
              value="99.9%" 
              trend="stable" 
              trendDir="up" 
              icon={Activity} 
              delay={0.3} 
           />
           <StatCard 
              title="Security Score" 
              value="A+" 
              trend="Safe" 
              trendDir="up" 
              icon={Shield} 
              delay={0.4} 
           />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Traffic Chart */}
             <div className="bg-card border border-border rounded-2xl p-6 shadow-soft h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-2 text-text font-bold">
                      <BarChart3 size={18} className="text-brand-500" /> Traffic Overview
                   </div>
                   <div className="flex gap-2">
                      {['1H', '24H', '7D', '30D'].map(t => (
                        <button key={t} className={cn("px-2 py-1 text-xs rounded hover:bg-muted/10", t === '24H' ? 'bg-muted/10 text-text font-bold' : 'text-muted-foreground')}>
                          {t}
                        </button>
                      ))}
                   </div>
                </div>
                <div className="flex-1 relative w-full">
                   <SimpleChart />
                </div>
             </div>

             {/* Deployment / Tickets */}
             <div className="grid md:grid-cols-2 gap-8">
                {/* Project Status */}
                <ProjectMilestone />
                
                {/* Tickets */}
                <div className="bg-card border border-border rounded-2xl p-6 h-full">
                   <div className="flex items-center justify-between mb-6">
                      <div className="font-bold text-text flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-blue-500" /> Current Tasks
                      </div>
                      <span className="text-xs text-muted-foreground">Sprint #24</span>
                   </div>
                   <div className="space-y-4">
                      {tickets.map(t => (
                        <div key={t.id} className="p-3 rounded-xl bg-muted/5 border border-border/50 hover:border-brand-500/30 transition-colors">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                              <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded uppercase font-bold",
                                t.type === 'Feature' ? 'bg-purple-500/10 text-purple-500' :
                                t.type === 'Bug' ? 'bg-red-500/10 text-red-500' :
                                'bg-green-500/10 text-green-500'
                              )}>
                                {t.type}
                              </span>
                           </div>
                           <div className="text-sm font-medium text-text mb-1">{t.title}</div>
                           <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span className="text-text">{t.status}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-8">
             
             {/* Quick Actions */}
             <div className="bg-card border border-border rounded-2xl p-6">
                <div className="font-bold text-text mb-4">Quick Actions</div>
                <div className="grid gap-3">
                   <Button variant="secondary" className="w-full justify-start text-sm h-12 bg-muted/5 hover:bg-brand-500/10 hover:text-brand-500 hover:border-brand-500/20">
                      <Plus size={16} className="mr-2" /> Request Feature
                   </Button>
                   <Button variant="secondary" className="w-full justify-start text-sm h-12">
                      <FileText size={16} className="mr-2 text-blue-500" /> View Contract
                   </Button>
                   <Button variant="secondary" className="w-full justify-start text-sm h-12">
                      <Download size={16} className="mr-2 text-orange-500" /> Download Invoice
                   </Button>
                </div>
             </div>

             {/* Activity Timeline */}
             <div className="bg-card border border-border rounded-2xl p-6">
                <div className="font-bold text-text mb-6 flex items-center gap-2">
                   <Activity size={18} className="text-orange-500" /> Live Activity
                </div>
                <div className="relative pl-4 space-y-8">
                   {/* Vertical Line */}
                   <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                   
                   {activity.map((item, i) => (
                      <div key={i} className="relative flex gap-4">
                         <div className={cn(
                           "absolute -left-[13px] w-3 h-3 rounded-full border-2 border-card",
                           item.type === 'request' ? "bg-purple-500" : 
                           item.type === 'git' ? "bg-blue-500" : 
                           item.type === 'security' ? "bg-green-500" :
                           "bg-muted"
                         )} />
                         <div>
                            <div className="text-xs text-muted-foreground mb-0.5 font-mono">{item.time}</div>
                            <div className="text-sm text-text font-medium leading-tight">{item.text}</div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

          </div>
        </div>

      </Container>
    </main>
  );
}
