import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LULU_ART } from "@/game/assets";
import { MUMO_TUNING } from "@/game/config";
import { playSound } from "@/game/sound";
import { useMumo } from "@/game/store";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

/** Where the ball is; it stays with whoever caught it. */
type Holder = "mumo" | "lulu";

const FLY_MS = 620;

export function PlaygroundScene({ onClose }: { onClose: () => void }) {
  const { actions, state } = useMumo();
  const [passes, setPasses] = useState(0);
  const [holder, setHolder] = useState<Holder>("mumo");
  const [flying, setFlying] = useState(false);
  const [cheer, setCheer] = useState(false);
  const [luluCheer, setLuluCheer] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);
  const passesRef = useRef(0);
  const flyingRef = useRef(false);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  /** Each tap is exactly one flight to the other friend; taps in flight are ignored. */
  const pass = () => {
    if (done || flyingRef.current) return;
    flyingRef.current = true;
    const target: Holder = holder === "mumo" ? "lulu" : "mumo";
    playSound("tap", state.soundOn);
    setFlying(true);
    setHolder(target);
    later(() => {
      flyingRef.current = false;
      setFlying(false);
      if (target === "lulu") {
        setLuluCheer(true);
        later(() => setLuluCheer(false), 450);
      } else {
        setCheer(true);
        later(() => setCheer(false), 700);
      }
      const next = passesRef.current + 1;
      passesRef.current = next;
      setPasses(next);
      if (next >= MUMO_TUNING.playground.passesNeeded) {
        actions.finishPlayground();
        setCheer(true);
        setLuluCheer(true);
        setDone(true);
      }
    }, FLY_MS);
  };

  return (
    <SceneShell title="Ihrisko" onClose={onClose} className="bg-sky">
      <SceneDecor scene="playground" />
      <div className="relative z-10 flex w-full flex-col items-center gap-4">
        <SpeechBubble text={done ? "To nám išlo!" : holder === "mumo" ? "Ťukni na loptu a MUMO ju hodí LULU!" : "Ťukni na loptu a LULU ju hodí späť!"} />
        <div className="relative flex h-44 w-full items-end justify-between gap-2 sm:h-52">
          <MumoCharacter
            art={done || cheer ? "hra" : "vesely"}
            size="sm"
            animate={cheer}
            className={cheer ? (done ? "motion-safe:animate-[mumo-eat_0.35s_ease-in-out_4]" : "motion-safe:animate-[mumo-eat_0.35s_ease-in-out_2]") : undefined}
          />
          <button
            type="button"
            onClick={pass}
            disabled={done || flying}
            aria-label="Lopta"
            className="absolute bottom-10 flex size-16 -translate-x-1/2 items-center justify-center rounded-full disabled:cursor-default"
            style={{
              left: holder === "lulu" ? "calc(100% - 7rem)" : "7rem",
              transition: `left ${FLY_MS}ms ease-in-out`,
            }}
          >
            <span
              className="block size-12 rounded-full bg-coral shadow-[0_4px_0_rgba(120,85,40,0.25)]"
              style={{
                animation: flying ? `mumo-ball-arc ${FLY_MS}ms ease-in-out` : undefined,
                backgroundImage:
                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.85) 0 18%, transparent 19%)",
              }}
            />
          </button>
          <img
            src={LULU_ART.src}
            alt={LULU_ART.alt}
            className={`w-20 shrink-0 sm:w-24 ${luluCheer ? (done ? "motion-safe:animate-[lulu-hop_0.42s_ease-out_3]" : "motion-safe:animate-[lulu-hop_0.42s_ease-out]") : ""}`}
            data-placeholder-art="true"
          />
        </div>
        <p className="text-sm text-cocoa/70">
          Prihrávky: {passes}/{MUMO_TUNING.playground.passesNeeded}
        </p>
        {done && (
          <ActionButton
            label="Hotovo"
            tone="sage"
            onClick={onClose}
            className="min-h-14 w-auto max-w-[220px] flex-none flex-row px-8 py-3"
          >
            <Heart className="size-7" />
          </ActionButton>
        )}
      </div>
    </SceneShell>
  );
}
