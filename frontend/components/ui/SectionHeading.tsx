import React from 'react';

export function SectionHeading(props: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      {props.eyebrow ? (
        <div className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-300 uppercase mb-3">{props.eyebrow}</div>
      ) : null}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">{props.title}</h2>
      {props.subtitle ? (
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">{props.subtitle}</p>
      ) : null}
    </div>
  );
}