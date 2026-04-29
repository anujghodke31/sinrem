import React from 'react';
import { Link } from 'react-router-dom';
import { site } from "../../lib/site";
import { Linkedin, Instagram } from "lucide-react";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5">
          {/* Logo */}
          <Link to="/" aria-label="Sinrem Tech Home">
            <Logo className="h-8 w-auto text-foreground hover:text-brand-500 transition-colors" />
          </Link>

          {/* Social + Email row */}
          <div className="flex items-center gap-6">
            <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-brand-500 transition-colors" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-foreground/50 hover:text-brand-500 transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <span className="w-px h-5 bg-border" />
            <a href={`mailto:${site.email}`} className="text-sm text-foreground/60 hover:text-brand-500 transition-colors">
              {site.email}
            </a>
          </div>

          {/* Members Login */}
          <Link to="/login" className="text-xs font-medium text-foreground/40 hover:text-foreground/70 transition-colors uppercase tracking-wider">
            Members Login
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-4 text-center text-xs text-foreground/40">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
