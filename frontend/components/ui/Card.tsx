import React from 'react';
import { cn } from "../../lib/cn";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "rounded-2xl bg-white text-text border-2 border-wati-dark shadow-hard transition-transform duration-300", 
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}