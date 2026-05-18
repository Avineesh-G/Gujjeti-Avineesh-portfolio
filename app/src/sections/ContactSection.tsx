import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SocialIcon } from "../components/SocialIcon";
import { Linkedin, Github } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
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
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.2,
        }
      );
    });

    // Social icons stagger
    const icons = innerRef.current.querySelectorAll("[data-icon]");
    icons.forEach((icon, i) => {
      gsap.fromTo(
        icon,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: icon,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.1,
        }
      );
    });
  }, { scope: bandRef });

  return (
    <>
      <div ref={bandRef} className="w-full bg-white opacity-0" style={{ padding: "80px 0" }}>
        <div
          ref={innerRef}
          className="mx-auto px-6 md:px-[60px] text-center"
          style={{ maxWidth: 1200 }}
        >
          <h2
            data-animate
            className="font-display text-4xl text-charcoal tracking-[0.05em] mb-8 opacity-0"
          >
            Get in Touch
          </h2>
          <p
            data-animate
            className="font-body text-xl text-charcoal mb-4 opacity-0"
          >
            Let's build something together.
          </p>
          <a
            data-animate
            href="mailto:avineeshgujjeti509@gmail.com"
            className="inline-block font-body text-xl md:text-2xl text-charcoal no-underline transition-all duration-200 ease-out hover:text-mist hover:underline opacity-0"
          >
            avineeshgujjeti509@gmail.com
          </a>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div data-icon className="opacity-0">
              <SocialIcon
                href="https://www.linkedin.com/in/gujjeti-avineesh-279226276"
                label="LinkedIn"
              >
                <Linkedin size={18} />
              </SocialIcon>
            </div>
            <div data-icon className="opacity-0">
              <SocialIcon href="https://github.com/Avineesh-G" label="GitHub">
                <Github size={18} />
              </SocialIcon>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="w-full py-6 text-center"
        style={{ backgroundColor: "#D5CFC5" }}
      >
        <p className="font-body text-xs text-mist tracking-[0.05em]">
          Gujjeti Avineesh. Built with passion and code.
        </p>
      </footer>
    </>
  );
}
