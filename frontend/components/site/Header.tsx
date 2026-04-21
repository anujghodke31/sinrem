import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Logo } from "../ui/Logo";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/technologies", label: "Technologies" },
  { href: "/about", label: "About" },
];

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Updated Logo: Using SVG Component directly */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group" 
          aria-label="Sinrem Tech"
        >
          <div className="h-10 w-auto flex items-center">
             <Logo className="h-full w-auto text-[#6E4CAE] dark:text-text group-hover:text-brand-500 transition-colors duration-300" />
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active 
                    ? "bg-muted/10 text-foreground font-semibold" 
                    : "text-foreground/60 hover:text-foreground hover:bg-muted/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Button href="/contact" variant="primary" className="rounded-full px-5">
            Connect
            <ArrowRight size={16} />
          </Button>
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-foreground/60 hover:bg-muted/10 hover:text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="md:hidden border-t border-border bg-bg">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8 flex flex-col gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-foreground/70 hover:bg-muted/10 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-4 mt-2 border-t border-border">
              <ThemeToggle />
              <Button href="/contact" className="flex-1">
                Connect
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}