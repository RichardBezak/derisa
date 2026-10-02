import { useEffect, useState } from "react";
import { Music } from "lucide-react";
import fluteOpen from "@/assets/mumo-flute.png";
import fluteClosed from "@/assets/mumo-flute-closed.png";
import { useMumo } from "@/game/store";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

const NOTES = [
  { left: "18%", delay: "0s" },
  { left: "70%", delay: "2.5s" },
  { left: "40%", delay: "5s" },
  { left: "82%", delay: "7.5s" },
];

export function LullabyScene({ onClose }: { onClose: () => void }) {
  /* Opening the lullaby never wakes MUMO; a sleeping MUMO keeps sleeping. */
  const asleep = useMumo().state.sleeping;
  const [eyesClosed, setEyesClosed] = useState(false);

  /** Occasionally MUMO closes his eyes for a while. */
  useEffect(() => {
    let t: number;
    const cycle = (closed: boolean) => {
      setEyesClosed(closed);
      t = window.setTimeout(() => cycle(!closed), closed ? 3500 : 6000);
    };
    t = window.setTimeout(() => cycle(true), 5000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <SceneShell title="Uspávanka" onClose={onClose} className="bg-night text-cream">
      <SceneDecor scene="room" night />
      <div className="relative z-20 shrink-0">
        <SpeechBubble text={asleep ? "MUMO spinká a uspávanka hrá aj tebe." : "MUMO ti hrá uspávanku."} />
      </div>
      <div className="relative z-10 flex h-72 w-full max-w-[340px] items-end justify-center">
        {NOTES.map((n, i) => (
          <Music
            key={i}
            aria-hidden
            className="pointer-events-none absolute bottom-24 size-7 text-honey opacity-0 motion-safe:animate-[lullaby-note_10s_ease-in-out_infinite]"
            style={{ left: n.left, animationDelay: n.delay }}
          />
        ))}
        {asleep ? (
          <MumoCharacter art="spanok" size="md" animate={false} />
        ) : (
        <div className="relative w-60 max-w-[65vw] origin-bottom motion-safe:animate-[lullaby-sway_6s_ease-in-out_infinite]">
          <img
            src={fluteOpen}
            alt="MUMO hrá na drevenej flaute"
            width={1024}
            height={1024}
            className="w-full select-none drop-shadow-[0_18px_22px_rgba(0,0,0,0.3)]"
            draggable={false}
          />
          <img
            src={fluteClosed}
            alt=""
            aria-hidden
            width={1024}
            height={1024}
            className="absolute inset-0 w-full select-none transition-opacity duration-1000"
            style={{ opacity: eyesClosed ? 1 : 0 }}
            draggable={false}
          />
        </div>
        )}
      </div>
    </SceneShell>
  );
}
