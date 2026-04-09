import React from 'react';
import { cn } from "../../lib/cn";

export function Badge(props: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full bg-wati-yellow px-3 py-1 text-xs font-bold text-wati-dark border-2 border-wati-dark shadow-[2px_2px_0px_0px_#1D1D1B]", 
      props.className
    )}>
      {props.children}
    </span>
  );
}