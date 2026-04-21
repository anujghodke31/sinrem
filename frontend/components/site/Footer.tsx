import React from 'react';
import { Link } from 'react-router-dom';
import { site } from "../../lib/site";
import { Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-20 bg-muted/5">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 grid gap-12 grid-cols-1 md:grid-cols-2">
        {/* Brand Column */}
        <div className="col-span-1">
          <div className="text-base font-bold text-foreground">{site.name}</div>
          <p className="mt-4 text-sm text-foreground/60 leading-relaxed max-w-xs">
            Bespoke software solutions built for performance, scale, and secure growth.
          </p>
        </div>

        {/* Contact Column */}
        <div>
          <div className="font-semibold text-foreground mb-6">Contact</div>
          <div className="grid gap-3 text-sm text-foreground/60">
            <a href={`mailto:${site.email}`} className="hover:text-brand-500 transition-colors">{site.email}</a>
            <Link to="/login" className="hover:text-brand-500 transition-colors">Members Login</Link>
            <div className="flex gap-4 pt-4">
              <a href="https://www.linkedin.com/company/sharadchandra-techventures/posts/?feedView=all" target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-brand-500 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/sinrem_" target="_blank" rel="noreferrer" className="text-foreground/60 hover:text-brand-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-8 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}