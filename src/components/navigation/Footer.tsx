"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      url: "https://github.com/SoumaCh03",
      label: "GitHub",
      color: "hover:border-cyan-accent hover:text-cyan-accent hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]",
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/saumyadeep-c-34342a177/",
      label: "LinkedIn",
      color: "hover:border-cyan-accent hover:text-cyan-accent hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]",
    },
    {
      icon: <FaXTwitter className="w-5 h-5" />,
      url: "https://x.com/ImSaumyaCh",
      label: "Twitter/X",
      color: "hover:border-cyan-accent hover:text-cyan-accent hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]",
    },
    {
      icon: <FaInstagram className="w-5 h-5" />,
      url: "https://instagram.com/",
      label: "Instagram",
      color: "hover:border-amber-accent hover:text-amber-accent hover:shadow-[0_0_15px_rgba(255,140,66,0.35)]",
    },
    {
      icon: <FaFacebook className="w-5 h-5" />,
      url: "https://www.facebook.com/SaumyanaCh03/",
      label: "Facebook",
      color: "hover:border-cyan-accent hover:text-cyan-accent hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]",
    },
  ];

  return (
    <footer className="w-full bg-bg-surface border-t border-white/5 py-12 md:py-16 px-4 md:px-8 mt-auto relative z-10 overflow-hidden">
      {/* Background Subtle Gradient Glows */}
      <div className="absolute w-[300px] h-[300px] bg-cyan-accent/3 filter blur-[120px] -bottom-[150px] -left-[100px] rounded-full pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-amber-accent/3 filter blur-[120px] -bottom-[150px] -right-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: ABOUT / SOCIAL */}
        <div className="flex flex-col justify-center min-h-[220px]">
          <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white mb-4">
            Connect With Me
          </h3>
          
          <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 max-w-lg font-sans font-medium">
            Building interfaces that amaze at first glance and engineering bulletproof scalable architectures that function under heavy loads. Let&apos;s build something meaningful.
          </p>

          {/* Social Icons Grid */}
          <div className="flex flex-wrap gap-4 mb-6">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={`w-12 h-12 rounded-full border border-white/10 bg-white/2 flex items-center justify-center text-text-secondary transition-all duration-300 ${item.color} hover:scale-105`}
              >
                {item.icon}
              </a>
            ))}
          </div>

          {/* Interactive Photography Call to Action */}
          <div className="flex flex-col gap-2.5">
            <Link
              href="/photography"
              className="text-xs font-semibold tracking-wider uppercase text-cyan-accent hover:text-white transition-all duration-300 inline-flex items-center gap-1.5 w-fit hover:translate-y-[-1px] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
            >
              📸 Explore Photography Portfolio (SnappySaumya)
            </Link>
            <a
              href="mailto:saumyadeephere@zohomail.in"
              className="text-xs font-semibold tracking-wider uppercase text-text-secondary hover:text-white transition-all duration-300 inline-flex items-center gap-2 w-fit"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-accent" /> saumyadeephere@zohomail.in
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: LOCATION MAP */}
        <div className="w-full flex flex-col">
          <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white mb-6 lg:mb-4 lg:text-left text-center flex items-center justify-center lg:justify-start gap-2.5">
            <MapPin className="w-5 h-5 text-amber-accent shadow-sm" /> Cooch Behar, India
          </h3>

          <div className="w-full h-[220px] md:h-[260px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative group">
            <div className="absolute inset-0 bg-cyan-accent/2 pointer-events-none z-10 transition-opacity duration-300 group-hover:opacity-0" />
            <iframe
              title="Cooch Behar, West Bengal Map"
              src="https://www.google.com/maps?q=Cooch+Behar+West+Bengal&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(1) invert(0.92) contrast(1.15)" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="relative z-0"
            />
          </div>
        </div>
      </div>

      {/* FOOTER DETAILS & SIGNATURE */}
      <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs md:text-sm text-text-secondary font-medium font-sans text-center md:text-left">
          Saumyadeep Chakraborty (TechySaumya) — Full Stack Developer, Backend Engineering Enthusiast, Photographer, Creative Technologist & Motorcycle Rider based in West Bengal, India.
        </p>
        <p className="text-xs text-text-muted font-sans font-medium text-center md:text-right">
          © {currentYear} TechySaumya. All Rights Reserved. Crafted with ❤️ and Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
