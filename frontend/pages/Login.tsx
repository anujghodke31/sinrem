import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, ShieldCheck, Cpu, Key, AlertCircle } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { InteractiveMesh } from "../components/animated/InteractiveMesh";
import { cn } from "../lib/cn";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<"idle" | "authenticating" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  // Typewriter effect for demo credentials
  const fillDemo = () => {
    if (isTyping) return; // Prevent multiple clicks
    
    const demoEmail = "guest@sinrem.tech";
    const demoPass = "future_is_now";
    
    setError(null);
    setIsTyping(true);
    
    setEmail("");
    setPassword("");

    let eIdx = 0;
    
    // Typing Email
    const typeEmail = setInterval(() => {
      if (eIdx < demoEmail.length) {
        // Use functional update to append strictly
        setEmail(prev => prev + demoEmail.charAt(eIdx));
        eIdx++;
      } else {
        clearInterval(typeEmail);
        setEmail(demoEmail); // Force consistency
        
        // Typing Password
        let pIdx = 0;
        const typePass = setInterval(() => {
          if (pIdx < demoPass.length) {
            setPassword(prev => prev + demoPass.charAt(pIdx));
            pIdx++;
          } else {
            clearInterval(typePass);
            setPassword(demoPass); // Force consistency
            setIsTyping(false);
          }
        }, 30);
      }
    }, 30);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTyping) return;

    setStep("authenticating");
    setIsLoading(true);
    setError(null);

    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    // Simulate API delay and validation
    setTimeout(() => {
      if (cleanEmail === "guest@sinrem.tech" && cleanPass === "future_is_now") {
        setStep("success");
        setTimeout(() => {
           navigate("/dashboard");
        }, 1000);
      } else {
        setStep("idle");
        setIsLoading(false);
        setPassword("");
        setError("Access Denied. Please use the Demo Credentials (click Auto-fill).");
      }
    }, 1500);
  };

  return (
    <main className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg">
      {/* Background FX */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <InteractiveMesh />
      </div>
      
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 min-h-[600px] w-full max-w-5xl mx-auto bg-card/30 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Left: Brand Visuals */}
          <div className="relative hidden lg:flex flex-col justify-between p-12 bg-black/20 border-r border-border">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent" />
             
             <div>
               <div className="flex items-center gap-2 text-brand-500 mb-6">
                 <ShieldCheck size={24} />
                 <span className="font-bold tracking-widest text-xs uppercase">Secure Client Gateway</span>
               </div>
               <h1 className="text-4xl font-bold text-text mb-4">
                 Transparency as <br /> a Service.
               </h1>
               <p className="text-muted leading-relaxed">
                 Login to view real-time project health, server metrics, sprint velocity, and Jira ticket status. We believe you should own your data.
               </p>
             </div>

             <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center border border-brand-500/20 text-brand-500">
                     <Cpu size={20} />
                   </div>
                   <div>
                      <div className="text-sm font-bold text-text">Real-time Metrics</div>
                      <div className="text-xs text-muted">Live server & database health monitoring.</div>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">
                     <Key size={20} />
                   </div>
                   <div>
                      <div className="text-sm font-bold text-text">Role-Based Access</div>
                      <div className="text-xs text-muted">Secure, granular permissions for your team.</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Right: Login Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
             <div className="mb-8">
               <h2 className="text-2xl font-bold text-text mb-2">Welcome back</h2>
               <p className="text-muted text-sm">Please enter your client credentials.</p>
             </div>

             {/* Demo Credentials Box */}
             <div className="mb-8 p-4 bg-brand-500/5 border border-brand-500/20 rounded-xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="flex justify-between items-start relative z-10">
                   <div>
                      <div className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">Demo Access</div>
                      <div className="text-sm text-text">Experience the "After Service"</div>
                   </div>
                   <button 
                     onClick={fillDemo}
                     disabled={isTyping || isLoading}
                     className="text-xs bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 px-3 py-1.5 rounded-lg transition-colors font-medium border border-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isTyping ? "Typing..." : "Auto-fill"}
                   </button>
                </div>
             </div>

             <form onSubmit={handleLogin} className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Email Address</label>
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => { setEmail(e.target.value); setError(null); }}
                     className={cn(
                       "w-full bg-bg/50 border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-brand-500 transition-colors",
                       error ? "border-red-500/50" : "border-border"
                     )}
                     placeholder="name@company.com"
                     required
                   />
                </div>
                <div>
                   <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Password</label>
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => { setPassword(e.target.value); setError(null); }}
                     className={cn(
                       "w-full bg-bg/50 border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-brand-500 transition-colors",
                       error ? "border-red-500/50" : "border-border"
                     )}
                     placeholder="••••••••"
                     required
                   />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading || isTyping}
                  className="relative w-full h-14 bg-brand-500 hover:bg-brand-400 text-black font-bold rounded-xl overflow-hidden group transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait">
                    {step === "idle" && (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                         <Lock size={18} /> Secure Login
                      </motion.div>
                    )}
                    {step === "authenticating" && (
                      <motion.div 
                        key="auth"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                         <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                         Verifying Identity...
                      </motion.div>
                    )}
                    {step === "success" && (
                       <motion.div 
                         key="success"
                         initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                         className="flex items-center justify-center gap-2"
                       >
                          <ShieldCheck size={20} /> Access Granted
                       </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scan Line Animation */}
                  {isLoading && (
                    <motion.div 
                      className="absolute top-0 bottom-0 w-1 bg-white/50 blur-[2px]"
                      initial={{ left: "0%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </button>
             </form>
             
             <div className="mt-6 text-center text-xs text-muted">
                Protected by 256-bit SSL Encryption. <br />
                <span className="opacity-50">Authorized personnel only.</span>
             </div>
          </div>
        </div>
      </Container>
    </main>
  );
}