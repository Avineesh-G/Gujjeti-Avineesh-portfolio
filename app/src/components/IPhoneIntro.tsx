import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

interface IPhoneIntroProps {
  onComplete: () => void;
}

const GREETINGS = [
  { text: "Hello", lang: "English", fontClass: "font-display" },
  { text: "Hola", lang: "Spanish", fontClass: "font-display" },
  { text: "Bonjour", lang: "French", fontClass: "font-display" },
  { text: "Ciao", lang: "Italian", fontClass: "font-display" },
  { text: "నమస్కారం", lang: "Telugu", fontClass: "font-sans font-bold" },
  { text: "नमस्ते", lang: "Hindi", fontClass: "font-sans font-bold" },
  { text: "こんにちは", lang: "Japanese", fontClass: "font-sans font-medium" },
  { text: "Olá", lang: "Portuguese", fontClass: "font-display" },
  { text: "你好", lang: "Chinese", fontClass: "font-sans font-medium" },
  { text: "Hallo", lang: "German", fontClass: "font-display" },
  { text: "안녕하세요", lang: "Korean", fontClass: "font-sans font-medium" },
  { text: "Hej", lang: "Swedish", fontClass: "font-display" },
  { text: "مرحباً", lang: "Arabic", fontClass: "font-sans font-medium" },
  { text: "Vanakkam", lang: "Tamil", fontClass: "font-sans font-bold" },
];

export function IPhoneIntro({ onComplete }: IPhoneIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Track component mount so textRef is guaranteed to be ready
  useEffect(() => {
    setMounted(true);
  }, []);

  // Synthesize iPhone-like elegant click/unlock sound using Web Audio API
  const playUnlockSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
      osc2.frequency.exponentialRampToValueAtTime(392.00, ctx.currentTime + 0.15); // G4

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.2);
      osc2.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.log("Audio synthesis blocked or unsupported:", e);
    }
  }, []);

  // Main exit trigger function
  const triggerExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    playUnlockSound();

    if (containerRef.current) {
      gsap.killTweensOf(containerRef.current);
      
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete();
        }
      });

      // Smooth slide up exit curtain transition
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 1.0,
        ease: "power4.inOut"
      });
      
      // Zoom out overlay slightly to make transition natural
      tl.to(containerRef.current, {
        scale: 0.98,
        opacity: 0,
        duration: 0.7,
        ease: "power3.inOut"
      }, 0);
    } else {
      onComplete();
    }
  }, [isExiting, onComplete, playUnlockSound]);

  // Multilingual text cycling loop
  useEffect(() => {
    if (!mounted || isExiting) return;

    const textEl = textRef.current;
    if (!textEl) return;

    const playNext = (index: number) => {
      if (index >= GREETINGS.length) {
        triggerExit();
        return;
      }

      setGreetingIndex(index);
      gsap.killTweensOf(textEl);

      const tl = gsap.timeline({
        onComplete: () => {
          playNext(index + 1);
        }
      });

      // Staggered text animations: slide up, scale and blur fade-in
      tl.fromTo(textEl,
        { y: 30, opacity: 0, filter: "blur(8px)", scale: 0.96 },
        { y: 0, opacity: 1, filter: "blur(0px)", scale: 1, duration: 0.65, ease: "power3.out" }
      )
      .to(textEl, {
        duration: 0.65 // Hold the greeting briefly
      })
      .to(textEl, {
        y: -25,
        opacity: 0,
        filter: "blur(8px)",
        scale: 1.02,
        duration: 0.5,
        ease: "power3.in"
      });
    };

    playNext(0);

    return () => {
      gsap.killTweensOf(textEl);
    };
  }, [mounted, isExiting, triggerExit]);

  return (
    <div
      ref={containerRef}
      onClick={triggerExit}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#E2DCD1] overflow-hidden select-none cursor-pointer"
    >
      {/* Custom Styles for Floating Ambient Blobs */}
      <style>{`
        @keyframes float-blob-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes float-blob-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 50px) scale(1.2); }
        }
        @keyframes float-blob-3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, 40px) scale(0.85); }
        }
        .animate-blob-1 {
          animation: float-blob-1 16s infinite ease-in-out;
        }
        .animate-blob-2 {
          animation: float-blob-2 20s infinite ease-in-out;
        }
        .animate-blob-3 {
          animation: float-blob-3 18s infinite ease-in-out;
        }
      `}</style>

      {/* Grid Pattern Overlay matching tech spec texture */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#4a4a4a04_1px,transparent_1px),linear-gradient(to_bottom,#4a4a4a04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" 
        style={{ maskImage: "radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)", WebkitMaskImage: "radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)" }}
      />

      {/* Dynamic Glowing Ambient Blobs matching portfolio accent palette */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-80">
        {/* Soft Apricot/Coral Blob */}
        <div className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-[#F4A0A0]/20 to-[#E08E8E]/5 filter blur-[100px] animate-blob-1" />
        {/* Soft Blue Blob matching Three.js canvas components */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-[#93c5fd]/15 to-[#5b8def]/5 filter blur-[100px] animate-blob-2" />
        {/* Organic Light Linen Highlight Blob */}
        <div className="absolute top-[30%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-white/20 filter blur-[120px] animate-blob-3" />
      </div>

      {/* Main Centered Greeting Display - Pure typography floating directly in space */}
      <div className="relative z-10 text-center pointer-events-none px-4 flex flex-col items-center justify-center">
        <div ref={textRef} className="max-w-5xl">
          <h2 className={`${GREETINGS[greetingIndex]?.fontClass || "font-display"} text-6xl md:text-9xl lg:text-[130px] tracking-tight text-[#4A4A4A] select-none font-medium leading-none`}>
            {GREETINGS[greetingIndex]?.text}
          </h2>
          <span className="block mt-6 text-xs md:text-sm lg:text-base uppercase tracking-[0.35em] text-[#8C8C8C] font-sans font-bold">
            {GREETINGS[greetingIndex]?.lang}
          </span>
        </div>
      </div>
      
      {/* Click anywhere instructions, integrated minimally */}
      <span className="absolute bottom-10 z-10 text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#8C8C8C]/60 hover:text-[#4A4A4A]/80 transition-colors pointer-events-none">
        Click anywhere to explore
      </span>
    </div>
  );
}
