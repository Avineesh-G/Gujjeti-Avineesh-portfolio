import * as React from "react";
import * as Lucide from "lucide-react";

interface SkillPillProps {
  skill: string;
  accentColor: string;
}

const SKILL_ICONS: Record<string, string> = {
  // Languages
  "Java": "devicon-java-plain colored",
  "Python": "devicon-python-plain colored",
  "JavaScript": "devicon-javascript-plain colored",
  "TypeScript": "devicon-typescript-plain colored",
  "C / C++": "devicon-cplusplus-plain colored",
  "SQL": "devicon-mysql-plain colored",
  "HTML5": "devicon-html5-plain colored",
  "CSS3": "devicon-css3-plain colored",

  // Frameworks & Libraries
  "React.js": "devicon-react-original colored",
  "Next.js": "devicon-nextjs-plain colored",
  "Node.js": "devicon-nodejs-plain colored",
  "Tailwind CSS": "devicon-tailwindcss-plain colored",
  "Vite": "devicon-vitejs-plain colored",

  // Databases & Backend
  "Firebase": "devicon-firebase-plain colored",
  "Firestore": "devicon-firebase-plain colored",
  "MongoDB": "devicon-mongodb-plain colored",

  // Tools & Platforms
  "Git": "devicon-git-plain colored",
  "GitHub": "devicon-github-original colored",
  "Vercel": "devicon-vercel-original colored",
  "Netlify": "devicon-netlify-plain colored",
  "Figma": "devicon-figma-plain colored",
  "Canva": "devicon-canva-plain colored",
};

const LUCIDE_ICONS: Record<string, keyof typeof Lucide> = {
  "Framer Motion": "Move",
  "REST APIs": "Globe",
  "Gemini AI": "Sparkles",
  "AI Chatbot Integration": "Sparkles",
  "Reinforcement Learning Environments": "Brain",
  "NPC Behaviour Training": "Brain",
  "AI Recommendation Systems": "Sparkles",
  "CI/CD": "GitBranch",
  "Data Structures & Algorithms": "Code2",
  "OOPs": "Code2",
  "DBMS": "Database",
  "System Design": "Cpu",
};

export function SkillPill({ skill, accentColor }: SkillPillProps) {
  const deviconClass = SKILL_ICONS[skill];
  const lucideIconName = LUCIDE_ICONS[skill];

  let iconNode = null;
  if (deviconClass) {
    iconNode = (
      <i
        className={`${deviconClass} text-lg transition-all duration-500 ease-out group-hover:scale-125 group-hover:rotate-[360deg]`}
      />
    );
  } else if (lucideIconName) {
    const IconComponent = Lucide[lucideIconName] as React.ComponentType<any>;
    if (IconComponent) {
      iconNode = (
        <IconComponent
          size={18}
          className="transition-all duration-500 ease-out group-hover:scale-125 group-hover:rotate-[360deg]"
          style={{ color: accentColor }}
        />
      );
    }
  }

  return (
    <span
      className="inline-flex items-center gap-2.5 bg-white border border-parchment rounded-full px-5 py-2.5 font-body text-sm text-charcoal transition-all duration-200 ease-out hover:scale-[1.03] hover:shadow-sm cursor-default group"
      style={
        {
          "--hover-color": accentColor,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = accentColor;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#E2DCD1";
      }}
    >
      {iconNode}
      <span className="font-medium tracking-[0.02em]">{skill}</span>
    </span>
  );
}
