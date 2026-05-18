interface PillButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  download?: string | boolean;
}

export function PillButton({ children, href, onClick, className = "", download }: PillButtonProps) {
  const baseClasses =
    "inline-flex items-center gap-2 bg-coral text-white rounded-full px-8 py-3 font-body text-sm tracking-[0.05em] transition-all duration-200 ease-out hover:bg-coral-hover hover:scale-[1.02] cursor-pointer";

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${className}`} target="_blank" rel="noopener noreferrer" download={download}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
}
