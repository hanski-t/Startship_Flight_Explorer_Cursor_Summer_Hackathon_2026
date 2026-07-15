import type { HTMLAttributes } from "react";

interface PanelProps extends HTMLAttributes<HTMLElement> {
  /** Slightly brighter, elevated surface for focused content. */
  elevated?: boolean;
}

/** Shared instrument-panel surface: hairline frame + graphite fill +
    a 1px top highlight for physical edge refraction. Used everywhere a
    section sits on the void so every panel reads as the same material. */
export function Panel({
  className = "",
  elevated = false,
  children,
  ...props
}: PanelProps) {
  return (
    <section
      className={`rounded-2xl border border-[color:var(--color-line)] ${
        elevated
          ? "bg-[color:var(--color-panel-2)]"
          : "bg-[color:var(--color-panel)]"
      } shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_12px_40px_-24px_rgba(0,0,0,0.9)] ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
