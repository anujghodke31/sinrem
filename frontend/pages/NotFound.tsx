import React from 'react';
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <main className="py-20">
      <Container>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-white/70">The page you’re looking for doesn’t exist.</p>
        <div className="mt-6">
          <Button href="/">Go home</Button>
        </div>
      </Container>
    </main>
  );
}