"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Camera, Sparkles, Sliders } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export default function SnappySaumyaProject() {
  const stack = ["Next.js", "TypeScript", "Cloudinary API", "Framer Motion", "Lenis"];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary px-6 md:px-12 py-24 relative z-10 max-w-5xl mx-auto flex flex-col w-full">
      {/* Back to Home */}
      <div className="mb-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to projects
        </Link>
      </div>

      {/* Hero Header */}
      <header className="border-b border-white/5 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-amber-accent mb-2 block">
            CASE STUDY
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-none">
            SnappySaumya
          </h1>
          <p className="text-text-secondary font-medium font-sans mt-3 text-sm md:text-base max-w-xl leading-relaxed">
            High-performance media management &amp; visual photography gallery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/SoumaCh03"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <FaGithub className="w-4 h-4" /> Code
          </a>
          <a
            href="https://snappysaumya.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-amber-accent text-bg-base font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,140,66,0.3)] transition-all"
          >
            Live Site <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Grid Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start w-full">
        {/* Main Details (2/3 Column) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* Overview */}
          <section className="glass-panel border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="font-display font-bold text-lg md:text-xl text-white mb-4 uppercase tracking-wider">
              Project Overview
            </h2>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed font-sans font-medium">
              SnappySaumya was built to host my travel photography records in high-definition formats without suffering from core payload weight issues. It utilizes a dynamic image loader scaling source media to appropriate viewport parameters dynamically on the fly.
            </p>
          </section>

          {/* System Architecture */}
          <section className="glass-panel border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="font-display font-bold text-lg md:text-xl text-white mb-4 uppercase tracking-wider">
              System Architecture
            </h2>
            
            {/* ASCII flow diagram in mono block */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-5 font-mono text-[11px] md:text-xs text-amber-accent/80 overflow-x-auto leading-relaxed mb-6">
              {`[ Secure Admin Session Dashboard ] 
            │
            ▼ (Multipart Form POST)
     [ Upload API Endpoint ] 
            │
            ├─► [ Cloudinary Asset CDN Store ]
            │         │
            │         ▼
            │   (Dynamic Lossless Image Compression)
            │
            └─► [ JSON Album database update ]
                      │
                      ▼
     [ Lazy Loading Client Lightbox ]`}
            </div>

            <p className="text-text-secondary text-xs md:text-sm leading-relaxed font-sans font-medium">
              The project is built on Next.js leveraging server-side cache bindings. The visualizer client uses Framer Motion layout animations to swap and reshuffle items cleanly without causing Cumulative Layout Shifts.
            </p>
          </section>

          {/* Challenges & Solutions */}
          <section className="glass-panel border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h2 className="font-display font-bold text-lg md:text-xl text-white mb-2 uppercase tracking-wider">
              Challenges &amp; Breakthroughs
            </h2>

            <div className="flex gap-4.5">
              <div className="w-8 h-8 rounded-lg bg-amber-accent/10 border border-amber-accent/20 flex items-center justify-center text-amber-accent flex-shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold tracking-wide">Dynamic Album Reordering Controls</h4>
                <p className="text-text-secondary text-xs md:text-sm mt-1 leading-relaxed font-sans font-medium">
                  Reordering massive arrays of assets without screen locking. Solved by updating local React state structures optimistically and executing asynchronous database updates in the background.
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Info panel (1/3 Column) */}
        <div className="flex flex-col gap-6 w-full">
          {/* Tech Stack */}
          <div className="glass-panel border-white/5 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-display font-bold text-base text-white mb-4 uppercase tracking-wider">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {stack.map((item) => (
                <span
                  key={item}
                  className="px-3.5 py-1.5 rounded-xl bg-white/2 border border-white/5 text-text-secondary font-mono text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="glass-panel border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 font-sans font-medium text-xs md:text-sm">
            <h3 className="font-display font-bold text-base text-white uppercase tracking-wider">
              Project Specs
            </h3>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-text-secondary">Type</span>
              <span className="text-white">Photography Portfolio</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-text-secondary">Storage CDN</span>
              <span className="text-white">Cloudinary Storage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Developer</span>
              <span className="text-white">Saumyadeep C.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
