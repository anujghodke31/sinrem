import React from 'react';
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "ghost";

export function Button(props: {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  const v = props.variant ?? "primary";
  
  // Updated Base Styles: Hard shadow, border, distinct interaction
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-wati-dark px-5 py-3 text-sm font-bold tracking-wide transition-all duration-200 " +
    "shadow-hard hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#1D1D1B] " +
    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const styles: Record<Variant, string> = {
    primary:
      "bg-wati-green text-wati-dark hover:bg-[#00D075]",
    secondary:
      "bg-white dark:bg-zinc-800 text-wati-dark dark:text-foreground hover:bg-gray-50 dark:hover:bg-zinc-700 dark:border-zinc-600",
    ghost:
      "bg-transparent border-transparent shadow-none hover:bg-foreground/5 text-foreground/70 hover:text-foreground hover:shadow-none hover:translate-y-0 active:translate-x-0 active:translate-y-0",
  };

  const className = cn(base, styles[v], props.className);

  if (props.href) {
    if (props.href.startsWith("http") || props.href.startsWith("mailto:")) {
       return (
        <a 
          href={props.href} 
          className={className} 
          target={props.href.startsWith("http") ? "_blank" : undefined} 
          rel={props.href.startsWith("http") ? "noreferrer" : undefined}
          aria-disabled={props.disabled}
        >
          {props.children}
        </a>
       )
    }
    return (
      <Link to={props.href} className={className} aria-disabled={props.disabled}>
        {props.children}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} className={className} type={props.type || "button"} disabled={props.disabled}>
      {props.children}
    </button>
  );
}