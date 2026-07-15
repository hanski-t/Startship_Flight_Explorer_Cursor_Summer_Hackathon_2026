import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  description?: ReactNode;
  right?: ReactNode;
  className?: string;
}

/** Consistent section header: display title + optional muted description,
    with an optional right-aligned readout. No eyebrow kickers by default,
    the title carries the section on its own. */
export function SectionHeading({
  title,
  description,
  right,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className="max-w-[62ch]">
        <h2 className="font-display text-lg font-semibold tracking-tight text-[color:var(--color-ink)] sm:text-xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--color-mute)]">
            {description}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
