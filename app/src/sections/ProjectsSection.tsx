import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ProjectCard } from "../components/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    name: "CompanionX – Intelligent Ride-Sharing Platform",
    description:
      "Engineered a web-based ride-sharing platform designed to optimize bus travel costs by intelligently matching users with co-travellers on shared routes.",
    image: "/assets/companion-x.png",
    techStack: ["TypeScript", "JavaScript", "HTML", "CSS"],
    link: "https://companion-x.vercel.app/",
  },
  {
    name: "LaundryHub – AI-Based Laundry Management System",
    description:
      "Developed a full-stack AI-powered laundry management platform featuring QR-based tracking, multi-role dashboards, real-time notifications, and Gemini AI chatbot integration.",
    image: "/assets/laundry-hub.png",
    techStack: ["React", "TypeScript", "Firebase", "Tailwind CSS", "Gemini AI"],
    link: "https://laundryhub-5ab8e.web.app/login",
    zoomOut: true,
  },
  {
    name: "Ultimate Career AI – AI Career Recommendation Platform",
    description:
      "Built an AI-powered career assessment and recommendation platform delivering personalized insights through Gemini AI with PDF reports, analytics dashboards, and automated email delivery.",
    image: "/assets/ultimate-career-ai.png",
    techStack: ["JavaScript", "Node.js", "Firebase", "Gemini AI", "Chart.js"],
    link: "https://ultimate-career-ai-456a5.web.app/",
    zoomOut: true,
  },
  {
    name: "Hand Gesture Space Shooter",
    description:
      "Created a browser-based space shooter game controlled entirely through webcam hand gestures without requiring installations or external hardware.",
    image: "/assets/space-shooter.png",
    techStack: ["JavaScript", "MediaPipe", "HTML", "CSS"],
    link: "https://hand-gestures-space-void.vercel.app/",
    zoomOut: true,
  },
];

export function ProjectsSection() {
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

    // Heading and intro
    const header = innerRef.current.querySelector("[data-header]");
    if (header) {
      gsap.fromTo(
        header,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    const intro = innerRef.current.querySelector("[data-intro]");
    if (intro) {
      gsap.fromTo(
        intro,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: intro,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          delay: 0.2,
        }
      );
    }

    // Project cards stagger
    const cards = innerRef.current.querySelectorAll("[data-card]");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.1,
        }
      );
    });
  }, { scope: bandRef });

  return (
    <div ref={bandRef} className="w-full bg-white opacity-0" style={{ padding: "80px 0" }}>
      <div ref={innerRef} className="mx-auto px-6 md:px-[60px]" style={{ maxWidth: 1200 }}>
        <h2
          data-header
          className="font-display text-4xl text-charcoal tracking-[0.05em] mb-4 opacity-0"
        >
          Selected Work
        </h2>
        <p
          data-intro
          className="font-body text-base text-mist leading-relaxed max-w-[600px] mb-12 opacity-0"
        >
          A selection of projects I've built — from real-time data platforms to
          developer tooling and open-source contributions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.name} data-card className="opacity-0">
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
