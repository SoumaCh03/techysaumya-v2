import { useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false
      },

      background: {
        color: "transparent"
      },

      particles: {
        number: {
          value: 45
        },

        color: {
          value: ["#00f5ff", "#ff2e2e"]
        },

        opacity: {
          value: 0.3
        },

        size: {
          value: {
            min: 1,
            max: 4
          }
        },

        move: {
          enable: true,
          speed: 0.8,
          direction: "none",
          random: true,
          outModes: {
            default: "bounce"
          }
        },

        links: {
          enable: false
        }
      },

      detectRetina: true
    }),
    []
  );

  return (
    <div className="particles-wrapper">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
      />
    </div>
  );
};

export default ParticlesBackground;