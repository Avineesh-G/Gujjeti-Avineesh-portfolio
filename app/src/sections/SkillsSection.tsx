import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SkillPill } from "../components/SkillPill";

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    label: "Languages",
    accent: "#8FBC8F",
    skills: [
      "Java",
      "Python",
      "JavaScript",
      "TypeScript",
      "C / C++",
      "SQL",
      "HTML5",
      "CSS3",
    ],
  },
  {
    label: "Frameworks & Libraries",
    accent: "#87CEEB",
    skills: [
      "React.js",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "Chart.js",
      "Vite",
      "Framer Motion",
    ],
  },
  {
    label: "Databases & Backend",
    accent: "#B19CD9",
    skills: [
      "Firebase",
      "Firestore",
      "REST APIs",
      "MongoDB",
    ],
  },
  {
    label: "AI & Intelligent Systems",
    accent: "#98D8C8",
    skills: [
      "Gemini AI",
      "AI Chatbot Integration",
      "Reinforcement Learning Environments",
      "NPC Behaviour Training",
      "AI Recommendation Systems",
    ],
  },
  {
    label: "Tools & Platforms",
    accent: "#F0B27A",
    skills: [
      "Git",
      "GitHub",
      "CI/CD",
      "Vercel",
      "Firebase Hosting",
      "Netlify",
      "Figma",
      "Canva",
    ],
  },
  {
    label: "Core Fundamentals",
    accent: "#A0AEC0",
    skills: [
      "Data Structures & Algorithms",
      "OOPs",
      "DBMS",
      "System Design",
    ],
  },
];

export function SkillsSection() {
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

    // Heading
    const heading = innerRef.current.querySelector("[data-heading]");
    if (heading) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Category groups
    const groups = innerRef.current.querySelectorAll("[data-category]");
    groups.forEach((group, i) => {
      gsap.fromTo(
        group,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.15,
        }
      );

      // Pills stagger
      const pills = group.querySelectorAll("[data-pill]");
      pills.forEach((pill, j) => {
        gsap.fromTo(
          pill,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: group,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            delay: i * 0.15 + j * 0.05,
          }
        );
      });
    });
  }, { scope: bandRef });

  return (
    <div ref={bandRef} className="w-full bg-white opacity-0" style={{ padding: "80px 0" }}>
      <div ref={innerRef} className="mx-auto px-6 md:px-[60px]" style={{ maxWidth: 1200 }}>
        <h2
          data-heading
          className="font-display text-4xl text-charcoal tracking-[0.05em] mb-12 opacity-0"
        >
          Skills
        </h2>

        <div className="flex flex-col gap-12">
          {skillCategories.map((category) => (
            <div
              key={category.label}
              data-category
              className="flex flex-col md:flex-row gap-6 md:gap-8 opacity-0"
            >
              <div className="md:min-w-[240px] md:w-[240px] flex items-center justify-between pr-6 relative">
                <span className="font-body text-sm text-mist tracking-[0.05em] uppercase">
                  {category.label}
                </span>
                <div
                  className="w-[2px] h-[24px] rounded-full hidden md:block"
                  style={{ backgroundColor: category.accent }}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <div key={skill} data-pill className="opacity-0">
                    <SkillPill skill={skill} accentColor={category.accent} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
