import React from "react";
import {
  FaPython,
  FaJava,
  FaReact,
  FaNodeJs,
  FaGithub,
  FaGitAlt,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaDatabase,
  FaRobot,
} from "react-icons/fa";

import {
  SiExpress,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiMysql,
  SiNetlify,
  SiVercel,
  SiPostman,
  SiOpenai,
  SiGoogle,
  SiHuggingface,
  SiTypescript,
  SiCplusplus,
  SiAnthropic,
  SiGithubcopilot,
  SiRailway,
  SiFirebase,
  SiDocker,
  SiLinux,
  SiFigma,
  SiBruno,
  SiHttpie,
} from "react-icons/si";

import { 
  VscVscode 
} from "react-icons/vsc";

import { 
  TbBolt 
} from "react-icons/tb";

const skillGroups = [
  {
    title: "Programming Languages",
    items: [
      { name: "Python", icon: <FaPython /> },
      { name: "JavaScript", icon: <FaJs /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "C++", icon: <SiCplusplus /> },
    ],
  },
  {
    title: "Frontend Development",
    items: [
      { name: "HTML5", icon: <FaHtml5 /> },
      { name: "CSS3", icon: <FaCss3Alt /> },
      { name: "React", icon: <FaReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "Tailwind", icon: <SiTailwindcss /> },
    ],
  },
  {
    title: "Backend & Frameworks",
    items: [
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Express.js", icon: <SiExpress /> },
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "MySQL", icon: <SiMysql /> },
    ],
  },
  {
    title: "Deployment & Hosting",
    items: [
      { name: "Vercel", icon: <SiVercel /> },
      { name: "Netlify", icon: <SiNetlify /> },
      { name: "Render", icon: <FaDatabase /> },
      { name: "Railway", icon: <SiRailway /> },
      { name: "Firebase", icon: <SiFirebase /> },
      { name: "Docker", icon: <SiDocker /> },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Git", icon: <FaGitAlt /> },
      { name: "GitHub", icon: <FaGithub /> },
      { name: "VS Code", icon: <VscVscode /> },,
      { name: "Postman", icon: <SiPostman /> },
      { name: "Bruno", icon: <SiBruno /> },
      { name: "Thunder Client", icon: <TbBolt /> },
      { name: "HTTPie", icon: <SiHttpie /> },
    ],
  },
  {
    title: "AI & ML",
    items: [
      { name: "ChatGPT", icon: <SiOpenai /> },
      { name: "Claude", icon: <SiAnthropic /> },
      { name: "Gemini", icon: <SiGoogle /> },
      { name: "GitHub Copilot", icon: <SiGithubcopilot /> },
      { name: "OpenAI Codex", icon: <SiOpenai /> },
      { name: "Hugging Face", icon: <SiHuggingface /> },
      { name: "AI Agents", icon: <FaRobot /> },
    ],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      style={{
        height: "auto",
        background:
          "linear-gradient(180deg, rgba(7,16,31,0.82), rgba(3,7,18,0.88))",
        backdropFilter: "blur(2px)",
        borderTop: "1px solid rgba(0,255,255,0.05)",
        borderBottom: "1px solid rgba(0,255,255,0.04)",
        padding: "90px 60px 70px",
        color: "#E8F4FF",
        fontFamily: "Arial",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "3rem",
          marginBottom: "60px",
          textShadow: "0 0 20px rgba(0,255,255,0.12)",
        }}
      >
        Skills
      </h2>

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
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {skillGroups.map((group, index) => (
          <div
            key={index}
            style={{
              padding: "30px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 25px rgba(0,255,255,0.05)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(0,255,255,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 25px rgba(0,255,255,0.05)";
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                color: "#00FFFF",
              }}
            >
              {group.title}
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              {group.items.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    fontSize: "0.9rem",
                  }}
                >
                  <span
                    style={{
                      color: "#00FFFF",
                      fontSize: "1rem",
                    }}
                  >
                    {skill.icon}
                  </span>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}