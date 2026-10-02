import { Lightbulb, LightbulbOff, Sun } from "lucide-react";
import { useState } from "react";
import { useMumo } from "@/game/store";
import { cn } from "@/lib/utils";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

/** The same blue starry blanket MUMO sleeps beneath, only as a button illustration. */
const BlanketArt = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 72" aria-hidden className={className}>
    <path d="M8 15 Q23 5 42 12 Q67 2 88 12 Q108 8 113 22 L116 59 Q100 69 81 62 Q57 71 36 63 Q19 68 6 58 Z" fill="var(--sky)" stroke="var(--cocoa)" strokeOpacity="0.35" strokeWidth="2" />
    <path d="M8 15 Q29 24 54 15 Q79 7 113 22 L112 30 Q83 18 56 26 Q31 33 8 23 Z" fill="var(--cream)" />
    {([ [31, 39], [60, 49], [84, 34], [100, 52] ] as const).map(([x, y]) => (
      <path key={x} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 8} ${y - 2} L${x + 3} ${y + 2} L${x + 5} ${y + 8} L${x} ${y + 4} L${x - 5} ${y + 8} L${x - 3} ${y + 2} L${x - 8} ${y - 2} L${x - 2} ${y - 2} Z`} fill="var(--cream)" />
    ))}
  </svg>
);

export function SleepScene({ onClose }: { onClose: () => void }) {
  const { actions, state, message } = useMumo();
  const [blanket, setBlanket] = useState(state.sleeping);
  const [lampOff, setLampOff] = useState(state.sleeping);
  const [hint, setHint] = useState<string | null>(null);

  const asleep = state.sleeping;
  const roomDark = asleep || lampOff;

  const tuckIn = () => {
    if (blanket) return;
    setBlanket(true);
    setHint(null);
    if (lampOff) actions.startSleep();
  };

  const toggleLamp = () => {
    if (!blanket) {
      setHint("Najprv ma, prosím, prikry.");
      return;
    }
    setLampOff(true);
    actions.startSleep();
  };

  return (
    <SceneShell
      title="Dobrú noc"
      onClose={onClose}
      className={cn(roomDark ? "bg-night text-cream" : "bg-cream text-cocoa", "transition-colors duration-300")}
    >
      <SceneDecor scene="room" night={roomDark} />
      <div className="relative z-20 shrink-0">
        <SpeechBubble
          text={asleep ? message : hint ? hint : blanket ? "Teraz zhasni lampu." : "Prikry ma a zhasni lampu."}
        />
      </div>

      <div className="relative z-10 flex h-64 w-full max-w-[320px] shrink-0 items-end justify-center overflow-hidden sm:h-72">
        <div className="relative z-10 flex h-full items-end justify-center">
          <MumoCharacter art={asleep || blanket ? "spanok" : "vesely"} size="md" animate={!asleep} />
        </div>
      </div>

      {asleep ? (
        <>
          <p className={cn("font-display text-lg", roomDark ? "text-cream" : "text-cocoa")}>
            MUMO spinká a naberá energiu.
          </p>
          <ActionButton
            label="Zobudiť MUMA"
            tone="honey"
            onClick={() => {
              actions.wakeUp();
              onClose();
            }}
            className="min-h-14 w-auto max-w-[240px] flex-none flex-row gap-2 px-8 py-3"
          >
            <Sun className="size-7" />
          </ActionButton>
        </>
      ) : (
        <div
          className={cn(
            "relative z-10 grid w-full max-w-[340px] gap-3",
            blanket ? "grid-cols-1 px-16" : "grid-cols-2",
          )}
          >
          {!blanket && (
            <ActionButton
              label="Prikryť MUMA"
              tone="sky"
              onClick={tuckIn}
              className="min-h-24"
            >
              <BlanketArt className="h-12 w-20" />
            </ActionButton>
          )}
          <ActionButton
            label={lampOff ? "Zhasnuté" : "Zhasnúť lampu"}
            tone="cream"
            onClick={toggleLamp}
            disabled={lampOff}
            className="min-h-24"
          >
            {lampOff ? <LightbulbOff className="size-9" /> : <Lightbulb className="size-9" />}
          </ActionButton>
        </div>
      )}
    </SceneShell>
  );
}
