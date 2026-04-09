import React from 'react';
import { cn } from "../../lib/cn";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "rounded-2xl bg-card text-foreground border-2 border-wati-dark dark:border-zinc-700 shadow-hard transition-transform duration-300", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}