import React from "react";
import { Link } from "react-router-dom";
import { Home, FolderKanban } from "lucide-react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const NotFound = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <section className="notfound-section">
      {/* tsParticles Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: {
              enable: false,
            },

            background: {
              color: "transparent",
            },

            fpsLimit: 60,

            particles: {
              number: {
                value: 35,
              },

              color: {
                value: ["#00f5ff", "#ff2e2e", "#ffffff"],
              },

              opacity: {
                value: 0.15,
              },

              size: {
                value: {
                  min: 1,
                  max: 3,
                },
              },

              move: {
                enable: true,
                speed: 0.5,
                random: true,
                direction: "none",

                outModes: {
                  default: "bounce",
                },
              },

              links: {
                enable: false,
              },

              shape: {
                type: "circle",
              },
            },

            detectRetina: true,
          }}
        />
      </div>

      {/* Twinkling Stars */}
      <div className="space-stars"></div>

      {/* Shooting Stars */}
      <div className="shooting-stars">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Flying Rocket */}
      <div className="rocket-wrapper">
        <div className="rocket">🚀</div>
      </div>

      {/* Main Content */}
      <div className="notfound-container">
        <h1 className="error-code">404</h1>

        <div className="glass-card">
          <h2>Page Not Found</h2>

          <p>
            The page you're looking for doesn't exist or has been moved.
            Let’s get you back on track.
          </p>

          <div className="button-group">
            <Link to="/" className="home-btn">
              <Home size={20} />
              Back to Home
            </Link>

            <a href="/#projects" className="project-btn">
              <FolderKanban size={20} />
              View Projects
            </a>
          </div>
        </div>

        <div className="foot">
          <p>
            TechySaumya &copy; {new Date().getFullYear()}
            <span
              style={{
                marginLeft: "0.5rem",
                color: "#ff2e2e",
                fontWeight: "600",
              }}
            >
              / 404 Not Found.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default NotFound;