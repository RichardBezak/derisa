import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LULU_ART } from "@/game/assets";
import { MESSAGES, MUMO_TUNING } from "@/game/config";
import { pickMessage } from "@/game/engine";
import { playSound } from "@/game/sound";
import { useMumo } from "@/game/store";
import { Button } from "@/components/ui/button";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

/** Each touch makes one gentle ride; no score or failure state. */
export function SeesawScene({ onClose }: { onClose: () => void }) {
  const { actions, state } = useMumo();
  const [rocks, setRocks] = useState(0);
  const [done, setDone] = useState(false);
  const [endMessage, setEndMessage] = useState("");
  const timer = useRef<number | null>(null);
  const locked = useRef(false);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const rock = () => {
    if (locked.current || done) return;
    locked.current = true;
    playSound("jump", state.soundOn);
    setRocks((previous) => previous + 1);
    timer.current = window.setTimeout(() => {
      locked.current = false;
      if (rocks + 1 >= MUMO_TUNING.seesaw.rocksNeeded) {
        actions.finishSeesaw();
        setEndMessage(pickMessage(MESSAGES.seesawEnd));
        setDone(true);
      }
    }, 650);
  };

  return (
    <SceneShell title="Hojdačka" onClose={onClose} className="bg-sky">
      <SceneDecor scene="playground" />
      <div className="relative z-10 flex w-full flex-col items-center gap-5">
        <SpeechBubble text={done ? endMessage : "Hojdáme sa s LULU!"} />
        <div className="relative h-64 w-full max-w-sm shrink-0 sm:h-72">
          <div className="absolute bottom-2 left-1/2 h-24 w-20 -translate-x-1/2 bg-honey-deep [clip-path:polygon(50%_0,0_100%,100%_100%)]" aria-hidden />
          <Button
            type="button"
            variant="ghost"
            aria-label="Pohúp sa s LULU"
            onClick={rock}
            disabled={done}
            className="absolute inset-0 z-10 h-full w-full bg-transparent p-0 hover:bg-transparent disabled:opacity-100"
          >
            <span
              className="absolute bottom-20 left-1/2 h-44 w-[88%] transition-transform duration-[650ms] ease-in-out motion-reduce:transition-none"
              style={{ transform: `translateX(-50%) rotate(${rocks % 2 === 0 ? 8 : -8}deg)` }}
              aria-hidden
            >
              <span className="absolute bottom-0 left-0 h-3 w-full rounded-full bg-cocoa shadow-[0_5px_0_var(--honey-deep)]" />
              <span className="absolute bottom-1 left-0 h-3 w-16 rounded-full bg-honey-deep" />
              <span className="absolute bottom-1 right-0 h-3 w-16 rounded-full bg-honey-deep" />
              <MumoCharacter art="hra" size="sm" animate={false} className="absolute bottom-3 left-0 w-28 max-w-[36vw] object-contain" />
              <img src={LULU_ART.src} alt="" className="absolute bottom-3 right-1 h-28 w-20 object-contain" />
            </span>
          </Button>
        </div>
        {!done && <p className="font-display text-lg font-semibold text-cocoa">Ťukni na hojdačku!</p>}
        {done && (
          <ActionButton label="Hotovo" tone="honey" onClick={onClose} className="min-h-14 w-auto max-w-[220px] flex-none flex-row px-8 py-3">
            <Heart className="size-7" />
          </ActionButton>
        )}
      </div>
    </SceneShell>
  );
}