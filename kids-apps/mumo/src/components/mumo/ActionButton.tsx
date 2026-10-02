import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ActionButton({
  label,
  children,
  onClick,
  disabled,
  tone = "honey",
  className,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "honey" | "sky" | "sage" | "coral" | "cream";
  className?: string;
}) {
  const tones = {
    honey: "bg-honey",
    sky: "bg-sky",
    sage: "bg-sage",
    coral: "bg-coral",
    cream: "bg-cream-deep",
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex min-h-20 min-w-20 flex-1 flex-col items-center justify-center gap-1 rounded-3xl px-3 py-3",
        "shadow-[0_6px_0_rgba(120,85,40,0.22)] transition-transform active:translate-y-0.5 active:shadow-[0_3px_0_rgba(120,85,40,0.22)]",
        "disabled:opacity-40 motion-reduce:active:translate-y-0",
        tones[tone],
        className,
      )}
    >
      <span className="text-cocoa">{children}</span>
      <span className="font-display text-sm font-semibold text-cocoa">{label}</span>
    </button>
  );
}
