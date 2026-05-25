"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ShoppingCart, Key, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

export default function MoveCartProject() {
  const stack = ["Next.js", "Express", "MongoDB", "Redux Toolkit", "Tailwind CSS"];

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
          <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-cyan-accent mb-2 block">
            CASE STUDY
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-none">
            MoveCart
          </h1>
          <p className="text-text-secondary font-medium font-sans mt-3 text-sm md:text-base max-w-xl leading-relaxed">
            High-speed client-side shopping cart &amp; checkout catalog.
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
            href="https://github.com/SoumaCh03"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-accent text-bg-base font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
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
              MoveCart is a high-speed e-commerce solution focused on optimizing item updates, local client calculations, and state consistency. The system features modular store management that guarantees a fluid checkout experience under 100ms.
            </p>
          </section>

          {/* System Architecture */}
          <section className="glass-panel border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="font-display font-bold text-lg md:text-xl text-white mb-4 uppercase tracking-wider">
              System Architecture
            </h2>
            
            {/* ASCII flow diagram in mono block */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-5 font-mono text-[11px] md:text-xs text-cyan-accent/80 overflow-x-auto leading-relaxed mb-6">
              {`[ Client Action dispatch ] 
            │
            ▼ (Redux Store updates)
     [ Local Cart Cache state ] 
            │
            ├─► [ Sync parameters with LocalStorage ]
            │         │
            │         ▼
            │   (Prevent layout drift on page reloads)
            │
            └─► [ Secure Serverless Checkout API ]
                      │
                      ▼
       [ Transaction Completion Screen ]`}
            </div>

            <p className="text-text-secondary text-xs md:text-sm leading-relaxed font-sans font-medium">
              The project utilizes Redux Toolkit for immutable state updates. Combined with server-side API endpoints, it ensures client pricing coordinates match secure database configurations before transaction processing.
            </p>
          </section>

          {/* Challenges & Solutions */}
          <section className="glass-panel border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-5">
            <h2 className="font-display font-bold text-lg md:text-xl text-white mb-2 uppercase tracking-wider">
              Challenges &amp; Breakthroughs
            </h2>

            <div className="flex gap-4.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center text-cyan-accent flex-shrink-0">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold tracking-wide">Client-Server Cart Synchronization</h4>
                <p className="text-text-secondary text-xs md:text-sm mt-1 leading-relaxed font-sans font-medium">
                  Ensuring product prices match server configurations during checkout calculations. Reconfigured by calculating order hashes server-side before submitting token requests to payment gateways.
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
              <span className="text-white">E-Commerce Client</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-text-secondary">State Manager</span>
              <span className="text-white">Redux Toolkit</span>
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
