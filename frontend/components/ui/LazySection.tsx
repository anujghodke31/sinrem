import React from "react";

type LazySectionProps = {
  children: React.ReactNode;
  placeholderMinHeight: string;
  className?: string;
};

export function useLazyMount(rootMargin = "200px") {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (mounted) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return { ref, mounted };
}

export function LazySection({ children, placeholderMinHeight, className = "" }: LazySectionProps) {
  const { ref, mounted } = useLazyMount("200px");

  if (mounted) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ minHeight: placeholderMinHeight }}
    />
  );
}
