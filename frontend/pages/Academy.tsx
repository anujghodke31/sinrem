import React from "react";
import { useSEO } from "../lib/useSEO";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

export default function AcademyPage() {
  useSEO({
    title: "Sinrem Academy | Learn. Build. Grow.",
    description: "Sinrem Academy offers practical training for developers and teams to learn modern software, AI workflows, and production-grade product execution.",
    path: "/academy",
  });

  return (
    <main className="bg-bg py-24 sm:py-32">
      <Container>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground mb-4">Sinrem Academy</h1>
        <p className="text-foreground/70 mb-8">Learn. Build. Grow.</p>
        <Button href="/connect">Connect With Us</Button>
      </Container>
    </main>
  );
}
