"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  driftY: number;
  color: string;
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    const starCount = 140; // Perfect balance between stellar density and performance

    // Handle high DPI resizes
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      initStars();
    };

    const initStars = () => {
      stars = [];
      const w = window.innerWidth;
      const h = window.innerHeight;

      for (let i = 0; i < starCount; i++) {
        // Randomly assign standard white or subtle neon cyan stars
        const isCyan = Math.random() > 0.88;
        const color = isCyan ? "rgba(0, 240, 255, " : "rgba(232, 244, 255, ";
        
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.35 + 0.3,
          alpha: Math.random() * 0.7 + 0.1,
          twinkleSpeed: Math.random() * 0.015 + 0.003,
          driftY: Math.random() * 0.04 + 0.015,
          color,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Render star clusters
      stars.forEach((star) => {
        // Twinkle (alpha oscillation)
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.85 || star.alpha < 0.1) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // Slow vertical drift
        star.y -= star.driftY;
        if (star.y < 0) {
          star.y = window.innerHeight;
          star.x = Math.random() * window.innerWidth;
        }

        ctx.fillStyle = `${star.color}${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block bg-[#050505]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
