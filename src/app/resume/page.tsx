"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Mail, MapPin, Globe, Briefcase, GraduationCap, Code2, Award } from "lucide-react";
import { FaLinkedin, FaGithub, FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import confetti from "canvas-confetti";

export default function ResumePage() {
  const triggerPrint = () => {
    // Fire confetti for UI delight
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ["#00F0FF", "#ffffff"],
    });
    
    // Open print window
    window.print();
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary px-4 md:px-8 py-20 relative z-10 w-full print:bg-white print:text-black print:py-0 print:px-0">
      {/* Backing glows */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-accent/3 filter blur-[100px] top-[10%] left-[10%] rounded-full pointer-events-none no-print" />
      
      {/* Top action header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between border-b border-white/5 pb-5 mb-8 no-print">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        <button
          onClick={triggerPrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-accent text-bg-base font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" /> Save PDF
        </button>
      </div>

      {/* Main Resume Wrapper (Statically formatted for ATS) */}
      <main className="max-w-4xl mx-auto bg-bg-surface/30 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl print:bg-transparent print:border-none print:shadow-none print:p-0 print:m-0">
        
        {/* Contact Info Header */}
        <header className="border-b border-white/5 print:border-black/10 pb-8 mb-8 text-center md:text-left flex flex-col md:flex-row print:flex-row justify-between print:justify-between items-start print:items-start gap-6 print:text-left">
          <div className="print:text-left print:flex print:flex-col print:items-start">
            <h1 className="font-display font-black text-3xl md:text-4xl text-white print:text-black tracking-tight leading-none">
              Saumyadeep Chakraborty
            </h1>
            <p className="text-cyan-accent print:text-black font-semibold text-sm md:text-base mt-2 tracking-wide uppercase">
              Full Stack Systems Architect &amp; Software Engineer
            </p>
            <p className="text-text-secondary print:text-black/60 text-xs md:text-sm mt-3 flex items-center justify-center md:justify-start print:justify-start gap-2">
              <MapPin className="w-4 h-4 text-amber-accent print:text-black" /> Cooch Behar, West Bengal, India
            </p>
          </div>

          <div className="flex flex-col gap-2.5 text-xs md:text-sm text-text-secondary print:text-black/80 font-sans font-medium w-full md:w-auto print:w-auto items-center md:items-end print:items-end print:text-right">
            <a href="mailto:saumyadeephere@zohomail.in" className="hover:text-cyan-accent print:text-black transition-colors flex items-center print:justify-end gap-2">
              <Mail className="w-4 h-4" /> saumyadeephere@zohomail.in
            </a>
            <a href="https://techysaumyadeep.vercel.app" className="hover:text-cyan-accent print:text-black transition-colors flex items-center print:justify-end gap-2">
              <Globe className="w-4 h-4" /> techysaumyadeep.vercel.app
            </a>
            <div className="flex items-center gap-3.5 mt-2 flex-wrap justify-center md:justify-end no-print">
              <a href="https://github.com/SoumaCh03" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-accent transition-colors" title="GitHub">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/saumyadeep-c-34342a177/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-accent transition-colors" title="LinkedIn">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/SaumyanaCh03/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-accent transition-colors" title="Facebook">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="https://x.com/ImSaumyaCh" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-accent transition-colors" title="Twitter/X">
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/soumach03" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-accent transition-colors" title="Instagram">
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
            {/* Print-only simplified text fallback for ATS scanners */}
            <span className="hidden print:block text-[10px] mt-1 text-black/60 print:text-right">
              github.com/SoumaCh03 | linkedin.com/in/saumyadeep-c | facebook.com/SaumyanaCh03
            </span>
          </div>
        </header>

        {/* Resume Content Layout */}
        <div className="flex flex-col gap-8">
          
          {/* Summary */}
          <section>
            <h2 className="font-display font-bold text-lg md:text-xl text-white print:text-black tracking-wide border-b border-white/5 print:border-black/10 pb-2 mb-3 uppercase flex items-center gap-2">
              Professional Summary
            </h2>
            <p className="text-text-secondary print:text-black/70 text-xs md:text-sm leading-relaxed font-sans font-medium">
              Performance-driven Software Architect with 3+ years of experience designing scalable API networks, custom full-stack solutions, and automated workflows. Expert in Next.js, Node.js microservices, data architecture, and AI integrations. Passionate motor tourer and visual storyteller with a deep obsession for engineering craft and pixel-perfect design.
            </p>
          </section>

          {/* Technical Skills */}
          <section>
            <h2 className="font-display font-bold text-lg md:text-xl text-white print:text-black tracking-wide border-b border-white/5 print:border-black/10 pb-2 mb-4 uppercase flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-accent print:text-black" /> Core Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 print:grid-cols-3 gap-4 font-sans font-medium text-xs md:text-sm">
              <div>
                <span className="font-semibold text-white print:text-black">Languages:</span>
                <p className="text-text-secondary print:text-black/70 mt-1">Python, TypeScript, JavaScript, C++</p>
              </div>
              <div>
                <span className="font-semibold text-white print:text-black">Frameworks:</span>
                <p className="text-text-secondary print:text-black/70 mt-1">React, Next.js (App Router), Express.js, FastAPI</p>
              </div>
              <div>
                <span className="font-semibold text-white print:text-black">Data &amp; Cloud:</span>
                <p className="text-text-secondary print:text-black/70 mt-1">MongoDB, MySQL, Vercel, Docker, Cloudinary</p>
              </div>
            </div>
          </section>

          {/* Work Experience */}
          <section className="flex flex-col gap-6">
            <h2 className="font-display font-bold text-lg md:text-xl text-white print:text-black tracking-wide border-b border-white/5 print:border-black/10 pb-2 mb-2 uppercase flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-accent print:text-black" /> Professional Experience
            </h2>

            {/* Experience Item 1: React Developer (Persistent) */}
            <div className="print-card">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-base text-white print:text-black">
                    React Developer
                  </h3>
                  <span className="text-xs font-semibold text-cyan-accent print:text-black">Persistent Systems</span>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">Mar 2024 - Present | Remote</span>
              </div>
              <ul className="list-disc list-inside text-text-secondary print:text-black/70 text-xs md:text-sm mt-3 leading-relaxed flex flex-col gap-2 font-sans font-medium pl-1">
                <li>Developing high-performance user interfaces and responsive web layouts using React, state management, and modern CSS.</li>
                <li>Integrating complex RESTful API services and managing real-time data binding loops.</li>
                <li>Refactoring frontend modules to optimize lighthouse metrics and ensure fluid viewport scaling.</li>
              </ul>
            </div>

            {/* Experience Item 2: Full Stack Trainee (Persistent) */}
            <div className="print-card">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-base text-white print:text-black">
                    Full Stack Developer - Trainee
                  </h3>
                  <span className="text-xs font-semibold text-cyan-accent print:text-black">Persistent Systems</span>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">Sep 2023 - Feb 2024 | Remote</span>
              </div>
              <ul className="list-disc list-inside text-text-secondary print:text-black/70 text-xs md:text-sm mt-3 leading-relaxed flex flex-col gap-2 font-sans font-medium pl-1">
                <li>Acquired technical training and supported feature releases utilizing JavaScript, React, Node.js, and databases.</li>
                <li>Participated in agile sprints, resolved technical debugging requests, and integrated service layers.</li>
              </ul>
            </div>

            {/* Experience Item 3: Independent Engineer */}
            <div className="print-card">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-base text-white print:text-black">
                    Independent Software Engineer &amp; Creator
                  </h3>
                  <span className="text-xs font-semibold text-cyan-accent print:text-black">Freelance / Open Source</span>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">2022 - Present | Cooch Behar</span>
              </div>
              <ul className="list-disc list-inside text-text-secondary print:text-black/70 text-xs md:text-sm mt-3 leading-relaxed flex flex-col gap-2 font-sans font-medium pl-1">
                <li>Designed automated Telegram assistant bots featuring real-time weather telemetry and intent parsing models.</li>
                <li>Built a high-performance image synchronization portal (SnappySaumya) using Cloudinary and lazy-loaded lightboxes.</li>
                <li>Programmed custom keyboard diagnostic utilities (Keyboard Tester) and scalable e-commerce flow concepts (GoCart India).</li>
              </ul>
            </div>
          </section>

          {/* Education */}
          <section className="flex flex-col gap-6">
            <h2 className="font-display font-bold text-lg md:text-xl text-white print:text-black tracking-wide border-b border-white/5 print:border-black/10 pb-2 mb-2 uppercase flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-accent print:text-black" /> Education
            </h2>
            <div className="flex flex-col gap-5 pl-2 border-l border-white/5 print:border-l-0 print:pl-0">
              
              {/* Item 1 */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    AI Tools &amp; Technology Certification
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    IBM Training and Google learning Platforms
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2023 - 2024
                </span>
              </div>

              {/* Item 2 */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    Web Development, Machine Learning &amp; Generative AI
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    Udemy (HTML, CSS, JavaScript, jQuery, MongoDB, etc.)
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2022 - 2023
                </span>
              </div>

              {/* Item 3 */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    Bachelor of Education (B. Ed.)
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    Antony B.ed College, under W.B.U.T.T.E.P.A.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2020 - 2022
                </span>
              </div>

              {/* PG Diploma */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    PG Diploma in Graphics Design, Website Development &amp; .NET Technologies
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    MAKAUT (formerly WBUT)
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2018 - 2020
                </span>
              </div>

              {/* Item 4 */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    Diploma in Information Technology Application
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    “North Bengal Aamar Computer”
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2015 - 2016
                </span>
              </div>

              {/* Item 5 */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    Bachelor of Science with Hons. in Botany
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    Acharya B. N. Seal College under Cooch Behar Panchanan Barma University
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2015 - 2018
                </span>
              </div>

              {/* Item 6 */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    Jenkins School
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    Higher Secondary Education
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2013 - 2015
                </span>
              </div>

              {/* Item 7 */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    Jenkins School, Cooch Behar
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    Secondary Education
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2006 - 2013
                </span>
              </div>

              {/* Item 8 */}
              <div className="print-card flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                    Shri Aurobindo Patha Bhavan
                  </h3>
                  <p className="text-xs font-semibold text-text-secondary print:text-black/70 mt-0.5">
                    Primary Education
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-text-muted print:text-black/60">
                  2001 - 2006
                </span>
              </div>

            </div>
          </section>

          {/* Core Projects */}
          <section className="flex flex-col gap-5">
            <h2 className="font-display font-bold text-lg md:text-xl text-white print:text-black tracking-wide border-b border-white/5 print:border-black/10 pb-2 mb-2 uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-accent print:text-black" /> Key Projects
            </h2>

            <div className="flex flex-col gap-5">
              
              {/* Project 1 */}
              <div className="print-card">
                <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                  AI Telegram Bot
                </h3>
                <p className="text-text-secondary print:text-black/70 text-xs md:text-sm leading-relaxed mt-1 font-sans font-medium">
                  Smart multi-intent AI assistant featuring automated routing, weather telemetry integration, distress assistance, and custom API query responders.
                </p>
              </div>

              {/* Project 2 */}
              <div className="print-card">
                <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                  Keyboard Tester
                </h3>
                <p className="text-text-secondary print:text-black/70 text-xs md:text-sm leading-relaxed mt-1 font-sans font-medium">
                  A full-size interactive keyboard testing web application for real-time key press diagnostics and latency checks.
                </p>
              </div>

              {/* Project 3 */}
              <div className="print-card">
                <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                  GoCart India
                </h3>
                <p className="text-text-secondary print:text-black/70 text-xs md:text-sm leading-relaxed mt-1 font-sans font-medium">
                  Performance-focused e-commerce layout and product browsing interface designed for a scalable, responsive shopping experience.
                </p>
              </div>

              {/* Project 4 */}
              <div className="print-card">
                <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                  TinDog Home
                </h3>
                <p className="text-text-secondary print:text-black/70 text-xs md:text-sm leading-relaxed mt-1 font-sans font-medium">
                  Modern and elegant landing page website designed for a social puppy mating and dog happiness platform.
                </p>
              </div>

              {/* Project 5 */}
              <div className="print-card">
                <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                  Jai Hind
                </h3>
                <p className="text-text-secondary print:text-black/70 text-xs md:text-sm leading-relaxed mt-1 font-sans font-medium">
                  Patriotic web project dedicated to India&apos;s 78th Independence celebrations featuring animated flags and css-art vectors.
                </p>
              </div>

              {/* Project 6 */}
              <div className="print-card">
                <h3 className="font-display font-bold text-sm md:text-base text-white print:text-black">
                  Cloud Portfolio
                </h3>
                <p className="text-text-secondary print:text-black/70 text-xs md:text-sm leading-relaxed mt-1 font-sans font-medium">
                  Production-ready React + Express portfolio server and client architecture configured for scalable cloud deployment.
                </p>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
