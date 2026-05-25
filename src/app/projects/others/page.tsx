"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Code, Sparkles, FolderGit2 } from "lucide-react";

interface OtherProject {
  title: string;
  desc: string;
  link: string;
  tags: string[];
}

export default function OthersProjectsPage() {
  const projects: OtherProject[] = [
    {
      title: "AI Telegram Bot",
      desc: "Smart multi-intent AI assistant featuring automated routing, weather telemetry integration, and custom API query responders.",
      link: "https://t.me/WaxWing_Rider_helper_bot",
      tags: ["Python", "Telegram API", "NLP APIs", "FastAPI"],
    },
    {
      title: "Autocraft E-Commerce",
      desc: "Custom product catalogs and ordering features designed for Autocraft car decoration services based in Cooch Behar.",
      link: "https://github.com/SoumaCh03/autocraft-ecomm",
      tags: ["JavaScript", "React", "E-Commerce API", "Tailwind CSS"],
    },
    {
      title: "Keyboard Tester",
      desc: "A full-size interactive keyboard testing web application for real-time key press diagnostics and latency checks.",
      link: "https://soumach03.github.io/Keyboard-Tester/",
      tags: ["JavaScript", "HTML5", "CSS3", "DOM API"],
    },
    {
      title: "TinDog Home",
      desc: "Modern and elegant landing page website designed for a social puppy mating and happiness platform.",
      link: "https://soumach03.github.io/TinDog-Home/",
      tags: ["Bootstrap", "HTML5", "CSS3"],
    },
    {
      title: "GoCart India",
      desc: "Performance-focused e-commerce layouts and catalog browsing interface designed for scalable shopping flows.",
      link: "https://soumach03.github.io/gocart-ind/",
      tags: ["React", "CSS Modules", "Vite"],
    },
    {
      title: "Guess The Number",
      desc: "An engaging JavaScript game that guides users to predict dynamically generated numeric values.",
      link: "https://github.com/SoumaCh03/Guess-The-Number",
      tags: ["JavaScript", "HTML5", "CSS3"],
    },
    {
      title: "Jai Hind",
      desc: "Patriotic visual project dedicated to India's 78th Independence celebrations featuring animated flags and vectors.",
      link: "https://soumach03.github.io/Jai-Hind/",
      tags: ["HTML5", "CSS3", "Animations"],
    },
    {
      title: "Anniversary 2024",
      desc: "Custom dynamic page celebrating love milestones with interactive timelines and transition sequences.",
      link: "https://github.com/SoumaCh03/Anniversary_2024",
      tags: ["HTML5", "CSS3", "JavaScript"],
    },
    {
      title: "Cloud Portfolio",
      desc: "Production-ready React + Express portfolio server and client structure configured for scalable cloud deployment.",
      link: "https://github.com/SoumaCh03/portfolio",
      tags: ["React", "Express", "Node.js", "CORS"],
    },
  ];

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

      {/* Header */}
      <header className="border-b border-white/5 pb-8 mb-12">
        <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-cyan-accent mb-2 block">
          ARCHIVE &amp; EXPERIMENTS
        </span>
        <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-none">
          Other Projects
        </h1>
        <p className="text-text-secondary font-medium font-sans mt-3 text-sm md:text-base max-w-xl leading-relaxed">
          A collection of minor experiments, static landing pages, and diagnostic web tools.
        </p>
      </header>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {projects.map((project, idx) => (
          <div
            key={idx}
            className="glass-panel border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-accent/15 group shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <FolderGit2 className="w-5 h-5 text-cyan-accent" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-text-muted">PROJECT #{idx + 1}</span>
              </div>

              <h3 className="font-display font-extrabold text-lg text-white mb-2 leading-snug group-hover:text-cyan-accent transition-colors">
                {project.title}
              </h3>

              <p className="text-text-secondary text-xs leading-relaxed mb-6 font-sans font-medium">
                {project.desc}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/5 pt-4 mt-2">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/2 text-text-muted select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-white hover:text-cyan-accent transition-colors w-fit group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
              >
                Launch Code <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
