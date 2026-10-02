import { Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SCHOOL_MOMENTS, pickRandom, pickSchoolLetters } from "@/game/config";
import { useMumo } from "@/game/store";
import { SCHOOL_CLOSED_TEXT, SCHOOL_HOURS_HINT } from "@/game/time";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

/** Standing chalkboard next to MUMO (viewer's left) with three chalked letters. */
function ChalkBoard({ letters }: { letters: string[] }) {
  return (
    <div className="relative z-20 -mr-6 -rotate-1">
      <svg
        role="img"
        aria-label={`Na tabuli sú písmená ${letters.join(", ")}`}
        viewBox="0 0 260 158"
        className="w-56 max-w-[240px] drop-shadow-sm sm:w-64"
      >
        {/* wooden frame + legs */}
        <rect x="4" y="4" width="252" height="132" rx="12" fill="var(--honey-deep)" opacity="0.95" />
        <rect x="14" y="14" width="232" height="112" rx="7" fill="var(--sage)" />
        <rect x="14" y="14" width="232" height="112" rx="7" fill="none" stroke="var(--cocoa)" strokeWidth="3" opacity="0.35" />
        {/* chalk letters, one per visit */}
        {letters.map((letter, i) => (
          <text
            key={`${letter}-${i}`}
            x={78 + i * 52}
            y="92"
            textAnchor="middle"
            className="font-display"
            fontSize="58"
            fontWeight="700"
            fill="var(--cream)"
            opacity="0.95"
            transform={`rotate(${i === 1 ? 1.5 : -2} ${78 + i * 52} 92)`}
          >
            {letter}
          </text>
        ))}
        <path d="M52 112 H150" stroke="var(--cream)" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        {/* chalk tray */}
        <rect x="82" y="136" width="96" height="9" rx="4.5" fill="var(--cocoa)" opacity="0.65" />
        <rect x="98" y="130" width="22" height="6" rx="3" fill="var(--cream)" opacity="0.9" />
      </svg>
    </div>
  );
}

/**
 * School is a normal activity: the child may stay as briefly as they like and
 * can jump to any other activity at once. Nothing is locked or counted down.
 */
export function SchoolScene({ onClose }: { onClose: () => void }) {
  const { actions, schoolOpen, state } = useMumo();
  const [moment, setMoment] = useState<string>(() => pickRandom(SCHOOL_MOMENTS));
  const [letters, setLetters] = useState<string[]>(() => pickSchoolLetters());
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !schoolOpen || state.sleeping) return;
    started.current = true;
    actions.startSchool();
    setMoment(pickRandom(SCHOOL_MOMENTS));
    setLetters(pickSchoolLetters());
  }, [actions, schoolOpen, state.sleeping]);

  return (
    <SceneShell title="Škola" onClose={onClose} className="bg-cream">
      <SceneDecor scene="school" />
      <div className="relative z-10 flex w-full flex-col items-center gap-4">
        <SpeechBubble text={schoolOpen ? moment : SCHOOL_CLOSED_TEXT} />
      <div className="relative z-10 flex w-full items-end justify-center gap-2 px-2">
        <ChalkBoard letters={letters} />
        <MumoCharacter
          art="skola"
          size="lg"
          animate={schoolOpen}
          className="max-h-48 w-auto shrink-0"
        />
      </div>
        <ActionButton
          label="Späť do izbičky"
          tone="cream"
          onClick={onClose}
          className="min-h-14 w-auto max-w-[240px] flex-none flex-row gap-2 px-8 py-3"
        >
          <Home className="size-7" />
        </ActionButton>
        <p className="font-display text-sm text-cocoa/60">{SCHOOL_HOURS_HINT}</p>
      </div>
    </SceneShell>
  );
}
