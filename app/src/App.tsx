import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@fontsource/dm-sans/400.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import { useScene } from "./hooks/useScene";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ContactSection } from "./sections/ContactSection";
import { IPhoneIntro } from "./components/IPhoneIntro";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { scrollProgressRef, mousePosRef } = useScene(canvasRef);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  // Scroll progress tracking for 3D scene
  useEffect(() => {
    if (!introComplete) return;

    const st = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      },
    });

    ScrollTrigger.refresh();

    return () => {
      st.kill();
    };
  }, [introComplete, scrollProgressRef]);

  // Mouse tracking
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX / window.innerWidth;
      mousePosRef.current.y = e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mousePosRef]);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={scrollContainerRef} className="relative">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 w-screen h-screen"
        style={{ pointerEvents: "none" }}
      />

      {/* iPhone Multilingual Intro Screen */}
      {loaded && !introComplete && (
        <IPhoneIntro onComplete={handleIntroComplete} />
      )}

      {/* HTML Content */}
      <div className="relative z-[1]">
        <HeroSection introComplete={introComplete} scrollProgressRef={scrollProgressRef} />
        <div style={{ height: "25vh" }} />
        <AboutSection />
        <div style={{ height: "25vh" }} />
        <SkillsSection />
        <div style={{ height: "25vh" }} />
        <ProjectsSection />
        <div style={{ height: "25vh" }} />
        <ContactSection />
      </div>
    </div>
  );
}
