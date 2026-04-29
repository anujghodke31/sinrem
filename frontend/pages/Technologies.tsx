import React from "react";
import SEO from "../components/site/SEO";
import { Container } from "../components/ui/Container";
import { TechIconSVG } from "../components/ui/TechIcons";
import { techStack } from "../lib/content";

export default function TechnologiesPage() {
  return (
    <main className="bg-bg py-24 sm:py-32">
      <SEO title="Technologies We Work With" description="Discover the technologies Sinrem Tech works with across web development, AI, mobile, cloud, and business tools." canonical="/technologies" />
      <Container>
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground">Technologies We Work With</h1>
          <p className="mt-4 text-lg text-muted-foreground font-medium">Our stack is chosen for performance, scalability, and AI-readiness.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((group) => (
            <section key={group.category} className="rounded-2xl border-2 border-black dark:border-zinc-700 bg-card p-6 shadow-hard">
              <h2 className="text-xl font-black mb-4 text-foreground">{group.category}</h2>
              <div className="grid grid-cols-2 gap-3">
                {group.techs.map((tech) => (
                  <div key={tech.name} className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2">
                    <TechIconSVG name={tech.name} className="w-5 h-5" />
                    <span className="text-xs font-bold text-foreground">{tech.name}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
