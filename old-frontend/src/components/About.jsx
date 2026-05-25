export default function About() {
  const aboutCards = [
    {
      title: "Who I Am",
      points: [
        "Backend-focused software developer",
        "Scalable system architecture enthusiast",
        "AI & data-driven solution builder",
      ],
    },
    {
      title: "Core Strengths",
      points: [
        "Clean code architecture",
        "Performance optimization",
        "API & backend engineering",
      ],
    },
    {
      title: "Currently Exploring",
      points: [
        "Machine Learning",
        "Prompt Engineering",
        "AI Workflows & Agents",
      ],
    },
  ];

  return (
    <section
      id="about"
      style={{
        height: "auto",
        background: "rgba(7, 16, 31, 0.72)",
        color: "#E8F4FF",
        padding: "90px 60px 70px",
        fontFamily: "Arial",
      }}
    >
      <h2
        style={{
          fontSize: "3rem",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        About Me
      </h2>

      <p
        style={{
          maxWidth: "900px",
          margin: "0 auto 60px auto",
          fontSize: "1.15rem",
          lineHeight: "1.8",
          textAlign: "center",
          opacity: 0.85,
        }}
      >
        Hi, I’m Saumyadeep Chakraborty, also known as TechySaumya — a
        full stack developer, backend engineering enthusiast,
        photographer, and creative technologist from West Bengal,
        India. I specialize in scalable backend systems, AI-powered
        workflows, modern web applications, API engineering, and
        performance-focused digital experiences built for reliability,
        efficiency, and seamless user interaction.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            window.innerWidth <= 768
              ? "1fr"
              : window.innerWidth <= 1024
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {aboutCards.map((card, index) => (
          <div
            key={index}
            style={{
              padding: "30px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              boxShadow: "0 0 20px rgba(0,255,255,0.04)",
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(0,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(0,255,255,0.04)";
            }}
          >
            <h3
              style={{
                color: "#00FFFF",
                marginBottom: "20px",
              }}
            >
              {card.title}
            </h3>

            <ul style={{ lineHeight: "2" }}>
              {card.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}