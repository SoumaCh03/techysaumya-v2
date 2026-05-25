import React, { useEffect, useState } from "react";

export default function Hero() {
  const originalText = "TECHYSAUMYA";
  const finalText = "SAUMYADEEP CHAKRABORTY";

  const [displayText, setDisplayText] = useState(originalText);
  const [phase, setPhase] = useState("wait");
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const isMobile = viewportWidth <= 768;
  const isTablet = viewportWidth <= 1024;

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let timeout;

    if (phase === "wait") {
      timeout = setTimeout(() => {
        setPhase("delete");
      }, 2200);
    } else if (phase === "delete") {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, 90);
      } else {
        setPhase("type");
      }
    } else if (phase === "type") {
      if (displayText.length < finalText.length) {
        timeout = setTimeout(() => {
          setDisplayText(finalText.slice(0, displayText.length + 1));
        }, 110);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, phase]);

  return (
    <section
      id="home"
      style={{
        minHeight: isMobile ? "74vh" : "90vh",
        background: `
          radial-gradient(circle at top left, rgba(0,255,255,0.18), transparent 28%),
          radial-gradient(circle at bottom right, rgba(0,140,255,0.16), transparent 30%),
          linear-gradient(180deg, rgba(5,12,24,0.82), rgba(2,8,18,0.92))
        `,
        backdropFilter: "blur(3px)",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
        color: "#E8F4FF",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: isMobile ? "flex-start" : "space-between",
        alignItems: "center",
        gap: isMobile ? "12px" : "40px",
        padding: isMobile
          ? "calc(env(safe-area-inset-top, 0px) + 82px) 20px 30px"
          : isTablet
          ? "90px 40px 60px"
          : "55px 65px 55px",
        textAlign: isMobile ? "center" : "left",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: isMobile ? "96px" : "0px",
      }}
    >
      {/* HERO GLOW */}
      <div
        style={{
          position: "absolute",
          width: isMobile ? "450px" : "700px",
          height: isMobile ? "450px" : "700px",
          background: "rgba(0,255,255,0.08)",
          filter: "blur(140px)",
          top: "-220px",
          left: "-180px",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: isMobile ? "350px" : "500px",
          height: isMobile ? "350px" : "500px",
          background: "rgba(0,120,255,0.10)",
          filter: "blur(130px)",
          bottom: "-180px",
          right: "-120px",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* GRID OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: isMobile ? "45px 45px" : "70px 70px",
          maskImage:
            "radial-gradient(circle at center, black 45%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 45%, transparent 100%)",
          pointerEvents: "none",
          opacity: 0.45,
        }}
      />

      {/* SEO */}
      <h2
        style={{
          position: "absolute",
          left: "-9999px",
          opacity: 0,
        }}
      >
        Saumyadeep Chakraborty also known as TechySaumya — Full Stack Developer,
        Backend Engineer, Photographer and AI Enthusiast from West Bengal,
        India.
      </h2>

      {/* LEFT CONTENT */}
      <div
        style={{
          flex: 1,
          maxWidth: isMobile ? "100%" : "720px",
          width: "100%",
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
        }}
      >
        {/* TOP BADGE */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: isMobile ? "9px 16px" : "10px 18px",
            border: "1px solid rgba(0,255,255,0.18)",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(10px)",
            marginBottom: isMobile ? "10px" : "20px",
            width: "fit-content",
            boxShadow: "0 0 25px rgba(0,255,255,0.08)",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#00FFFF",
              boxShadow: "0 0 15px cyan",
            }}
          />

          <span
            style={{
              fontSize: isMobile ? "0.78rem" : "0.95rem",
              letterSpacing: isMobile ? "2px" : "3px",
              opacity: 0.85,
            }}
          >
            FULL STACK DEVELOPER
          </span>
        </div>

        {/* TITLE WRAPPER */}
        <div
          style={{
            minHeight: isMobile ? "82px" : "200px",
            display: "flex",
            alignItems: "center",
            marginBottom: "18px",
            width: "100%",
          }}
        >
          <h1
            className="hero-title"
            style={{
              fontSize: isMobile
                ? displayText === originalText
                  ? "2.2rem"
                  : "1.9rem"
                : isTablet
                ? displayText === originalText
                  ? "3.8rem"
                  : "3.2rem"
                : displayText === originalText
                ? "4.5rem"
                : "4.1rem",

              lineHeight: displayText === originalText ? "0.92" : "0.96",
              margin: 0,
              color: "#ffffff",
              fontWeight: "900",
              letterSpacing: displayText === originalText ? "-3px" : "-2px",

              textShadow: `
                0 0 10px rgba(255,255,255,0.08),
                0 0 25px rgba(0,255,255,0.12),
                0 0 60px rgba(0,255,255,0.08)
              `,

              transition: "all 0.35s ease",
              width: "100%",
              whiteSpace: "pre-line",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              maxWidth: "100%",
            }}
          >
            {displayText}
            <span className="blinking-cursor">|</span>
          </h1>
        </div>

        {/* SUBTEXT */}
        <p
          style={{
            fontSize: isMobile ? "0.95rem" : "1.05rem",
            opacity: 0.88,
            marginTop: "0",
            marginBottom: "22px",
            maxWidth: "760px",
            lineHeight: isMobile ? "1.7" : "1.8",
            color: "rgba(232,244,255,0.88)",
            fontWeight: "400",
            letterSpacing: "0.3px",
          }}
        >
          Backend Engineering • Scalable Systems • AI Solutions
        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: "flex",
            gap: isMobile ? "10px" : "20px",
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
        >
          <a href="#projects" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: isMobile ? "14px 24px" : "16px 34px",
                background: "linear-gradient(135deg, #00FFFF, #00B7FF)",
                color: "#030712",
                border: "none",
                borderRadius: "14px",
                fontWeight: "bold",
                fontSize: isMobile ? "0.92rem" : "1rem",
                cursor: "pointer",
                boxShadow: "0 0 35px rgba(0,255,255,0.35)",
                transition: "all 0.35s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 0 45px rgba(0,255,255,0.85)";
                e.target.style.transform = "translateY(-4px) scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "0 0 35px rgba(0,255,255,0.35)";
                e.target.style.transform = "translateY(0) scale(1)";
              }}
            >
              View Projects
            </button>
          </a>

          <a href="#contact" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: isMobile ? "14px 24px" : "16px 34px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                color: "#E8F4FF",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "14px",
                fontSize: isMobile ? "0.92rem" : "1rem",
                cursor: "pointer",
                transition: "all 0.35s ease",
                boxShadow: "0 0 20px rgba(255,255,255,0.04)",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 0 30px rgba(0,255,255,0.18)";
                e.target.style.borderColor = "#00FFFF";
                e.target.style.color = "#00FFFF";
                e.target.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "0 0 20px rgba(255,255,255,0.04)";
                e.target.style.borderColor = "rgba(255,255,255,0.18)";
                e.target.style.color = "#E8F4FF";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Contact Me
            </button>
          </a>
        </div>
      </div>

      {/* RIGHT IMAGE SIDE */}
      <div
        className="hero-image-wrapper"
        style={{
          position: "relative",
          zIndex: 5,
          flexShrink: 0,
          transform: isMobile ? "scale(0.62)" : "scale(0.92)",
        }}
      >
        {/* OUTER GLOW */}
        <div
          style={{
            position: "absolute",
            width: isMobile ? "300px" : "420px",
            height: isMobile ? "300px" : "420px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,255,255,0.12), transparent 70%)",
            filter: "blur(35px)",
            zIndex: 0,
          }}
        />

        <div className="orbit-ring"></div>
        <div className="glow-ring"></div>

        <div
          style={{
            position: "absolute",
            width: isMobile ? "280px" : "360px",
            height: isMobile ? "280px" : "360px",
            borderRadius: "50%",
            border: "1px solid rgba(0,255,255,0.12)",
            animation: "spinSlow 18s linear infinite reverse",
          }}
        />

        <div className="orbit-dot-container">
          <div className="orbit-dot"></div>
        </div>

        <img
          src="/saumyadeep-chakraborty-techysaumya-portrait.jpg"
          alt="Saumyadeep Chakraborty also known as TechySaumya full stack developer and photographer portrait"
          className="profile-image"
        />

        {/* FLOATING LABELS */}
        {!isMobile && (
          <>
            <div
              style={{
                position: "absolute",
                top: "12%",
                right: "-10%",
                padding: "10px 16px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,255,255,0.18)",
                backdropFilter: "blur(10px)",
                color: "#00FFFF",
                fontSize: "0.95rem",
                boxShadow: "0 0 20px rgba(0,255,255,0.08)",
              }}
            >
              AI/ML
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "14%",
                left: "-20%",
                padding: "10px 16px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,255,255,0.18)",
                backdropFilter: "blur(10px)",
                color: "#00FFFF",
                fontSize: "0.95rem",
                boxShadow: "0 0 20px rgba(0,255,255,0.08)",
              }}
            >
              BACKEND
            </div>
          </>
        )}
      </div>
    </section>
  );
}
