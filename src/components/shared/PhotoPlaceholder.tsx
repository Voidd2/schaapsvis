interface PhotoPlaceholderProps {
  label: string;
  aspectRatio?: string;
  className?: string;
}

export function PhotoPlaceholder({ label, aspectRatio = "aspect-[4/3]", className = "" }: PhotoPlaceholderProps) {
  return (
    <div
      className={`${aspectRatio} ${className} flex flex-col items-center justify-center gap-2`}
      style={{ backgroundColor: "#ddd8cc", border: "2px dashed #bbb5a8" }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <span style={{ color: "#888", fontSize: "0.7rem", textAlign: "center", padding: "0 1rem", lineHeight: "1.3", fontWeight: 500 }}>
        {label}
      </span>
    </div>
  );
}
