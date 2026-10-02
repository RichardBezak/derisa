import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LULU_ART } from "@/game/assets";
import { MESSAGES, MUMO_TUNING } from "@/game/config";
import { pickMessage } from "@/game/engine";
import { playSound } from "@/game/sound";
import { useMumo } from "@/game/store";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

/** A tiny outdoor slide game: one tap sends MUMO down, no score or failure. */
export function SlideScene({ onClose }: { onClose: () => void }) {
  const { actions, state } = useMumo();
  const [slides, setSlides] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [done, setDone] = useState(false);
  const [endMessage, setEndMessage] = useState("");
  const timer = useRef<number | null>(null);
  const slidesRef = useRef(0);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  const slide = () => {
    if (sliding || done) return;
    setSliding(true);
    playSound("jump", state.soundOn);
    timer.current = window.setTimeout(() => {
      setSliding(false);
      const next = slidesRef.current + 1;
      slidesRef.current = next;
      setSlides(next);
      if (next >= MUMO_TUNING.slide.slidesNeeded) {
        actions.finishSlide();
        setEndMessage(pickMessage(MESSAGES.slideEnd));
        setDone(true);
      }
    }, 900);
  };

  return (
    <SceneShell title="Šmykľavka" onClose={onClose} className="bg-sky">
      <SceneDecor scene="playground" />
      <div className="relative z-10 flex w-full flex-col items-center gap-4">
        <SpeechBubble text={done ? endMessage : "Ťukni na šmykľavku a MUMO sa spustí dolu!"} />
        <div className="relative h-64 w-full max-w-sm shrink-0 sm:h-72">
          <svg viewBox="0 0 320 230" aria-hidden className="absolute inset-0 h-full w-full">
            <path d="M218 40 v154" stroke="var(--honey-deep)" strokeWidth="14" strokeLinecap="round" />
            <path d="M246 60 v134" stroke="var(--honey-deep)" strokeWidth="14" strokeLinecap="round" />
            <path d="M214 55 h36 M214 88 h36 M214 121 h36" stroke="var(--cream)" strokeWidth="8" strokeLinecap="round" />
            <path
              d="M242 46 C225 88 205 124 170 150 C136 176 100 182 68 184"
              fill="none"
              stroke="var(--coral)"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <path
              d="M242 46 C225 88 205 124 170 150 C136 176 100 182 68 184"
              fill="none"
              stroke="var(--honey)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <ellipse cx="162" cy="208" rx="128" ry="18" fill="var(--sage)" opacity="0.55" />
          </svg>
          <button
            type="button"
            onClick={slide}
            disabled={sliding || done}
            aria-label="Spustiť MUMA po šmykľavke"
            className="absolute inset-0 z-10 h-full w-full disabled:cursor-default"
          >
            <span
              className="absolute bottom-11 left-1/2 block w-28 motion-reduce:transition-none"
              style={sliding ? undefined : { transform: "translate(44px, -86px)" }}
            >
              <MumoCharacter
                art="hra"
                size="sm"
                animate={false}
                className={sliding ? "motion-safe:animate-[mumo-slide_0.9s_ease-in-out]" : undefined}
              />
            </span>
          </button>
          <img
            src={LULU_ART.src}
            alt={LULU_ART.alt}
            className="absolute bottom-6 left-2 z-10 h-28 w-20 object-contain"
            data-placeholder-art="true"
          />
        </div>
        {!done && (
          <p className="font-display text-lg font-semibold text-cocoa">
            Šmyknutia: {slides}/{MUMO_TUNING.slide.slidesNeeded}
          </p>
        )}
        {done && (
          <ActionButton
            label="Hotovo"
            tone="honey"
            onClick={onClose}
            className="min-h-14 w-auto max-w-[220px] flex-none flex-row gap-2 px-8 py-3"
          >
            <Heart className="size-7" />
          </ActionButton>
        )}
      </div>
    </SceneShell>
  );
}