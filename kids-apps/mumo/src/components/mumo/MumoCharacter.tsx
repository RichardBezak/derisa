import { artForMood, MUMO_ART, type MumoArt } from "@/game/assets";
import type { Mood } from "@/game/types";
import { cn } from "@/lib/utils";

type ArtKey = keyof typeof MUMO_ART;

export function MumoCharacter({
  mood,
  art,
  size = "lg",
  animate = true,
  className,
  style,
  onClick,
}: {
  mood?: Mood | undefined;
  art?: MumoArt | ArtKey | undefined;
  size?: "sm" | "md" | "lg" | undefined;
  animate?: boolean | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  onClick?: (() => void) | undefined;
}) {
  const resolved: MumoArt =
    typeof art === "string" ? MUMO_ART[art] : (art ?? artForMood(mood ?? "vesely"));

  const sizes = { sm: "w-28", md: "w-44", lg: "w-64 max-w-[70vw]" } as const;

  const img = (
    <img
      src={resolved.src}
      alt={resolved.alt}
      data-placeholder-art={resolved.isPlaceholder ? "true" : undefined}
      className={cn(
        "select-none drop-shadow-[0_18px_22px_rgba(120,80,30,0.22)]",
        sizes[size],
        animate && "motion-safe:animate-[mumo-breathe_4s_ease-in-out_infinite]",
        className,
      )}
      draggable={false}
      style={style}
    />
  );

  if (!onClick) return img;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Pohladkaj MUMA"
      className="rounded-full transition-transform active:scale-95 motion-reduce:active:scale-100"
    >
      {img}
    </button>
  );
}
