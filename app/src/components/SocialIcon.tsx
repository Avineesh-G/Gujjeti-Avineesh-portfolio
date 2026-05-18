interface SocialIconProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

export function SocialIcon({ href, label, children }: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 rounded-full border border-parchment flex items-center justify-center text-mist transition-all duration-200 ease-out hover:border-charcoal hover:text-charcoal hover:scale-110"
    >
      {children}
    </a>
  );
}
