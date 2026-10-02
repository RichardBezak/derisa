import { Bath, Cookie, Heart, Moon } from "lucide-react";
import { MUMO_TUNING } from "@/game/config";
import type { NeedKey, Needs } from "@/game/types";
import { cn } from "@/lib/utils";

const ITEMS = [
  { key: "satiety", label: "Jedlo", Icon: Cookie, color: "bg-honey" },
  { key: "cleanliness", label: "Kúpeľ", Icon: Bath, color: "bg-sky" },
  { key: "energy", label: "Spánok", Icon: Moon, color: "bg-sage" },
  { key: "joy", label: "Hranie", Icon: Heart, color: "bg-coral" },
] as const;

/**
 * Friendly pictorial indicators: three little dots, never numbers for the child.
 * With `onSelect` they also work as the permanent main navigation.
 */
export function NeedIndicators({
  needs,
  showNumbers = false,
  onSelect,
  active = null,
  disabledKeys,
}: {
  needs: Needs;
  showNumbers?: boolean;
  onSelect?: ((key: NeedKey) => void) | undefined;
  active?: NeedKey | null | undefined;
  /** Icons that cannot be opened right now (e.g. while MUMO sleeps). */
  disabledKeys?: readonly NeedKey[] | undefined;
}) {
  return (
    <div className="flex items-end justify-center gap-3">
      {ITEMS.map(({ key, label, Icon, color }) => {
        const value = needs[key];
        const filled = value >= 67 ? 3 : value >= 34 ? 2 : 1;
        const low = value < MUMO_TUNING.needs.lowThreshold;
        const isActive = active === key;
        const content = (
          <>
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-2xl shadow-[0_4px_10px_-6px_rgba(90,60,20,0.6)]",
                color,
                isActive && "ring-4 ring-cocoa/45",
                low && !isActive && "motion-safe:animate-[mumo-nudge_1.6s_ease-in-out_infinite]",
              )}
            >
              <Icon className="size-6 text-cocoa" strokeWidth={2.4} />
            </div>
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn("size-1.5 rounded-full", i < filled ? "bg-cocoa/70" : "bg-cocoa/15")}
                />
              ))}
            </div>
            {showNumbers && (
              <span className="font-mono text-[10px] text-cocoa/70">{Math.round(value)}</span>
            )}
          </>
        );

        if (!onSelect) {
          return (
            <div key={key} className="flex flex-col items-center gap-1" aria-label={label} title={label}>
              {content}
            </div>
          );
        }

        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            disabled={disabledKeys?.includes(key)}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            title={label}
            className="flex min-h-16 min-w-16 flex-col items-center gap-1 rounded-3xl p-1 transition-transform active:scale-95 motion-reduce:active:scale-100 disabled:opacity-45 disabled:active:scale-100"
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
