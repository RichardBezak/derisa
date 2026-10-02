import { useState } from "react";
import { ACTIVITIES } from "@/game/config";
import { useMumo } from "@/game/store";
import { OUTDOOR_CLOSED_TEXT } from "@/game/time";
import type { ActivityType } from "@/game/types";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

import { ACTIVITY_ART } from "@/game/assets";

const TONES: Record<ActivityType, "honey" | "sky" | "sage" | "coral"> = {
  trampolina: "sage",
  skola: "honey",
  ihrisko: "sky",
  hojdacka: "coral",
  smyklavka: "honey",
};

export function ActivityPanel({
  onClose,
  onPick,
}: {
  onClose: () => void;
  onPick: (activity: ActivityType) => void;
}) {
  const { canPlay, canPlayOutdoors, night } = useMumo();
  const [closedNotice, setClosedNotice] = useState(false);

  /** Games only — school is a separate activity with its own card. */
  const games = ACTIVITIES.filter((activity) => !activity.timed);

  /** Trampoline and playground are outdoors, so at night they only rest. */
  const pick = (activity: ActivityType) => {
    if (!canPlayOutdoors) {
      setClosedNotice(true);
      return;
    }
    onPick(activity);
  };

  return (
    <SceneShell
      title="Hry"
      onClose={onClose}
      className={night ? "bg-night text-cream" : "bg-cream-deep"}
    >
      <div className="relative z-10 flex w-full flex-col items-center gap-3">
        <MumoCharacter art="hra" size="sm" className="max-h-32 w-auto object-contain" />
        <p className="font-display text-xl font-bold text-cocoa">Poď sa hrať!</p>
        {(closedNotice || !canPlayOutdoors) && (
          <SpeechBubble text={OUTDOOR_CLOSED_TEXT} />
        )}
        <div className="grid w-full grid-cols-2 gap-3">
        {games.map((activity) => (
          <ActionButton
            key={activity.id}
            label={activity.label}
            tone={TONES[activity.id]}
            disabled={!canPlay}
            onClick={() => pick(activity.id)}
            className={canPlayOutdoors ? "min-h-28 min-w-0" : "min-h-28 min-w-0 opacity-60"}
          >
            {activity.id === "hojdacka" ? (
              <svg viewBox="0 0 64 48" aria-hidden className="size-14" fill="none">
                <path d="M24 43 L32 26 L40 43 Z" fill="var(--honey-deep)" />
                <path d="M5 23 L59 34" stroke="var(--cocoa)" strokeWidth="6" strokeLinecap="round" />
                <circle cx="11" cy="11" r="8" fill="var(--honey-deep)" />
                <circle cx="52" cy="21" r="7" fill="var(--cream)" />
              </svg>
            ) : activity.id === "smyklavka" ? (
              <svg viewBox="0 0 64 56" aria-hidden className="size-14" fill="none">
                <path d="M42 8 v38" stroke="var(--honey-deep)" strokeWidth="6" strokeLinecap="round" />
                <path d="M54 15 v31" stroke="var(--honey-deep)" strokeWidth="6" strokeLinecap="round" />
                <path d="M42 18 h12 M42 28 h12" stroke="var(--cream)" strokeWidth="4" strokeLinecap="round" />
                <path d="M49 11 C42 24 34 36 15 41" stroke="var(--coral)" strokeWidth="11" strokeLinecap="round" />
                <path d="M49 11 C42 24 34 36 15 41" stroke="var(--honey)" strokeWidth="6" strokeLinecap="round" />
                <circle cx="18" cy="40" r="6" fill="var(--cocoa)" opacity="0.35" />
              </svg>
            ) : (
              <img src={ACTIVITY_ART[activity.id].src} alt="" aria-hidden className="size-14 object-contain" loading="lazy" />
            )}
          </ActionButton>
        ))}
        </div>
      </div>
    </SceneShell>
  );
}
