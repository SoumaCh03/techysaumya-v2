"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Code, Bike, Calendar, ShieldCheck, MapPin } from "lucide-react";

interface JourneyItem {
  year: string;
  type: "code" | "ride" | "hybrid";
  title: string;
  location: string;
  desc: string;
  bullets: string[];
}

export default function JourneyPage() {
  const [filter, setFilter] = useState<"all" | "code" | "ride">("all");

  const logs: JourneyItem[] = [
    {
      year: "2024 - Present",
      type: "code",
      title: "AI Integrations & Next.js Architectures",
      location: "Cooch Behar, West Bengal",
      desc: "Evolving web applications into Next.js serverless structures. Building custom vector databases, multi-agent frameworks, and fast user interfaces.",
      bullets: [
        "Migrated portfolio components to Next.js 14 App Router, cutting server bundle weights and improving LCP.",
        "Programmed NLP systems classifying technical vehicle readouts dynamically.",
        "Refactored e-commerce store managers to process parallel payment requests."
      ]
    },
    {
      year: "2023",
      type: "ride",
      title: "Meghalaya & Nongjrong Expedition",
      location: "East Khasi Hills, Meghalaya",
      desc: "Solo motorcycle touring chasing sunrises over clouds in Nongjrong and navigating high-elevation curves.",
      bullets: [
        "Negotiated 900+ kilometers of twisty roads, gravel trails, and river coordinates.",
        "Captured landscape portfolios of cloud valleys utilizing Nikon DSLR equipment.",
        "Wrote routing assist tools helping touring riders trace safe route segments."
      ]
    },
    {
      year: "2022",
      type: "code",
      title: "Distributed Caching & Backend Architecture",
      location: "Cooch Behar, West Bengal",
      desc: "Tuning data pipelines, writing REST/GraphQL frameworks, and profiling memory leaks inside database pools.",
      bullets: [
        "Integrated Redis layers reducing latency on API gateways to sub-100ms thresholds.",
        "Optimized MongoDB aggregations to handle multi-relational queries.",
        "Designed clean coding methodologies to prevent developer environment drifts."
      ]
    },
    {
      year: "2021",
      type: "hybrid",
      title: "Genesis of Terminal and Tarmac",
      location: "West Bengal, India",
      desc: "Purchased first DSLR (Nikon D7500), bought touring equipment, and wrote initial software files.",
      bullets: [
        "Learned core data structures, algorithms, and modular logic in Python & C++.",
        "Practiced street compositions and light exposure calculations.",
        "Completed first long-distance motorcycle touring run across regional borders."
      ]
    }
  ];

  const filteredLogs = logs.filter((log) => {
    if (filter === "all") return true;
    if (filter === "code") return log.type === "code" || log.type === "hybrid";
    if (filter === "ride") return log.type === "ride" || log.type === "hybrid";
    return true;
  });

  return (
    <div className="min-h-screen bg-bg-base text-text-primary px-6 md:px-12 py-24 relative z-10 max-w-5xl mx-auto flex flex-col w-full">
      {/* Back to Home */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-cyan-accent mb-2 block">
            CHRONOLOGY ARCHIVE
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-none flex items-center gap-3">
            <Compass className="w-7 h-7 text-cyan-accent" /> Journey Logs
          </h1>
          <p className="text-text-secondary font-medium font-sans mt-3 text-sm md:text-base max-w-xl leading-relaxed">
            Trace my milestones across codebase deployments and open-highway motorcycle tracks.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex bg-white/3 border border-white/5 rounded-xl p-1 font-sans text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === "all" ? "bg-cyan-accent text-bg-base" : "text-text-secondary hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("code")}
            className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === "code" ? "bg-cyan-accent text-bg-base" : "text-text-secondary hover:text-white"
            }`}
          >
            Coding
          </button>
          <button
            onClick={() => setFilter("ride")}
            className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              filter === "ride" ? "bg-cyan-accent text-bg-base" : "text-text-secondary hover:text-white"
            }`}
          >
            Riding
          </button>
        </div>
      </header>

      {/* Vertical Timeline */}
      <div className="relative w-full flex flex-col gap-12">
        {/* Vertical Line */}
        <div className="absolute left-[20px] top-4 bottom-4 w-[1px] bg-white/5" />

        {filteredLogs.map((log, idx) => (
          <div
            key={idx}
            className="relative pl-12 flex flex-col gap-3 group animate-in fade-in duration-300"
          >
            {/* Timeline Dot Indicator */}
            <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-bg-surface border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg">
              {log.type === "code" ? (
                <Code className="w-4 h-4 text-cyan-accent" />
              ) : log.type === "ride" ? (
                <Bike className="w-4 h-4 text-amber-accent" />
              ) : (
                <Compass className="w-4 h-4 text-cyan-accent" />
              )}
            </div>

            {/* Event Content Box */}
            <div className="glass-panel border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-4 shadow-xl">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-accent uppercase bg-cyan-accent/5 border border-cyan-accent/10 px-2.5 py-0.5 rounded-full">
                    {log.year}
                  </span>
                  <h3 className="font-display font-black text-xl text-white mt-2 leading-tight">
                    {log.title}
                  </h3>
                </div>
                
                <span className="text-xs font-semibold text-text-muted flex items-center gap-1.5 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-amber-accent" /> {log.location}
                </span>
              </div>

              <p className="text-text-secondary text-xs md:text-sm leading-relaxed font-sans font-medium">
                {log.desc}
              </p>

              {/* Detail list bullets */}
              <ul className="list-inside list-disc text-text-secondary text-xs md:text-sm mt-2 flex flex-col gap-2 font-sans font-medium">
                {log.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="leading-relaxed">
                    <span className="text-text-primary">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
