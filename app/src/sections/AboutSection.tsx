import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PillButton } from "../components/PillButton";
import { Download } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const bandRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bandRef.current || !innerRef.current) return;

    gsap.fromTo(
      bandRef.current,
      { opacity: 0, y: -80 },
      {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: bandRef.current,
          start: "top 90%",
          end: "top 20%",
          scrub: 0.5,
        },
      }
    );

    const elements = innerRef.current.querySelectorAll("[data-animate]");
    elements.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.15,
        }
      );
    });
  }, { scope: bandRef });

  return (
    <div ref={bandRef} className="w-full bg-white opacity-0" style={{ padding: "80px 0" }}>
      <div ref={innerRef} className="mx-auto px-6 md:px-[60px]" style={{ maxWidth: 1200 }}>
        {/* Philosophy Statement */}
        <p
          data-animate
          className="font-display text-xl md:text-2xl text-charcoal italic leading-[1.5] mb-12 max-w-[800px] opacity-0"
        >
          2+ Years of Development & AI Project Experience • Hyderabad / Amaravati, India
        </p>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[60px]">
          {/* Photo */}
          <div data-animate className="opacity-0">
            <div className="overflow-hidden rounded shadow-soft">
              <img
                src="/assets/about-portrait.jpg"
                alt="Gujjeti Avineesh"
                className="w-full aspect-[3/4] object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center">
            <h2
              data-animate
              className="font-display text-4xl text-charcoal tracking-[0.05em] mb-8 opacity-0"
            >
              About
            </h2>
            <p
              data-animate
              className="font-body text-base text-charcoal leading-[1.6] mb-4 opacity-0"
            >
              I’m a Full-Stack Developer focused on building AI-powered web applications, scalable platforms, and interactive digital experiences using technologies like React, TypeScript, Firebase, Node.js, and Gemini AI.
            </p>
            <p
              data-animate
              className="font-body text-base text-charcoal leading-[1.6] mb-4 opacity-0"
            >
              I have developed projects including AI career recommendation systems, smart management platforms, and browser-based interactive applications with a strong emphasis on clean UI, performance, and real-world problem solving.
            </p>
            <p
              data-animate
              className="font-body text-base text-charcoal leading-[1.6] mb-4 opacity-0"
            >
              I also gained hands-on industry experience through internships at Scaler, where I worked on reinforcement learning environments and NPC behavior training for interactive systems.
            </p>
            <p
              data-animate
              className="font-body text-base text-charcoal leading-[1.6] italic mb-8 opacity-0"
            >
              Outside development, I enjoy exploring AI advancements, UI/UX design trends, system architecture concepts, hackathons, and building experimental side projects that combine creativity with technical problem-solving.
            </p>
            <div data-animate className="opacity-0">
              <PillButton href="/assets/gujjeti-avineesh-resume.pdf">
                <Download size={16} />
                Download Resume
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
