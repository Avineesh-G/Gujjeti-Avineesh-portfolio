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

gsap.registerPlugin(ScrollTrigger);

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [loadingText, setLoadingText] = useState("LOADING");
  const overlayRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 50;
      if (elapsed < 2000) {
        setLoadingText(
          "LOADING"
            .split("")
            .map((c) =>
              Math.random() > 0.5
                ? CHARS[Math.floor(Math.random() * CHARS.length)]
                : c
            )
            .join("")
        );
      } else {
        setLoadingText("LOADING");
      }
    }, 50);

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Phase 2: Spinner dissolve (2.5s - 3.5s)
    tl.to(
      spinnerRef.current,
      {
        rotation: 720,
        opacity: 0,
        duration: 1,
        ease: "none",
      },
      2.5
    );

    tl.to(
      textRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: "none",
      },
      2.5
    );

    // Phase 3: Overlay fade (3.5s - 4.0s)
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      },
      3.5
    );

    return () => {
      clearInterval(interval);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
    >
      <div
        ref={spinnerRef}
        className="w-10 h-10 rounded-full border-2 border-white border-t-transparent mb-6"
      />
      <span
        ref={textRef}
        className="text-white font-body text-xs tracking-[0.05em]"
      >
        {loadingText}
      </span>
    </div>
  );
}

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

      {/* Loading Screen */}
      {loaded && !introComplete && (
        <LoadingScreen onComplete={handleIntroComplete} />
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
