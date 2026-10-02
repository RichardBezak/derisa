import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MESSAGES, MUMO_TUNING } from "@/game/config";
import { pickMessage } from "@/game/engine";
import { playSound } from "@/game/sound";
import { useMumo } from "@/game/store";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

const TOTAL_SECONDS = Math.ceil(MUMO_TUNING.trampoline.durationMs / 1000);

export function TrampolineScene({ onClose }: { onClose: () => void }) {
  const { actions, state } = useMumo();
  const [done, setDone] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [squash, setSquash] = useState(false);
  const [endMessage, setEndMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(TOTAL_SECONDS);
  const jumpTimer = useRef<number | null>(null);

  /** No start button: the trampoline is ready as soon as the scene opens. */
  useEffect(() => {
    const startedAt = Date.now();
    const countdown = window.setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((MUMO_TUNING.trampoline.durationMs - (Date.now() - startedAt)) / 1000),
      );
      setRemainingSeconds(left);
    }, 250);
    const end = window.setTimeout(() => {
      window.clearInterval(countdown);
      setRemainingSeconds(0);
      actions.finishTrampoline();
      setEndMessage(pickMessage(MESSAGES.trampolineEnd));
      setDone(true);
    }, MUMO_TUNING.trampoline.durationMs);
    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(end);
      if (jumpTimer.current) window.clearTimeout(jumpTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jump = () => {
    if (done || jumping) return; // fast tapping cannot break the animation
    setJumping(true);
    setSquash(false);
    playSound("jump", state.soundOn);
    if (jumpTimer.current) window.clearTimeout(jumpTimer.current);
    jumpTimer.current = window.setTimeout(() => {
      setJumping(false);
      setSquash(true);
      window.setTimeout(() => setSquash(false), 220);
    }, 520);
  };

  return (
    <SceneShell title="Trampolína" onClose={onClose} className="bg-sage">
      <SceneDecor scene="trampoline" />
      <div className="relative z-10 flex w-full flex-col items-center gap-3">
        <SpeechBubble text={done ? endMessage : "Klikaj na mňa a ja budem skákať!"} />
        <button
          type="button"
          aria-label="Skoč"
          onClick={jump}
          disabled={done}
          className="flex h-52 w-full shrink-0 flex-col items-center justify-end sm:h-60"
        >
          <MumoCharacter
            art="hra"
            size="sm"
            animate={false}
            className={jumping ? "motion-safe:animate-[mumo-jump_0.52s_ease-out]" : undefined}
          />
          <div
            className="mt-2 h-5 w-44 rounded-full bg-coral shadow-[0_6px_0_rgba(120,85,40,0.25)] transition-transform duration-200 motion-reduce:transition-none"
            style={{ transform: squash ? "scaleY(0.55) scaleX(1.08)" : "scaleY(1)" }}
          />
          <div className="flex w-36 justify-between">
            <span className="h-7 w-2 rounded-b bg-cocoa/50" />
            <span className="h-7 w-2 rounded-b bg-cocoa/50" />
          </div>
        </button>

        {!done && (
          <div className="w-full max-w-[220px]" aria-label={`Zostáva ${remainingSeconds} sekúnd`}>
            <div className="h-3 overflow-hidden rounded-full bg-cream/70">
              <div
                className="h-full rounded-full bg-honey-deep transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${(remainingSeconds / TOTAL_SECONDS) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-center font-display text-sm text-cocoa">Zostáva {remainingSeconds} s</p>
          </div>
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
