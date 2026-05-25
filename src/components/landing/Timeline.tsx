"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Compass, Code, Bike, ArrowRight } from "lucide-react";

interface TimelineEvent {
  year: string;
  type: "code" | "ride" | "hybrid";
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}

export default function Timeline() {
  const events: TimelineEvent[] = [
    {
      year: "2024 - Present",
      type: "code",
      title: "AI Integration & Full Stack Systems",
      subtitle: "TechySaumya Labs",
      description:
        "Architecting autonomous multi-agent workflows, training specific vector embeddings, and building premium serverless applications that scale globally.",
      icon: <Code className="w-4 h-4 text-cyan-accent" />,
    },
    {
      year: "2023",
      type: "ride",
      title: "Expedition to Nongjrong & East Khasi",
      subtitle: "Rider Diaries",
      description:
        "A solo motorcycle voyage exploring valley sunrises and crossing high mountain curves of Meghalaya to capture raw visual records.",
      icon: <Bike className="w-4 h-4 text-amber-accent" />,
    },
    {
      year: "2022",
      type: "code",
      title: "Backend & Systems Infrastructure",
      subtitle: "High Scale Architectures",
      description:
        "Designed and tuned Redis caching configurations, decoupled relational databases, and engineered robust REST/GraphQL APIs with sub-millisecond response latency.",
      icon: <Code className="w-4 h-4 text-cyan-accent" />,
    },
    {
      year: "2021",
      type: "hybrid",
      title: "The Junction of Tarmac and Terminal",
      subtitle: "Genesis",
      description:
        "Began combining structured computer science paradigms with photographic narratives and long-distance motorcycle road trips.",
      icon: <Compass className="w-4 h-4 text-cyan-accent" />,
    },
  ];

  return (
    <section
      id="timeline"
      className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 relative bg-gradient-to-b from-bg-base via-bg-surface/30 to-bg-base border-b border-white/5 overflow-hidden"
    >
      <div className="absolute w-[400px] h-[400px] bg-cyan-accent/2 filter blur-[120px] top-[15%] right-[10%] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Header */}
        <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-cyan-accent mb-3">
          CHRONOLOGICAL LOGS
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white mb-6 text-center select-none">
          My Journey
        </h2>
        <p className="text-text-secondary text-sm md:text-base leading-relaxed text-center max-w-3xl mb-16 font-sans font-medium">
          A brief log of key technical deployments and geographical coordinates crossed along the road.
        </p>

        {/* Vertical Timeline Layout */}
        <div className="relative w-full max-w-3xl flex flex-col gap-10">
          {/* Vertical Central Line */}
          <div className="absolute left-[17px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-[1px] bg-white/10" />

          {events.map((event, idx) => {
            const isLeft = idx % 2 === 0;
            const accentColor = event.type === "ride" ? "border-amber-accent/20 hover:border-amber-accent/40" : "border-cyan-accent/20 hover:border-cyan-accent/40";
            
            return (
              <div
                key={idx}
                className={`relative flex flex-col md:flex-row items-start md:justify-between w-full group`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-1.5 w-9 h-9 rounded-full bg-bg-surface border border-white/10 flex items-center justify-center z-10 transition-transform group-hover:scale-110 shadow-lg">
                  {event.icon}
                </div>

                {/* Left Side Content Box (Desktop Only) */}
                <div className={`hidden md:block w-[44%] ${isLeft ? "text-right" : "opacity-0 pointer-events-none"}`}>
                  {isLeft && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-muted">{event.year}</span>
                      <h3 className="font-display font-bold text-lg text-white">{event.title}</h3>
                      <span className="text-xs font-semibold text-cyan-accent/80">{event.subtitle}</span>
                      <p className="text-text-secondary text-xs mt-2 leading-relaxed font-sans font-medium">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Side Content Box (Desktop Only) */}
                <div className={`hidden md:block w-[44%] ${!isLeft ? "text-left" : "opacity-0 pointer-events-none"}`}>
                  {!isLeft && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-mono font-bold tracking-widest text-text-muted">{event.year}</span>
                      <h3 className="font-display font-bold text-lg text-white">{event.title}</h3>
                      <span className="text-xs font-semibold text-amber-accent/80">{event.subtitle}</span>
                      <p className="text-text-secondary text-xs mt-2 leading-relaxed font-sans font-medium">
                        {event.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mobile Content Box (Left-aligned always, hidden on desktop) */}
                <div className="md:hidden pl-12 flex flex-col gap-1 w-full text-left">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-text-muted">{event.year}</span>
                  <h3 className="font-display font-bold text-base text-white">{event.title}</h3>
                  <span className="text-xs font-semibold text-cyan-accent/80">{event.subtitle}</span>
                  <p className="text-text-secondary text-xs mt-1.5 leading-relaxed font-sans font-medium">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <Link
          href="/journey"
          className="flex items-center gap-2 mt-16 px-6 py-3 rounded-xl border border-white/10 hover:border-cyan-accent/30 hover:bg-cyan-accent/5 hover:text-cyan-accent text-xs font-semibold uppercase tracking-wider transition-all duration-300 font-sans cursor-pointer"
        >
          View Full Interactive Roadmap <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
