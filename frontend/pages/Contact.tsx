import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { site } from "../lib/site";
import { ArrowRight, Mail, MessageSquare, MapPin, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";
import { useAi } from "../context/AiContext";
import { apiUrl } from "../lib/apiBase";

export default function ContactPage() {
  const { openChat } = useAi();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const preselect = searchParams.get("package") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [need, setNeed] = useState(preselect ? `Interested in package: ${preselect}` : "");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !need) {
      setStatus("error");
      setStatusMsg("Please provide your name, email, and project details.");
      return;
    }
    
    setStatus("loading");

    const payload = {
      name,
      email,
      subject: company ? `Project Inquiry from ${company}` : "Project Inquiry",
      message: need,
    };

    // Google Apps Script endpoint — works without a backend
    const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

    try {
      if (APPS_SCRIPT_URL) {
        // Send to Google Sheets + email via Apps Script
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          // Apps Script requires text/plain to avoid CORS preflight
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
        });
        setStatus("success");
        setStatusMsg("Message sent! We'll get back to you within 24 hours.");
        setName(""); setEmail(""); setCompany(""); setNeed("");
      } else {
        // Fallback: try the Express backend if deployed
        const res = await fetch(apiUrl("/api/contact"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setStatus("success");
          setStatusMsg(data.message || "Message sent successfully!");
          setName(""); setEmail(""); setCompany(""); setNeed("");
        } else {
          setStatus("error");
          setStatusMsg(data.message || "Failed to send message.");
        }
      }
    } catch (err: any) {
      setStatus("error");
      setStatusMsg("An error occurred. Please try again later.");
    }
  };

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Project inquiry${company ? ` • ${company}` : ""}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nRequirements:\n${need}\n`
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  }, [name, email, company, need]);

  const whatsapp = useMemo(() => {
    const text = encodeURIComponent(
      `Hello, I'm ${name || "[your name]"}${company ? ` from ${company}` : ""}. ${need || "I want to discuss a project."}`
    );
    return `${site.whatsappLink}?text=${text}`;
  }, [name, company, need]);

  return (
    <main className="relative min-h-screen bg-bg pt-24 pb-20 sm:pt-32 overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* LEFT COLUMN: Sticky Info & Greeting */}
          <div className="lg:sticky lg:top-32 lg:h-fit order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-6">Contact Us</div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-text mb-8 leading-[1.05]">
                <span className="block text-foreground/50 transition-colors duration-500">
                  {name ? "Hello," : "Let's build"}
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-600">
                  {name ? name : "the future."}
                </span>
              </h1>

              <p className="text-xl text-foreground/70 leading-relaxed max-w-md mb-12">
                Got a challenge? We have the engineering. Tell us about your vision, and we’ll figure out the architecture.
              </p>

              {/* Contact Details Grid */}
              <div className="grid gap-8 border-t border-border pt-8">
                <ContactDetail 
                   icon={<Mail />} 
                   label="Email us directly" 
                   value={site.email} 
                   href={`mailto:${site.email}`} 
                />
                <ContactDetail 
                   icon={<MessageSquare />} 
                   label="Chat on WhatsApp" 
                   value={site.phone} 
                   href={site.whatsappLink} 
                />
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted/5 border border-border flex items-center justify-center text-muted shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground/60 mb-1">Visit HQ</div>
                    <div className="text-lg font-medium text-text">{site.address}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="order-1 lg:order-2">
             <motion.div
               initial={{ opacity: 0, x: 30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
               className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-[2rem] p-8 sm:p-12 shadow-2xl"
             >
                <form onSubmit={handleSubmit} className="space-y-12">
                   {/* Name Input */}
                   <div className="relative group">
                      <label htmlFor="name" className={cn("block text-sm font-medium transition-colors duration-300 mb-2", focusedField === 'name' ? 'text-brand-500' : 'text-foreground/60')}>
                         01. What's your name? *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b-2 border-border py-4 text-2xl sm:text-3xl font-medium text-text placeholder:text-foreground/35 outline-none focus:border-brand-500 transition-all duration-300"
                        required
                      />
                   </div>

                   {/* Email Input */}
                   <div className="relative group">
                      <label htmlFor="email" className={cn("block text-sm font-medium transition-colors duration-300 mb-2", focusedField === 'email' ? 'text-brand-500' : 'text-foreground/60')}>
                         02. What's your email? *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="john@example.com"
                        className="w-full bg-transparent border-b-2 border-border py-4 text-2xl sm:text-3xl font-medium text-text placeholder:text-foreground/35 outline-none focus:border-brand-500 transition-all duration-300"
                        required
                      />
                   </div>

                   {/* Company Input */}
                   <div className="relative group">
                      <label htmlFor="company" className={cn("block text-sm font-medium transition-colors duration-300 mb-2", focusedField === 'company' ? 'text-brand-500' : 'text-foreground/60')}>
                         03. What's your company?
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        onFocus={() => setFocusedField('company')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Acme Corp"
                        className="w-full bg-transparent border-b-2 border-border py-4 text-2xl sm:text-3xl font-medium text-text placeholder:text-foreground/35 outline-none focus:border-brand-500 transition-all duration-300"
                      />
                   </div>

                   {/* Need Input */}
                   <div className="relative group">
                      <label htmlFor="need" className={cn("block text-sm font-medium transition-colors duration-300 mb-2", focusedField === 'need' ? 'text-brand-500' : 'text-foreground/60')}>
                         04. Tell us about your project *
                      </label>
                      <textarea
                        id="need"
                        rows={4}
                        value={need}
                        onChange={(e) => setNeed(e.target.value)}
                        onFocus={() => setFocusedField('need')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="We need a high-performance e-commerce platform..."
                        className="w-full bg-transparent border-b-2 border-border py-4 text-xl sm:text-2xl font-medium text-text placeholder:text-foreground/35 outline-none focus:border-brand-500 transition-all duration-300 resize-none"
                        required
                      />
                   </div>

                   {/* Status Message */}
                   {status !== "idle" && status !== "loading" && (
                     <div className={cn("text-sm p-4 rounded-xl border border-border/50 backdrop-blur-sm", status === "success" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10")}>
                        {statusMsg}
                     </div>
                   )}

                   {/* Actions */}
                   <div className="pt-6 space-y-4">
                      <Button type="submit" disabled={status === "loading"} className="w-full py-5 text-lg h-auto rounded-xl">
                         {status === "loading" ? "Sending..." : "Send Inquiry"} <ArrowRight size={20} className="ml-2" />
                      </Button>
                      <div className="text-center text-sm text-muted">or</div>
                      <Button href={whatsapp} variant="secondary" className="w-full py-5 text-lg h-auto rounded-xl">
                         Chat on WhatsApp
                      </Button>
                      <div className="text-center text-sm text-muted">or</div>
                      <Button onClick={openChat} variant="ghost" className="w-full py-5 text-lg h-auto rounded-xl border border-dashed border-brand-500/30 text-brand-500 hover:bg-brand-500/5">
                         <Sparkles size={20} className="mr-2" /> Consult Sinrem AI
                      </Button>
                   </div>
                </form>

                {/* What happens next (Mini) */}
                <div className="mt-16 pt-10 border-t border-border/50">
                   <h3 className="text-sm font-bold text-text uppercase tracking-widest mb-6">What happens next</h3>
                   <div className="space-y-4">
                      <ProcessRow num="01" text="We analyze your requirements." />
                      <ProcessRow num="02" text="We propose a tech stack & timeline." />
                      <ProcessRow num="03" text="We start building." />
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </Container>
    </main>
  );
}

function ContactDetail({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string, href: string }) {
  return (
    <a href={href} className="flex gap-4 group">
       <div className="w-10 h-10 rounded-full bg-muted/5 border border-border flex items-center justify-center text-muted group-hover:text-brand-500 group-hover:border-brand-500/30 transition-all duration-300 shrink-0">
         {icon}
       </div>
       <div>
         <div className="text-sm font-medium text-foreground/60 mb-1 group-hover:text-brand-500 transition-colors">{label}</div>
         <div className="text-lg font-medium text-text">{value}</div>
       </div>
    </a>
  )
}

function ProcessRow({ num, text }: { num: string, text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-xs font-mono font-bold text-brand-500">{num}</div>
      <div className="text-sm text-foreground/70">{text}</div>
    </div>
  )
}