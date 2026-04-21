import React from "react";
import { useSEO } from "../lib/useSEO";
import { Container } from "../components/ui/Container";
import { TechIconSVG } from "../components/ui/TechIcons";

const groups = [
  { title: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind"] },
  { title: "Backend", items: ["Node.js", "Python", "Golang", "FastAPI"] },
  { title: "Mobile", items: ["Android"] },
  { title: "Database", items: ["PostgreSQL", "MongoDB"] },
  { title: "DevOps", items: ["AWS", "Google Cloud", "Docker", "Git", "Vercel"] },
  { title: "AI/ML", items: ["TensorFlow", "PyTorch", "OpenCV", "OpenAI", "LangChain"] },
];

export default function TechnologiesPage() {
  useSEO({
    title: "Technologies We Work With | Sinrem Tech",
    description: "Discover the technologies Sinrem Tech works with across frontend, backend, mobile, databases, DevOps, and AI/ML for robust product delivery.",
    path: "/technologies",
  });

  return (
    <main className="bg-bg py-24 sm:py-32">
      <Container>
        <div className="max-w-3xl mb-12">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground">Technologies We Work With</h1>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <section key={group.title} className="rounded-2xl border-2 border-black dark:border-zinc-700 bg-card p-6 shadow-hard">
              <h2 className="text-xl font-black mb-4 text-foreground">{group.title}</h2>
              <div className="grid grid-cols-2 gap-3">
                {group.items.map((item) => (
                  <div key={`${group.title}-${item}`} className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-2">
                    <TechIconSVG name={item} className="w-5 h-5" />
                    <span className="text-xs font-bold text-foreground">{item}</span>
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
