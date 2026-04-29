import React from 'react';
import SEO from '../components/site/SEO';
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <main className="py-32 bg-bg min-h-[60vh] flex items-center">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." noIndex={true} />
      <Container>
        <div className="max-w-lg">
          <div className="text-8xl font-black text-foreground/10 mb-4">404</div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Page not found</h1>
          <p className="mt-3 text-foreground/60 mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <Button href="/">Go home</Button>
        </div>
      </Container>
    </main>
  );
}
