import { useEffect, useRef, useState } from "react";
import { FOOD_ART } from "@/game/assets";
import { FOODS, type FoodId } from "@/game/config";
import { useMumo } from "@/game/store";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

type Phase = "idle" | "flying" | "chewing" | "happy";

const FLY_MS = 750;
const CHEW_MS = 700;
const HAPPY_MS = 1400;

interface Flight {
  id: FoodId;
  from: { x: number; y: number };
  to: { x: number; y: number };
  moving: boolean;
}

export function FoodScene({ onClose }: { onClose: () => void }) {
  const { actions, message, mood } = useMumo();
  const [phase, setPhase] = useState<Phase>("idle");
  const [flight, setFlight] = useState<Flight | null>(null);
  const mumoRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    },
    [],
  );

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const handleFeed = (id: FoodId, el: HTMLElement) => {
    if (phase !== "idle") return; // one bite at a time
    const start = el.getBoundingClientRect();
    const mumo = mumoRef.current?.getBoundingClientRect();
    const from = { x: start.left + start.width / 2, y: start.top + start.height / 2 };
    const to = mumo
      ? { x: mumo.left + mumo.width / 2, y: mumo.top + mumo.height * 0.42 }
      : { x: from.x, y: from.y - 160 };

    setPhase("flying");
    setFlight({ id, from, to, moving: false });
    requestAnimationFrame(() => setFlight((f) => (f ? { ...f, moving: true } : f)));

    later(() => {
      setFlight(null);
      setPhase("chewing");
    }, FLY_MS);
    later(() => {
      actions.feed(id); // satiety rises once, after the animation
      setPhase("happy");
    }, FLY_MS + CHEW_MS);
    later(() => setPhase("idle"), FLY_MS + CHEW_MS + HAPPY_MS);
  };

  const bubble =
    phase === "flying" ? "Hmm, to vyzerá dobre!" : phase === "chewing" ? "Mňam!" : message;

  return (
    <SceneShell title="Čo si dáš?" onClose={onClose} className="bg-cream-deep">
      <SceneDecor scene="room" />
      <SpeechBubble text={bubble} />
      <div ref={mumoRef} className="relative z-10 flex items-end justify-center">
        <MumoCharacter
          mood={phase === "happy" ? "vesely" : mood}
          size="md"
          animate={phase === "idle"}
          className={
            phase === "chewing"
              ? "motion-safe:animate-[mumo-chew_0.35s_ease-in-out_2]"
              : phase === "happy"
                ? "motion-safe:animate-[mumo-eat_0.4s_ease-in-out_2]"
                : undefined
          }
        />
      </div>

      <div className="relative z-10 grid w-full grid-cols-3 gap-2">
        {FOODS.map((food) => (
          <button
            key={food.id}
            type="button"
            onClick={(e) => handleFeed(food.id, e.currentTarget)}
            disabled={phase !== "idle"}
            aria-label={food.label}
            className="flex min-h-20 flex-col items-center justify-center gap-0.5 rounded-3xl bg-white/80 p-2 shadow-[0_5px_0_rgba(120,85,40,0.18)] transition-transform active:translate-y-0.5 disabled:opacity-60 motion-reduce:active:translate-y-0"
          >
            <img
              src={FOOD_ART[food.id]?.src ?? ""}
              alt=""
              aria-hidden
              className="size-12 object-contain sm:size-14"
              loading="lazy"
            />
            <span className="font-display text-xs font-semibold text-cocoa">{food.label}</span>
          </button>
        ))}
      </div>

      {flight && (
        <img
          src={FOOD_ART[flight.id]?.src ?? ""}
          alt=""
          aria-hidden
          className="pointer-events-none fixed z-50 size-14 object-contain"
          style={{
            left: flight.from.x - 28,
            top: flight.from.y - 28,
            transition: `transform ${FLY_MS}ms ease-in-out, opacity ${FLY_MS}ms ease-in`,
            transform: flight.moving
              ? `translate(${flight.to.x - flight.from.x}px, ${flight.to.y - flight.from.y}px) scale(0.2)`
              : "translate(0, 0) scale(1)",
            opacity: flight.moving ? 0.15 : 1,
          }}
        />
      )}
    </SceneShell>
  );
}
