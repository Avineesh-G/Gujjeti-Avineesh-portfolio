import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  introComplete: boolean;
  scrollProgressRef: React.RefObject<number>;
}

export function HeroSection({ introComplete }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!introComplete) return;

    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    )
      .fromTo(
        introRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      )
      .fromTo(
        tagRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      )
      .fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6"
      );
  }, [introComplete]);

  // Scroll indicator fade out
  useGSAP(() => {
    if (!scrollIndicatorRef.current) return;

    gsap.to(scrollIndicatorRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "5% top",
        scrub: true,
      },
    });
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center"
      style={{ height: "100vh" }}
    >
      <div className="text-center px-6 relative z-10">
        <h1
          ref={nameRef}
          className="font-display text-[42px] md:text-[84px] text-charcoal leading-[1.1] tracking-[0.05em] opacity-0"
        >
          Gujjeti Avineesh
        </h1>
        <p
          ref={introRef}
          className="font-body text-base md:text-lg text-mist tracking-[0.02em] mt-8 max-w-[750px] mx-auto leading-[1.6] opacity-0"
        >
          Computer Science undergraduate at VIT-AP University passionate about building AI-powered web applications, scalable full-stack systems, and interactive digital experiences. Skilled in frontend engineering, backend development, and intelligent system design with hands-on experience in real-world AI and software projects.
        </p>
        <p
          ref={tagRef}
          className="font-body text-sm text-charcoal tracking-[0.08em] mt-6 uppercase font-normal opacity-0"
        >
          Full-Stack Developer • AI & Interactive Systems Engineer
        </p>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0"
      >
        <div className="animate-bounce-soft">
          <ChevronDown size={24} className="text-mist" />
        </div>
      </div>
    </section>
  );
}
