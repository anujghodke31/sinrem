import React from "react";
import { useSEO } from "../lib/useSEO";
import { Container } from "../components/ui/Container";

export default function BlogPage() {
  useSEO({
    title: "Blog | Sinrem Tech",
    description: "Read insights from Sinrem Tech on AI automation, product engineering, cloud architecture, and practical software strategies for growing businesses.",
    path: "/blog",
  });

  return (
    <main className="bg-bg py-24 sm:py-32">
      <Container>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground mb-4">Blog</h1>
        <p className="text-foreground/70">Insights and updates from Sinrem Tech.</p>
      </Container>
    </main>
  );
}
