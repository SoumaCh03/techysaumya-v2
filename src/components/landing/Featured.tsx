"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, FolderGit2, Sparkles } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  stack: string[];
  link: string;
  image: string;
  colorClass: string;
  borderClass: string;
}

export default function Featured() {
  const projects: ProjectItem[] = [
    {
      id: "autocraft",
      title: "AUTOCRAFT",
      category: "FULL STACK E-COMMERCE",
      tagline: "Production-grade MERN Automobile E-Commerce Platform",
      description: "Production-grade MERN automobile e-commerce platform featuring authentication, admin dashboard, product management, secure checkout, Razorpay integration, order management, analytics, wishlist, reviews, coupons, responsive UI, and enterprise-level architecture.",
      stack: ["React", "Node.js", "MongoDB", "Razorpay", "Tailwind CSS"],
      link: "https://github.com/SoumaCh03/autocraft-ecomm",
      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-amber-500/10 to-transparent",
      borderClass: "hover:border-amber-accent/25 hover:shadow-[0_0_30px_rgba(255,140,66,0.06)]",
    },
    {
      id: "codeac",
      title: "Codeac AI Code Reviewer",
      category: "AI DEVELOPER TOOL",
      tagline: "AI-Powered Automated Code Review Platform",
      description: "AI-powered automated code review platform capable of analyzing repositories, identifying issues, suggesting improvements, and assisting developers with intelligent code quality analysis.",
      stack: ["Python", "FastAPI", "LLM", "Docker"],
      link: "https://github.com/SoumaCh03/Codeac-AI-Code-Reviewer",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-cyan-500/10 to-transparent",
      borderClass: "hover:border-cyan-accent/25 hover:shadow-[0_0_30px_rgba(0,240,255,0.06)]",
    },
    {
      id: "novasosh",
      title: "NovaSosh",
      category: "FULL STACK APPLICATION",
      tagline: "Modern Scalable Application Architecture",
      description: "Modern TypeScript-based application demonstrating scalable architecture, clean code organization, and contemporary development practices.",
      stack: ["TypeScript", "Next.js", "Tailwind CSS"],
      link: "https://github.com/SoumaCh03/NovaSosh",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-amber-500/10 to-transparent",
      borderClass: "hover:border-amber-accent/25 hover:shadow-[0_0_30px_rgba(255,140,66,0.06)]",
    },
    {
      id: "telegram-bot",
      title: "AI Telegram Bot",
      category: "AI CHAT AGENT",
      tagline: "Automated Routing & Multi-Intent Assistant Bot",
      description: "Smart multi-intent AI assistant featuring automated routing, weather telemetry integration, distress assistance, and custom API query responders.",
      stack: ["Python", "Telegram API", "NLP APIs", "FastAPI"],
      link: "https://t.me/WaxWing_Rider_helper_bot",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-cyan-500/10 to-transparent",
      borderClass: "hover:border-cyan-accent/25 hover:shadow-[0_0_30px_rgba(0,240,255,0.06)]",
    },
    {
      id: "keyboard-tester",
      title: "Keyboard Tester",
      category: "HARDWARE DIAGNOSTIC",
      tagline: "Interactive Mechanical Diagnostic & Latency Checks",
      description: "A full-size interactive keyboard testing web application for real-time key press diagnostics and latency checks.",
      stack: ["JavaScript", "HTML5", "CSS3", "DOM API"],
      link: "https://soumach03.github.io/Keyboard-Tester/",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-amber-500/10 to-transparent",
      borderClass: "hover:border-amber-accent/25 hover:shadow-[0_0_30px_rgba(255,140,66,0.06)]",
    },
    {
      id: "tindog-home",
      title: "TinDog Home",
      category: "LANDING INTERFACE",
      tagline: "Modern Landing Page Website for Pet Happiness Platform",
      description: "Modern and elegant landing page website designed for a social puppy mating and dog happiness platform.",
      stack: ["Bootstrap", "HTML5", "CSS3"],
      link: "https://soumach03.github.io/TinDog-Home/",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-cyan-500/10 to-transparent",
      borderClass: "hover:border-cyan-accent/25 hover:shadow-[0_0_30px_rgba(0,240,255,0.06)]",
    },
    {
      id: "gocart-india",
      title: "GoCart India",
      category: "E-COMMERCE FLOW",
      tagline: "Scalable E-Commerce Layout & Smooth Catalog Browsing",
      description: "Performance-focused e-commerce layout and product browsing interface designed for a scalable, responsive shopping experience.",
      stack: ["React", "CSS Modules", "Vite"],
      link: "https://soumach03.github.io/gocart-ind/",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-amber-500/10 to-transparent",
      borderClass: "hover:border-amber-accent/25 hover:shadow-[0_0_30px_rgba(255,140,66,0.06)]",
    },
    {
      id: "jai-hind",
      title: "Jai Hind",
      category: "CSS ART & ANIMATION",
      tagline: "Greetings Web Project for 78th Independence Day",
      description: "Patriotic web project dedicated to India's 78th Independence celebrations featuring animated flags and css-art vectors.",
      stack: ["HTML5", "CSS3", "Animations"],
      link: "https://soumach03.github.io/Jai-Hind/",
      image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-cyan-500/10 to-transparent",
      borderClass: "hover:border-cyan-accent/25 hover:shadow-[0_0_30px_rgba(0,240,255,0.06)]",
    },
    {
      id: "cloud-portfolio",
      title: "Cloud Portfolio",
      category: "SYSTEMS ARCHITECTURE",
      tagline: "Production-ready React + Express Cloud Server Architecture",
      description: "Production-ready React + Express portfolio server and client architecture configured for scalable cloud deployment.",
      stack: ["React", "Express", "Node.js", "CORS"],
      link: "https://github.com/SoumaCh03/portfolio",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      colorClass: "from-amber-500/10 to-transparent",
      borderClass: "hover:border-amber-accent/25 hover:shadow-[0_0_30px_rgba(255,140,66,0.06)]",
    },
  ];

  return (
    <section
      id="projects"
      className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 relative bg-gradient-to-b from-bg-base via-bg-surface/30 to-bg-base border-b border-white/5 overflow-hidden"
    >
      <div className="absolute w-[400px] h-[400px] bg-cyan-accent/2 filter blur-[120px] top-[10%] left-[5%] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Title block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-cyan-accent mb-3 block">
              PORTFOLIO SHOWCASE
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white mb-2 select-none">
              Featured Work
            </h2>
            <p className="text-text-secondary text-sm md:text-base font-sans font-medium max-w-xl">
              An architectural look at my core creations—built for production efficiency and beautiful interactivity.
            </p>
          </div>

          <Link
            href="/projects/others"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-cyan-accent/30 hover:bg-cyan-accent/5 hover:text-cyan-accent text-xs font-semibold uppercase tracking-wider transition-all duration-300 font-sans w-fit cursor-pointer"
          >
            All Other Projects <FolderGit2 className="w-4 h-4" />
          </Link>
        </div>

        {/* Stacked split row cards */}
        <div className="flex flex-col gap-10 w-full">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`glass-panel border-white/5 rounded-3xl overflow-hidden flex flex-col lg:flex-row group transition-all duration-300 bg-gradient-to-br ${project.colorClass} ${project.borderClass}`}
            >
              {/* Image side */}
              <div className="w-full lg:w-[40%] h-64 lg:h-auto overflow-hidden relative bg-black flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-bg-surface via-transparent to-transparent z-10 pointer-events-none" />
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover scale-102 group-hover:scale-106 transition-transform duration-700 opacity-75"
                />
              </div>

              {/* Copy side */}
              <div className="p-8 md:p-10 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-sans font-bold tracking-widest text-cyan-accent uppercase bg-cyan-accent/10 px-3 py-1 rounded-full border border-cyan-accent/15">
                      {project.category}
                    </span>
                    <span className="text-xs text-text-muted font-sans font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-accent" /> Featured Study
                    </span>
                  </div>

                  <h3 className="font-display font-black text-2xl md:text-3xl text-white mb-2 leading-none group-hover:text-cyan-accent transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-cyan-accent text-xs md:text-sm font-sans font-semibold mb-4 leading-snug">
                    {project.tagline}
                  </p>

                  <p className="text-text-secondary text-[13px] md:text-sm leading-relaxed mb-6 font-sans font-medium max-w-2xl">
                    {project.description}
                  </p>
                </div>

                {/* Footer tech tags & action link */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/5 pt-6 mt-4">
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="px-3 py-1 text-[11px] font-mono font-medium rounded-lg bg-white/2 border border-white/5 text-text-secondary select-none"
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
                    View Details <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
