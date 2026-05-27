"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useProviders } from "@/app/providers";
import Image from "next/image";

export default function Hero() {
  const originalText = "TECHYSAUMYA";
  const finalText = "SAUMYADEEP CHAKRABORTY";

  const [displayText, setDisplayText] = useState(originalText);
  const { lenis } = useProviders();

  // Typing and Morph Swapping Engine (Single-mount, re-render immune loop)
  useEffect(() => {
    let currentText = originalText;
    let currentPhase: "wait" | "delete" | "type" = "wait";
    let timeout: NodeJS.Timeout;

    const tick = () => {
      if (currentPhase === "wait") {
        timeout = setTimeout(() => {
          currentPhase = "delete";
          tick();
        }, 2400);
      } else if (currentPhase === "delete") {
        if (currentText.length > 0) {
          currentText = currentText.slice(0, -1);
          setDisplayText(currentText);
          timeout = setTimeout(tick, 80);
        } else {
          currentPhase = "type";
          timeout = setTimeout(tick, 50);
        }
      } else if (currentPhase === "type") {
        if (currentText.length < finalText.length) {
          currentText = finalText.slice(0, currentText.length + 1);
          setDisplayText(currentText);
          timeout = setTimeout(tick, 90);
        }
      }
    };

    tick();

    return () => clearTimeout(timeout);
  }, []);

  const handleScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      if (lenis) {
        lenis.scrollTo(element, { offset: -80, duration: 1.2 });
      } else {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section
      id="home"
      className="min-h-[85vh] lg:min-h-[90vh] w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 px-6 md:px-12 lg:px-20 py-20 md:py-24 lg:py-28 relative overflow-hidden bg-gradient-to-b from-bg-base/70 via-bg-surface/50 to-bg-base/90 border-b border-white/5"
    >
      {/* Cinematic backing glows */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-accent/5 filter blur-[120px] -top-[200px] -left-[100px] rounded-full pointer-events-none z-0" />
      <div className="absolute w-[400px] h-[400px] bg-amber-accent/5 filter blur-[120px] -bottom-[150px] -right-[50px] rounded-full pointer-events-none z-0" />

      {/* Grid Overlay */}
      <div className="grid-space-overlay opacity-60 z-0" />

      {/* LEFT CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10 max-w-2xl lg:max-w-3xl">
        {/* Active Badge */}
        <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full border border-cyan-accent/20 bg-white/3 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.05)] mb-6">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-accent shadow-[0_0_8px_cyan]"></span>
          </span>
          <span className="text-[10px] md:text-[11px] font-sans font-bold tracking-[3px] uppercase text-text-primary">
            FULL STACK SYSTEMS ARCHITECT
          </span>
        </div>

        {/* Dynamic Typing Title */}
        <div className="min-h-auto lg:min-h-[120px] flex items-center justify-center lg:justify-start w-full mb-5">
          <h1 className="font-display font-black text-[2rem] sm:text-[2.6rem] md:text-[3.4rem] lg:text-[3.5rem] xl:text-[4rem] leading-[1.08] md:leading-[1.02] text-white tracking-tighter transition-all duration-300 select-none drop-shadow-[0_0_25px_rgba(255,255,255,0.04)]">
            {displayText}
            <span className="typing-cursor">|</span>
          </h1>
        </div>

        {/* Identity line */}
        <div className="relative pl-0 lg:pl-4 border-l-0 lg:border-l border-cyan-accent/30 py-1 mb-6">
          <p className="font-display italic text-text-primary text-base md:text-lg font-medium tracking-wide">
            &ldquo;Some problems are solved in code. Others on two wheels.&rdquo;
          </p>
        </div>

        {/* Roles Details */}
        <p className="text-text-secondary text-xs md:text-sm max-w-xl leading-relaxed mb-8 font-sans font-medium opacity-85">
          Backend Systems Engineer &bull; Custom AI Solutions &bull; Photography Storyteller. Specializing in high-performance digital craft.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
          <button
            onClick={() => handleScrollTo("projects")}
            className="group px-6 py-3 bg-gradient-to-r from-cyan-accent to-cyan-500 text-bg-base font-bold text-xs tracking-wider uppercase rounded-xl hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            View Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleScrollTo("contact")}
            className="px-6 py-3 border border-white/10 hover:border-cyan-accent/30 bg-white/2 hover:bg-cyan-accent/5 text-text-primary hover:text-cyan-accent rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-md cursor-pointer"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* RIGHT SIDE: ORBIT PORTRAIT CONTAINER */}
      <div className="flex-shrink-0 relative z-10 w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[280px] lg:h-[280px] xl:w-[340px] xl:h-[340px] flex items-center justify-center scale-95 lg:scale-100">
        {/* Dynamic backing circular glows */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-accent/8 to-transparent rounded-full filter blur-2xl animate-pulse" />
        
        {/* Main Spinning Orbit Ring */}
        <div className="absolute w-[86%] h-[86%] border border-cyan-accent/12 rounded-full animate-spin-slow pointer-events-none" />
        <div className="absolute w-[78%] h-[78%] border-2 border-cyan-accent/20 rounded-full shadow-[0_0_30px_rgba(0,240,255,0.15)] pointer-events-none" />
        
        {/* Secondary reverse spin ring with orbital dot */}
        <div className="absolute w-[86%] h-[86%] rounded-full animate-spin-slow-reverse pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-accent shadow-[0_0_12px_cyan]" />
        </div>

        {/* Profile portrait frame */}
        <div className="relative w-[66%] h-[66%] rounded-full overflow-hidden border-4 border-cyan-accent/30 shadow-[0_0_40px_rgba(0,240,255,0.25)] bg-bg-surface z-10 group">
          <Image
            src="/saumyadeep-chakraborty-techysaumya-portrait.jpg"
            alt="Saumyadeep Chakraborty portrait"
            width={340}
            height={340}
            priority
            className="w-full h-full object-cover scale-102 transition-transform duration-700 group-hover:scale-108"
          />
        </div>

        {/* Dynamic floating technology markers */}
        <div className="absolute top-[16%] -right-[8%] glass-panel border-cyan-accent/30 text-cyan-accent text-[10px] font-semibold px-3.5 py-1.5 rounded-xl z-20 shadow-lg select-none hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
          AI / ML
        </div>

        <div className="absolute bottom-[18%] -left-[15%] glass-panel border-cyan-accent/30 text-cyan-accent text-[10px] font-semibold px-3.5 py-1.5 rounded-xl z-20 shadow-lg select-none hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
          BACKEND
        </div>
      </div>
    </section>
  );
}
