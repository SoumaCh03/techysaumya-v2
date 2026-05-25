import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Skills from "@/components/landing/Skills";
import Featured from "@/components/landing/Featured";
import PhotographyPreview from "@/components/landing/Photography";
import Timeline from "@/components/landing/Timeline";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/navigation/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Hero />
        <About />
        <Skills />
        <Featured />
        <PhotographyPreview />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
