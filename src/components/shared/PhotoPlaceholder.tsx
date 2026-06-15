interface PhotoPlaceholderProps {
  label: string;
  aspectRatio?: string;
  className?: string;
}

export function PhotoPlaceholder({ label, aspectRatio = "aspect-[4/3]", className = "" }: PhotoPlaceholderProps) {
  return (
    <div
      className={`${aspectRatio} ${className} flex flex-col items-center justify-center gap-3`}
      style={{ backgroundColor: "var(--sand)" }}
      aria-label={label}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeWidth="1.2" style={{ color: "var(--navy)", opacity: 0.25 }} stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span style={{ color: "var(--navy)", fontSize: "0.65rem", opacity: 0.35, fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Foto binnenkort beschikbaar
      </span>
    </div>
  );
}
