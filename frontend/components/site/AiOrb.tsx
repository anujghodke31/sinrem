
import React, { useState, useRef, useEffect } from "react";
import { useScroll, useSpring, useTransform, motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, ArrowRight, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { site } from "../../lib/site";
import { cn } from "../../lib/cn";
import { useAi } from "../../context/AiContext";
import { apiUrl } from "../../lib/apiBase";

// API key is on the server — frontend calls /api/ai/chat proxy

type Message = {
  role: "user" | "model" | "system";
  text: string;
};

// --- Contextual Messages ---
const PAGE_MESSAGES: Record<string, string[]> = {
  "/": ["Building something big?", "Need a tech partner?", "Scale with us.", "Performance matters."],
  "/services": ["Need custom software?", "Explore AI solutions.", "We build specifically for you.", "Full-stack experts."],
  "/case-studies": ["See our impact.", "Real results.", "Proof of delivery.", "We solve complex problems."],
  "/pricing": ["Transparent costs.", "Find your package.", "No hidden fees.", "Invest in quality."],
  "/about": ["Est. 2023.", "Meet the engineers.", "Values that matter.", "Your strategic partner."],
  "/contact": ["Ready to start?", "Let's discuss constraints.", "We are online.", "Build the future."],
  "/login": ["Client portal.", "Secure access.", "Check project status.", "View live metrics."],
  "/tools/stack-architect": ["Plan your stack.", "Estimate costs.", "Scale prediction.", "Drag and drop."],
  "/tools/roi-calculator": ["Calculate loss.", "Speed is money.", "Stop the bleeding.", "See the cost."],
  "/games/packet-flow": ["Route the packets.", "Optimize flow.", "Beat the system.", "Network logic."],
  "default": ["Got stuck?", "Need help?", "Chat with AI.", "I'm here to help."]
};

// --- Component ---

export function AiOrb() {
  // Use Global Context
  const { isOpen, openChat, closeChat } = useAi();
  
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [hasInteracted, setHasInteracted] = useState(false);
  const location = useLocation();

  // Pop-up Message State
  const [autoMessage, setAutoMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: `Hello! I'm **Sinrem AI**. I can help you with pricing, technical capabilities, or finding the right stack for your project. \n\n[View Services](/services) [Check Pricing](/pricing)` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Set interacted if opened externally (via context)
  useEffect(() => {
    if (isOpen) setHasInteracted(true);
  }, [isOpen]);

  // Random Message Timer Logic
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let hideTimeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextMessage = () => {
      // Random delay between 10s and 30s
      const delay = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000;
      
      timeoutId = setTimeout(() => {
        // Only show if not open and not currently hovered
        if (!isOpen && !isHovered) {
          const pathMessages = PAGE_MESSAGES[location.pathname] || PAGE_MESSAGES["default"];
          const randomMsg = pathMessages[Math.floor(Math.random() * pathMessages.length)];
          
          setAutoMessage(randomMsg);

          // Hide message after 5 seconds
          hideTimeoutId = setTimeout(() => {
            setAutoMessage(null);
            scheduleNextMessage(); // Loop
          }, 5000);
        } else {
          // If busy, try again sooner
          scheduleNextMessage();
        }
      }, delay);
    };

    // Initial Start
    scheduleNextMessage();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
      setAutoMessage(null); // Clear on unmount/page change
    };
  }, [location.pathname, isOpen, isHovered]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      // Send to backend proxy — API key never touches the browser
      const res = await fetch(apiUrl('/api/ai/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          // Send last 10 messages as history (skip the initial model greeting)
          history: messages.slice(-10).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      const text = data.text || "I'm having trouble connecting right now. Please try again or email info@sinrem.tech.";
      setMessages((prev) => [...prev, { role: "model", text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "model", text: "I encountered a network error. Please check your connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 font-sans">
        
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="orb"
              layoutId="chat-container"
              onClick={() => openChat()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-card border border-border/50 shadow-2xl cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Circular Scroll Progress */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2" fill="none" className="text-muted/10" />
                <motion.circle 
                  cx="50" cy="50" r="48" 
                  stroke="currentColor" strokeWidth="2" fill="none" 
                  className="text-brand-500"
                  style={{ pathLength }}
                />
              </svg>

              {/* Icon */}
              <div className="relative z-10 text-brand-500 group-hover:text-text transition-colors duration-300">
                {!hasInteracted ? <Sparkles size={24} /> : <MessageSquare size={24} />}
              </div>

              {/* Standard Tooltip on Hover */}
              <div className="absolute right-full mr-4 px-3 py-1.5 bg-black/80 backdrop-blur-md text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none z-10">
                Ask Sinrem AI
              </div>

              {/* Random Contextual Pop-up Message */}
              <AnimatePresence>
                {autoMessage && !isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute right-full mr-5 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-text text-bg dark:bg-brand-500 dark:text-black text-sm font-bold rounded-xl shadow-xl shadow-black/10 whitespace-nowrap z-20 pointer-events-none"
                  >
                    {autoMessage}
                    {/* Little triangle pointing to orb */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-inherit rotate-45 rounded-[1px]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <motion.div
              key="window"
              layoutId="chat-container"
              className="w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-bg/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center border border-brand-500/20 text-brand-500">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">Sinrem AI</div>
                    <div className="text-[10px] text-brand-500 font-medium tracking-wide uppercase">Technical Consultant</div>
                  </div>
                </div>
                <button 
                  onClick={() => closeChat()}
                  className="p-2 hover:bg-muted/10 rounded-full text-muted-foreground hover:text-text transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" ref={scrollRef}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    {/* Avatar */}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                      msg.role === "model" ? "bg-card border-brand-500/20 text-brand-500" : "bg-muted/20 border-transparent text-muted-foreground"
                    )}>
                      {msg.role === "model" ? <Bot size={16} /> : <User size={16} />}
                    </div>

                    {/* Bubble */}
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "model" 
                        ? "bg-card border border-border/50 text-text shadow-sm" 
                        : "bg-brand-500 text-black font-medium shadow-lg shadow-brand-500/10"
                    )}>
                       <ReactMarkdown
                         components={{
                           // Custom Link Renderer for "Actionable Buttons"
                           a: ({ href, children }) => {
                             const isInternal = href?.startsWith("/");
                             if (isInternal && href) {
                               return (
                                 <Link to={href} className="inline-flex items-center gap-1.5 px-3 py-1.5 my-2 mr-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 font-bold hover:bg-brand-500 hover:text-black transition-colors no-underline text-xs uppercase tracking-wide">
                                   {children} <ArrowRight size={12} />
                                 </Link>
                               )
                             }
                             return <a href={href} target="_blank" rel="noopener noreferrer" className="underline opacity-80 hover:opacity-100">{children}</a>
                           },
                           p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                           ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                           li: ({children}) => <li>{children}</li>,
                           strong: ({children}) => <span className="font-bold">{children}</span>
                         }}
                       >
                         {msg.text}
                       </ReactMarkdown>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-card border border-brand-500/20 flex items-center justify-center text-brand-500">
                        <Bot size={16} />
                     </div>
                     <div className="bg-card border border-border/50 rounded-2xl px-4 py-3 flex items-center gap-1">
                        <motion.div className="w-1.5 h-1.5 bg-muted rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
                        <motion.div className="w-1.5 h-1.5 bg-muted rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                        <motion.div className="w-1.5 h-1.5 bg-muted rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                     </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="p-3 bg-card border-t border-border flex items-center gap-2"
              >
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about pricing, stack, or services..."
                  className="flex-1 bg-muted/5 border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-brand-500 transition-colors placeholder:text-muted/40"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-3 rounded-xl bg-brand-500 text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
                >
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}