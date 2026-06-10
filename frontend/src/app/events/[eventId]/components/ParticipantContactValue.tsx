"use client";

import { useId, useState } from "react";

type ParticipantContactValueProps = {
  label: string;
  value: string;
  className?: string;
};

export function ParticipantContactValue({
  label,
  value,
  className = "max-w-full",
}: ParticipantContactValueProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className={`relative inline-flex min-w-0 ${className}`}>
      <button
        type="button"
        className="block min-w-0 max-w-full truncate rounded-sm text-left text-zinc-600 underline decoration-zinc-300 decoration-dotted underline-offset-4 transition-colors hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-zinc-400 dark:decoration-zinc-600 dark:hover:text-zinc-100"
        aria-controls={tooltipId}
        aria-describedby={isOpen ? tooltipId : undefined}
        aria-expanded={isOpen}
        aria-label={`${label}: ${value}`}
        title={value}
        onClick={() => setIsOpen((current) => !current)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
      >
        {value}
      </button>

      {isOpen ? (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-full z-30 mt-1 max-w-[min(80vw,28rem)] whitespace-normal break-words rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground shadow-lg"
        >
          {value}
        </span>
      ) : null}
    </span>
  );
}
