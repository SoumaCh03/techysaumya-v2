"use client";

import React from "react";
import { 
  FaPython, FaJs, FaReact, FaNodeJs, FaGitAlt, FaGithub, FaHtml5, FaCss3Alt 
} from "react-icons/fa";
import { 
  SiExpress, SiNextdotjs, SiTailwindcss, SiMongodb, SiMysql, SiVercel, 
  SiDocker, SiTypescript, SiCplusplus, SiAnthropic, SiHuggingface, SiOpenai, SiGoogle 
} from "react-icons/si";
import { Cpu, Terminal, Layout, Database, Cloud, Settings } from "lucide-react";

interface SkillItem {
  name: string;
  icon: React.ReactNode;
}

interface SkillGroup {
  title: string;
  icon: React.ReactNode;
  items: SkillItem[];
}

export default function Skills() {
  const groups: SkillGroup[] = [
    {
      title: "Programming Languages",
      icon: <Terminal className="w-4 h-4 text-cyan-accent" />,
      items: [
        { name: "Python", icon: <FaPython /> },
        { name: "JavaScript", icon: <FaJs /> },
        { name: "TypeScript", icon: <SiTypescript /> },
        { name: "C++", icon: <SiCplusplus /> },
      ],
    },
    {
      title: "Frontend Development",
      icon: <Layout className="w-4 h-4 text-cyan-accent" />,
      items: [
        { name: "HTML5", icon: <FaHtml5 /> },
        { name: "CSS3", icon: <FaCss3Alt /> },
        { name: "React", icon: <FaReact /> },
        { name: "Next.js", icon: <SiNextdotjs /> },
        { name: "Tailwind", icon: <SiTailwindcss /> },
      ],
    },
    {
      title: "Backend & Databases",
      icon: <Database className="w-4 h-4 text-cyan-accent" />,
      items: [
        { name: "Node.js", icon: <FaNodeJs /> },
        { name: "Express.js", icon: <SiExpress /> },
        { name: "MongoDB", icon: <SiMongodb /> },
        { name: "MySQL", icon: <SiMysql /> },
      ],
    },
    {
      title: "Deployment & Hosting",
      icon: <Cloud className="w-4 h-4 text-cyan-accent" />,
      items: [
        { name: "Vercel", icon: <SiVercel /> },
        { name: "Docker", icon: <SiDocker /> },
        { name: "Firebase", icon: <Cpu /> },
      ],
    },
    {
      title: "Tools & Utilities",
      icon: <Settings className="w-4 h-4 text-cyan-accent" />,
      items: [
        { name: "Git", icon: <FaGitAlt /> },
        { name: "GitHub", icon: <FaGithub /> },
        { name: "VS Code", icon: <Terminal /> },
      ],
    },
    {
      title: "AI & ML Integration",
      icon: <Cpu className="w-4 h-4 text-cyan-accent" />,
      items: [
        { name: "Gemini AI", icon: <SiGoogle /> },
        { name: "Claude", icon: <SiAnthropic /> },
        { name: "OpenAI", icon: <SiOpenai /> },
        { name: "Hugging Face", icon: <SiHuggingface /> },
      ],
    },
  ];

  return (
    <section
      id="skills"
      className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 relative bg-gradient-to-b from-bg-base via-bg-surface/20 to-bg-base border-b border-white/5 overflow-hidden"
    >
      <div className="absolute w-[300px] h-[300px] bg-cyan-accent/2 filter blur-[100px] top-[20%] right-[10%] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Title */}
        <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-cyan-accent mb-3">
          TECH ECOSYSTEM
        </span>
        <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white mb-6 text-center select-none">
          Skills &amp; Expertise
        </h2>
        
        <p className="text-text-secondary text-sm md:text-base leading-relaxed text-center max-w-3xl mb-16 font-sans font-medium">
          A carefully curated stack of tools and technologies I utilize to bring concepts into scalable production reality.
        </p>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {groups.map((group, idx) => (
            <div
              key={idx}
              className="glass-panel border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-accent/15 group relative shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-3">
                <div className="w-8 h-8 rounded-lg bg-white/2 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform">
                  {group.icon}
                </div>
                <h3 className="font-display font-extrabold text-base text-white tracking-wide">
                  {group.title}
                </h3>
              </div>

              {/* Items flex pills */}
              <div className="flex flex-wrap gap-2.5">
                {group.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/2 hover:bg-cyan-accent/5 border border-white/5 hover:border-cyan-accent/20 text-xs font-semibold text-text-secondary hover:text-white transition-all duration-300 select-none cursor-default"
                  >
                    <span className="text-cyan-accent text-sm">{item.icon}</span>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
