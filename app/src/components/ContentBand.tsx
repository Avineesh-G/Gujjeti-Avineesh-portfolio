import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ContentBandProps {
  children: React.ReactNode;
  className?: string;
}

export function ContentBand({ children, className = "" }: ContentBandProps) {
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

    // Animate inner elements
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
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.1,
        }
      );
    });
  }, { scope: bandRef });

  return (
    <div
      ref={bandRef}
      className={`w-full bg-white opacity-0 ${className}`}
      style={{ padding: "80px 0" }}
    >
      <div
        ref={innerRef}
        className="mx-auto px-6 md:px-[60px]"
        style={{ maxWidth: 1200 }}
      >
        {children}
      </div>
    </div>
  );
}
