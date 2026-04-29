import React from "react";
import SEO from "../components/site/SEO";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <main className="bg-bg py-24 sm:py-32">
      <SEO title="Blog" description="Insights from Sinrem Tech on AI automation, product engineering, cloud architecture, and practical software strategies." canonical="/blog" />
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg mb-8">Insights and updates from Sinrem Tech. Coming soon.</p>
          <Button href="/contact">
            Get Notified <ArrowRight size={16} />
          </Button>
        </div>
      </Container>
    </main>
  );
}
