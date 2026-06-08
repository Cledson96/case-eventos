export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="3" width="24" height="23" rx="6" fill="var(--brand)" />
      <rect
        x="8"
        y="8.5"
        width="12"
        height="11"
        rx="2"
        fill="none"
        stroke="var(--brand-contrast)"
        strokeWidth="1.8"
      />
      <line x1="8" y1="12" x2="20" y2="12" stroke="var(--brand-contrast)" strokeWidth="1.8" />
      <line
        x1="11"
        y1="6.5"
        x2="11"
        y2="9.5"
        stroke="var(--brand-contrast)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="6.5"
        x2="17"
        y2="9.5"
        stroke="var(--brand-contrast)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="16" r="1.5" fill="var(--brand-contrast)" />
    </svg>
  );
}
