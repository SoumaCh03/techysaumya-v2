import React from "react";

export default function Projects() {
  const projects = [
    {
      title: "AI Telegram Bot",
      desc: "Smart multi-intent AI assistant with routing, weather tools, distress assistance, and API integrations.",
      link: "https://t.me/WaxWing_Rider_helper_bot",
    },
    {
      title: "Keyboard Tester",
      desc: "A full-size interactive keyboard testing web app for real-time key press diagnostics.",
      link: "https://soumach03.github.io/Keyboard-Tester/",
    },
    {
      title: "TinDog Home",
      desc: "Modern and elegant landing page website for a dog happiness home platform.",
      link: "https://soumach03.github.io/TinDog-Home/",
    },
    {
      title: "GoCart India",
      desc: "E-commerce and product browsing website designed for scalable shopping experience.",
      link: "https://soumach03.github.io/gocart-ind/",
    },
    {
      title: "Jai Hind",
      desc: "Patriotic web project dedicated to India’s 78th Independence celebration.",
      link: "https://soumach03.github.io/Jai-Hind/",
    },
    {
      title: "Cloud Portfolio",
      desc: "Production-ready React + Node portfolio architecture built for cloud deployment.",
      link: "#",
    },
  ];

  return (
    <section
      id="projects"
      style={{
        background:
          "linear-gradient(180deg, rgba(7,16,31,0.82), rgba(3,7,18,0.9))",
        backdropFilter: "blur(2px)",
        borderTop: "1px solid rgba(0,255,255,0.05)",
        borderBottom: "1px solid rgba(0,255,255,0.04)",
        color: "#E8F4FF",
        padding: "90px 60px 70px",
        fontFamily: "Arial",
      }}
    >
      <h2
        style={{
          fontSize: "3rem",
          textAlign: "center",
          marginBottom: "60px",
          textShadow: "0 0 20px rgba(0,255,255,0.12)",
        }}
      >
        Projects
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            window.innerWidth <= 768
              ? "1fr"
              : "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "30px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {projects.map((project, index) => (
          <div
            key={index}
            style={{
              padding: "30px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 25px rgba(0,255,255,0.05)",
              transition: "all 0.35s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow =
                "0 0 35px rgba(0,255,255,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 25px rgba(0,255,255,0.05)";
            }}
          >
            <h3
              style={{
                fontSize: "1.8rem",
                marginBottom: "18px",
              }}
            >
              {project.title}
            </h3>

            <p
              style={{
                opacity: 0.78,
                marginBottom: "24px",
                fontSize: "1.1rem",
                lineHeight: "1.7",
              }}
            >
              {project.desc}
            </p>

            <button
              onClick={() => window.open(project.link, "_blank")}
              style={{
                padding: "14px 28px",
                background: "#00FFFF",
                color: "#030712",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.35s ease",
                boxShadow: "0 0 15px rgba(0,255,255,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00d9d9";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(0,255,255,0.55)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#00FFFF";
                e.currentTarget.style.boxShadow =
                  "0 0 15px rgba(0,255,255,0.25)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}