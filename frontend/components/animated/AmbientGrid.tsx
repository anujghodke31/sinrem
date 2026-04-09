import React from 'react';

export function AmbientGrid() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            // Light mode: dark lines. Dark mode: white lines — handled via CSS var
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          opacity: 0.08,
          maskImage: "radial-gradient(600px 380px at 20% 15%, black 40%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(600px 380px at 20% 15%, black 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(14,219,160,.35), transparent 45%), radial-gradient(circle at 80% 20%, rgba(37,245,181,.22), transparent 45%)",
        }}
      />
    </div>
  );
}