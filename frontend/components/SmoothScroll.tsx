'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    } as any);

    // Store lenis instance globally so components can access it
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis;
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      if (typeof window !== 'undefined') {
        (window as any).lenis = null;
      }
      lenis.destroy();
    };
  }, []);

  // Reset scroll position when pathname changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lenisInstance = (window as any).lenis;
      if (lenisInstance && typeof lenisInstance.scrollTo === 'function') {
        // Small delay to ensure page has rendered
        setTimeout(() => {
          lenisInstance.scrollTo(0, { immediate: true });
        }, 0);
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
  }, [pathname]);

  return <>{children}</>;
}

