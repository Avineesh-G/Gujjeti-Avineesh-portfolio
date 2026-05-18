import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  image: string;
  techStack: string[];
  link: string;
  zoomOut?: boolean;
}

export function ProjectCard({
  name,
  description,
  image,
  techStack,
  link,
  zoomOut = false,
}: ProjectCardProps) {
  return (
    <div className="bg-white border border-parchment rounded-lg overflow-hidden shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:-translate-y-1 hover:border-[#D5CFC5] group">
      <div className="aspect-video overflow-hidden -m-0 mb-0 bg-charcoal/5 relative">
        <img
          src={image}
          alt={name}
          className={`w-full h-full transition-all duration-500 ease-out group-hover:scale-[1.03] ${
            zoomOut
              ? "object-contain p-2.5 bg-[#120B24]"
              : "object-cover object-top"
          }`}
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl text-charcoal tracking-[0.03em] mb-2">
          {name}
        </h3>
        <p className="font-body text-sm text-mist leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="bg-parchment/30 rounded px-3 py-1 font-body text-xs text-charcoal tracking-[0.02em]"
            >
              {tech}
            </span>
          ))}
        </div>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-coral text-white rounded-full px-6 py-2.5 font-body text-[13px] tracking-[0.05em] transition-all duration-200 ease-out hover:bg-coral-hover hover:scale-[1.02]"
        >
          View Project
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
