"use client";

import React from "react";
import { Code2, Camera, Bike, Cpu } from "lucide-react";

interface AboutCard {
  title: string;
  role: string;
  icon: React.ReactNode;
  description: string;
  colorClass: string;
}

export default function About() {
  const pillars: AboutCard[] = [
    {
      title: "The Developer",
      role: "SYSTEMS & BACKEND",
      icon: <Code2 className="w-5 h-5 text-cyan-accent" />,
      description:
        "Building bulletproof, secure backend systems, developing RESTful/GraphQL APIs, and creating autonomous AI/ML workflows that scale. Deep obsessed with writing clean, maintainable logic.",
      colorClass: "glass-panel-glow-cyan hover:border-cyan-accent/35",
    },
    {
      title: "The Photographer",
      role: "SHUTTERBUG & VISUALIST",
      icon: <Camera className="w-5 h-5 text-amber-accent" />,
      description:
        "Framing moments along visual boundaries. Capturing travel chronicles, local street portraits, and raw atmospheric sunrises across Northeast India—from Darjeeling hills to Nongjrong valleys.",
      colorClass: "glass-panel-glow-amber hover:border-amber-accent/35",
    },
    {
      title: "The Rider",
      role: "MOTORCYCLE TOURER",
      icon: <Bike className="w-5 h-5 text-amber-accent" />,
      description:
        "Finding mental clarity on the open tarmac. Exploring remote geographical corners and negotiating twisty mountain passes on two wheels. The highway is where code-level problems find their resolution.",
      colorClass: "glass-panel-glow-amber hover:border-amber-accent/35",
    },
    {
      title: "The Builder",
      role: "PRODUCT ENGINEER",
      icon: <Cpu className="w-5 h-5 text-cyan-accent" />,
      description:
        "Converting abstract designs into premium functional products. Merging clean hardware intuition with robust frontend systems to engineer sleek interfaces that respond like living entities.",
      colorClass: "glass-panel-glow-cyan hover:border-cyan-accent/35",
    },
  ];

  return (
    <section
      id="about"
      className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 relative bg-gradient-to-b from-bg-base via-bg-surface/30 to-bg-base border-b border-white/5 overflow-hidden"
    >
      {/* Backing glows */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-accent/3 filter blur-[100px] top-[10%] left-[20%] rounded-full pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-amber-accent/3 filter blur-[100px] bottom-[10%] right-[20%] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Title */}
        <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-cyan-accent mb-3">
          PERSONAL BRAND IDENTITY
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white mb-6 text-center select-none">
          Behind the Code
        </h2>
        
        <p className="text-text-secondary text-sm md:text-base leading-relaxed text-center max-w-3xl mb-16 font-sans font-medium">
          Hi, I&apos;m <span className="text-white font-bold">Saumyadeep Chakraborty</span> (TechySaumya)—a full stack developer, photographer, and motorcyclist from West Bengal, India. I don&apos;t just code; I construct complete, premium digital experiences that marry rigorous software craftsmanship with clean visual styling.
        </p>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between min-h-[260px] group ${item.colorClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-sans font-bold tracking-wider text-text-secondary uppercase">
                    {item.role}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-white/3 flex items-center justify-center border border-white/5 transition-all group-hover:scale-105 group-hover:bg-white/5">
                    {item.icon}
                  </div>
                </div>

                <h3 className="font-display font-extrabold text-xl text-white mb-3">
                  {item.title}
                </h3>

                <p className="text-text-secondary text-[13px] leading-relaxed font-sans font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
