"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { useProviders } from "@/app/providers";

interface NavLink {
  label: string;
  target: string;
  isExternal?: boolean;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const { lenis } = useProviders();

  const isHome = pathname === "/";

  // 1. Desktop & Mobile Navigation Links
  const navLinks: NavLink[] = [
    { label: "Home", target: "home" },
    { label: "About", target: "about" },
    { label: "Skills", target: "skills" },
    { label: "Projects", target: "projects" },
    { label: "Photography", target: "photography", isExternal: true },
    { label: "Blog", target: "blog", isExternal: true },
    { label: "Journey", target: "journey", isExternal: true },
    { label: "Contact", target: "contact" },
  ];

  // 2. Scroll detection for glassmorphic transitions
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Track active section for home page highlighting
      if (isHome) {
        const sections = ["home", "about", "skills", "projects", "contact"];
        const scrollPosition = window.scrollY + window.innerHeight * 0.35;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const top = element.offsetTop;
            const height = element.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Trigger initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // 3. Smart scrolling handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (link.isExternal) return; // Allow normal routing for full pages
    
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById(link.target);
      if (element) {
        setMenuOpen(false);
        if (lenis) {
          lenis.scrollTo(element, {
            offset: -80,
            duration: 1.2,
          });
        } else {
          // Native smooth scroll fallback for mobile screens
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
    } else {
      // Allow browser to link directly to home page hashes (e.g. /#projects)
      setMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 px-4 md:px-8 py-4">
      <nav
        className={`w-full max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-full transition-all duration-300 ${
          scrolled || !isHome
            ? "glass-panel bg-bg-surface/85 border-white/5 shadow-black/80"
            : "border-transparent bg-transparent"
        }`}
        aria-label="Primary navigation"
      >
        {/* LOGO */}
        <Link href="/" className="group" onClick={(e) => {
          if (isHome) {
            e.preventDefault();
            if (lenis) {
              lenis.scrollTo(0, { duration: 1.2 });
            } else {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }
        }}>
          <h1 className="font-display font-extrabold text-lg md:text-xl tracking-tight text-white transition-all group-hover:text-cyan-accent group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            TechySaumya<span className="text-cyan-accent group-hover:text-white transition-colors font-sans">_v2.0</span>
          </h1>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-3.5 lg:gap-4 xl:gap-5">
          {navLinks.map((link, idx) => {
            const isTargetActive = isHome
              ? activeSection === link.target
              : (link.isExternal || link.target === "projects") &&
                (pathname === `/${link.target}` || pathname.startsWith(`/${link.target}/`));
            const href = link.isExternal ? `/${link.target}` : `/#${link.target}`;

            return (
              <Link
                key={idx}
                href={href}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative text-[11px] lg:text-[12px] xl:text-[13px] font-semibold tracking-wider uppercase transition-all duration-300 hover:text-white ${
                  isTargetActive 
                    ? "text-cyan-accent [text-shadow:0_0_8px_rgba(0,240,255,0.6)]" 
                    : "text-text-secondary"
                }`}
              >
                {link.label}
                {isTargetActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-cyan-accent rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* ADMIN QUICK-ACCESS ACTION BUTTON */}
        <div className="hidden lg:flex items-center">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-accent/25 bg-cyan-accent/5 font-sans text-[11px] lg:text-xs font-semibold tracking-wide uppercase text-cyan-accent hover:text-white hover:border-cyan-accent/50 hover:bg-cyan-accent/15 transition-all duration-300 shadow-[0_0_12px_rgba(0,240,255,0.15)] group/btn"
            title="Access Admin Dashboard"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-accent"></span>
            </span>
            <span>Admin Login</span>
          </Link>
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="lg:hidden flex items-center justify-center p-2 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          type="button"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* MOBILE SHEET OVERLAY */}
      <div
        className={`fixed inset-y-0 right-0 w-[240px] z-[60] bg-bg-surface/98 backdrop-blur-2xl border-l border-white/5 flex flex-col p-8 transition-transform duration-300 lg:hidden shadow-2xl ${
          menuOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none invisible"
        }`}
        id="mobile-menu"
      >
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1 rounded-full text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {navLinks.map((link, idx) => {
            const isTargetActive = isHome
              ? activeSection === link.target
              : (link.isExternal || link.target === "projects") &&
                (pathname === `/${link.target}` || pathname.startsWith(`/${link.target}/`));
            const href = link.isExternal ? `/${link.target}` : `/#${link.target}`;

            return (
              <Link
                key={idx}
                href={href}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-[15px] font-semibold uppercase tracking-wide transition-all ${
                  isTargetActive 
                    ? "text-cyan-accent [text-shadow:0_0_8px_rgba(0,240,255,0.6)]" 
                    : "text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="h-[1px] bg-white/5 my-4" />

          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-cyan-accent/20 bg-cyan-accent/5 text-xs font-semibold tracking-wide uppercase text-cyan-accent hover:text-white hover:border-cyan-accent transition-all"
          >
            Admin Panel
          </Link>

          <Link
            href="/resume"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/3 text-xs font-semibold tracking-wide uppercase text-white hover:text-cyan-accent hover:border-cyan-accent transition-all"
          >
            Interactive Resume <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
