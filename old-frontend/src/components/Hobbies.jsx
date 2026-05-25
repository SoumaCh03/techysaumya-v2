import React, { useRef } from "react";
import {
  Camera,
  Plane,
  Bike,
  BookOpen,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const hobbies = [
  {
    title: "ShutterBug",
    icon: <Camera size={34} />,
    link: "https://snappysaumya.vercel.app",
  },
  {
    title: "Wanderlust",
    icon: <Plane size={34} />,
  },
  {
    title: "Motorcycle Enthusiast",
    icon: <Bike size={34} />,
  },
  {
    title: "Bookworm",
    icon: <BookOpen size={34} />,
  },
  {
    title: "TechSavvy",
    icon: <Cpu size={34} />,
  },
];

export default function Hobbies() {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <section
      id="hobbies"
      style={{
        padding: isMobile ? "80px 20px" : "100px 80px",
        background:
          "linear-gradient(180deg, rgba(7,16,31,0.82), rgba(3,7,18,0.88))",
        backdropFilter: "blur(2px)",
        borderTop: "1px solid rgba(0,255,255,0.05)",
        borderBottom: "1px solid rgba(0,255,255,0.04)",
        color: "white",
        position: "relative",
      }}
    >
      <h2
        style={{
          fontSize: isMobile ? "2.4rem" : "3rem",
          marginBottom: "50px",
          textAlign: "center",
          textShadow: "0 0 20px rgba(0,255,255,0.12)",
          letterSpacing: "1px",
        }}
      >
        HOBBIES
      </h2>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div className="hobbies-wrapper">
          <button className="scroll-btn left-btn" onClick={scrollLeft}>
            <ChevronLeft size={28} />
          </button>

          <div className="hobbies-scroll-container" ref={scrollRef}>
            {hobbies.map((hobby, index) => (
              <div
                className="hobby-tile"
                key={index}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 0 25px rgba(0,255,255,0.05)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="hobby-title">
                  {hobby.link ? (
                    <a
                      href={hobby.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                      }}
                    >
                      {hobby.title}
                    </a>
                  ) : (
                    hobby.title
                  )}
                </div>

                <div className="hobby-icon">{hobby.icon}</div>
              </div>
            ))}
          </div>

          <button className="scroll-btn right-btn" onClick={scrollRight}>
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
}