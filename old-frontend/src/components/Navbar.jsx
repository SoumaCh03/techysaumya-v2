import React, { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const goToHome = () => {
    window.location.hash = "#home";
    setMenuOpen(false);
  };

  return (
    <header>
      <nav className="navbar" aria-label="Primary navigation">
        {/* Logo with original animation preserved */}
        <h1
          className="logo-animation"
          role="link"
          tabIndex="0"
          aria-label="Go to homepage"
          onClick={goToHome}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              goToHome();
            }
          }}
          style={{ cursor: "pointer" }}
        >
          TechySaumya
        </h1>

        {/* Desktop menu */}
        <div className="nav-links">
          <a href="#home" aria-label="Go to Home section">
            Home
          </a>
          <a href="#about" aria-label="Go to About section">
            About
          </a>
          <a href="#projects" aria-label="Go to Projects section">
            Projects
          </a>
          <a href="#contact" aria-label="Go to Contact section">
            Contact
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          type="button"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            boxShadow: "none",
            padding: 0,
            margin: 0,
            appearance: "none",
            WebkitAppearance: "none",
            fontSize: "2rem",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        
        {/* Mobile slide menu */}
        <div
          id="mobile-menu"
          className={`mobile-menu ${menuOpen ? "open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#projects" onClick={() => setMenuOpen(false)}>
            Projects
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}