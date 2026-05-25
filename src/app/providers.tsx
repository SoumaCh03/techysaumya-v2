"use client";

import React, { useEffect, createContext, useContext } from "react";
import Lenis from "lenis";

const ProvidersContext = createContext<{ lenis: Lenis | null }>({ lenis: null });

export const useProviders = () => useContext(ProvidersContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = React.useState<Lenis | null>(null);

  useEffect(() => {
    // Only initialize Lenis smooth scroll on desktop screens (>= 1024px)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return;
    }

    let lenis: Lenis | null = null;
    let animationFrameId: number | null = null;

    try {
      // 1. Initialize Lenis Smooth Scroll
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Cubic-bezier approximation
        smoothWheel: true,
        wheelMultiplier: 1.0,
      });

      const currentLenis = lenis;

      // Defer state updates to avoid synchronous setState inside useEffect React warnings
      requestAnimationFrame(() => {
        setLenisInstance(currentLenis);
      });

      // 2. Setup requestAnimationFrame tick loop
      const raf = (time: number) => {
        if (currentLenis) {
          currentLenis.raf(time);
          animationFrameId = requestAnimationFrame(raf);
        }
      };

      animationFrameId = requestAnimationFrame(raf);
    } catch (e) {
      console.error("Lenis smooth scroll failed to initialize:", e);
    }

    // 3. Prevent scroll restoration jumping on reload
    if (typeof window !== "undefined" && window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <ProvidersContext.Provider value={{ lenis: lenisInstance }}>
      {children}
    </ProvidersContext.Provider>
  );
}
