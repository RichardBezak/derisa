import { Droplets } from "lucide-react";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { playSound } from "@/game/sound";
import { useMumo } from "@/game/store";
import { ActionButton } from "./ActionButton";
import { MumoCharacter } from "./MumoCharacter";
import { SceneDecor } from "./SceneDecor";
import { SceneShell } from "./SceneShell";
import { SpeechBubble } from "./SpeechBubble";

/** Foam clusters sitting on MUMO, in percent of his own box. */
const FOAM = [
  { id: 0, x: 30, y: 16, r: 26 },
  { id: 1, x: 70, y: 22, r: 24 },
  { id: 2, x: 20, y: 44, r: 28 },
  { id: 3, x: 80, y: 50, r: 26 },
  { id: 4, x: 50, y: 58, r: 30 },
  { id: 5, x: 34, y: 78, r: 24 },
  { id: 6, x: 68, y: 80, r: 24 },
] as const;

/** A child's bath brush: wooden handle, rounded head, soft bristles. */
const BrushArt = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 110" aria-hidden className={className}>
    <rect x="33" y="4" width="14" height="46" rx="7" fill="var(--honey-deep)" />
    <rect x="33" y="4" width="6" height="46" rx="3" fill="white" opacity="0.35" />
    <rect x="16" y="44" width="48" height="28" rx="13" fill="var(--coral)" />
    <rect x="20" y="48" width="40" height="9" rx="4" fill="white" opacity="0.4" />
    {[24, 32, 40, 48, 56].map((x) => (
      <rect key={x} x={x - 3} y="68" width="6" height="26" rx="3" fill="var(--cream-deep)" />
    ))}
    <rect x="16" y="64" width="48" height="8" rx="4" fill="var(--cocoa)" opacity="0.25" />
  </svg>
);

const HITS_PER_CLUSTER = 3;

export function BathScene({ onClose }: { onClose: () => void }) {
  const { actions, message, state } = useMumo();
  const [foam, setFoam] = useState<Record<number, number>>(() =>
    Object.fromEntries(FOAM.map((f) => [f.id, HITS_PER_CLUSTER])),
  );
  const [brushPos, setBrushPos] = useState<{ x: number; y: number } | null>(null);
  const [angle, setAngle] = useState(0);
  const [done, setDone] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const mumoRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastX = useRef<number | null>(null);

  const remaining = Object.values(foam).reduce((sum, v) => sum + v, 0);
  const total = FOAM.length * HITS_PER_CLUSTER;
  const percent = Math.round(((total - remaining) / total) * 100);
  const clean = remaining === 0;

  const finish = () => {
    if (done) return;
    setDone(true);
    setBrushPos(null);
    actions.finishWashing();
  };

  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    const area = areaRef.current?.getBoundingClientRect();
    const box = mumoRef.current?.getBoundingClientRect();
    if (!area) return;
    setBrushPos({ x: e.clientX - area.left, y: e.clientY - area.top });

    const prevX = lastX.current;
    lastX.current = e.clientX;
    if (prevX !== null) setAngle(Math.max(-22, Math.min(22, (e.clientX - prevX) * 1.4)));

    if (!box || done) return;
    const insideMumo =
      e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
    if (!insideMumo) return; // brushing beside MUMO never cleans

    const px = e.clientX - box.left;
    const py = e.clientY - box.top;
    setFoam((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const cluster of FOAM) {
        if (!next[cluster.id]) continue;
        const cx = (cluster.x / 100) * box.width;
        const cy = (cluster.y / 100) * box.height;
        const reach = (cluster.r / 100) * box.width + 14;
        if (Math.hypot(px - cx, py - cy) <= reach) {
          next[cluster.id] = Math.max(0, (next[cluster.id] ?? 0) - 1);
          changed = true;
        }
      }
      if (changed) playSound("bubble", state.soundOn);
      return changed ? next : prev;
    });
  };

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (done) return;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    lastX.current = null;
    track(e);
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    track(e);
  };

  const onUp = () => {
    dragging.current = false;
    lastX.current = null;
  };

  return (
    <SceneShell title="Kúpeľ" onClose={onClose} className="bg-sky">
      <SceneDecor scene="bath" />
      <SpeechBubble
        text={done ? message : clean ? "Som čistučký!" : "Vezmi kefku a pošúchaj mi srsť!"}
      />

      <div
        ref={areaRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ touchAction: "none" }}
        className="relative z-10 flex h-64 w-full select-none items-center justify-center sm:h-72"
      >
        <div ref={mumoRef} className="relative">
          <MumoCharacter art="kupel" size="md" animate={false} />

          {FOAM.map((cluster) => {
            const left = foam[cluster.id] ?? 0;
            if (left === 0) return null;
            const scale = left / HITS_PER_CLUSTER;
            return (
              <span
                key={cluster.id}
                aria-hidden
                className="pointer-events-none absolute transition-all duration-200 motion-reduce:transition-none"
                style={{
                  left: `${cluster.x}%`,
                  top: `${cluster.y}%`,
                  width: `${cluster.r}%`,
                  transform: `translate(-50%, -50%) scale(${0.45 + scale * 0.55})`,
                  opacity: 0.35 + scale * 0.6,
                }}
              >
                <svg viewBox="0 0 60 60" className="w-full">
                  <circle cx="24" cy="26" r="16" fill="white" opacity="0.92" />
                  <circle cx="40" cy="20" r="11" fill="white" opacity="0.85" />
                  <circle cx="41" cy="38" r="13" fill="white" opacity="0.8" />
                  <circle cx="20" cy="42" r="10" fill="white" opacity="0.75" />
                  <circle cx="28" cy="22" r="4" fill="var(--sky)" opacity="0.5" />
                </svg>
              </span>
            );
          })}
        </div>

        {!done && (
          <span
            aria-hidden
            className="pointer-events-none absolute w-14"
            style={
              brushPos
                ? {
                    left: brushPos.x - 28,
                    top: brushPos.y - 48,
                    transform: `rotate(${angle}deg)`,
                  }
                : { right: 6, bottom: 6 }
            }
          >
            <BrushArt className="w-full drop-shadow-[0_6px_8px_rgba(120,80,30,0.3)]" />
          </span>
        )}
      </div>

      {!done && (
        <div className="relative z-10 w-full max-w-[260px]" aria-label="Priebeh čistenia">
          <div className="h-3 overflow-hidden rounded-full bg-white/60">
            <div
              className="h-full rounded-full bg-sage transition-[width] duration-200 motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="relative z-10 flex w-full justify-center">
        <ActionButton
          label={done ? "Hotovo!" : "Som čistý"}
          tone="sage"
          onClick={done ? onClose : finish}
          disabled={!clean && !done}
          className="min-h-14 w-auto max-w-[220px] flex-none flex-row gap-2 px-8 py-3"
        >
          <Droplets className="size-7" />
        </ActionButton>
      </div>

      {done && (
        <p className="relative z-10 font-display text-lg font-bold text-cocoa">Krásne čistý MUMO!</p>
      )}
    </SceneShell>
  );
}
