import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useMumo } from "@/game/store";
import { TIME_MODES } from "@/game/time";
import { NeedIndicators } from "./NeedIndicators";
import { SceneShell } from "./SceneShell";

export function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { state, actions, atSchool, timeMode, schoolOpen } = useMumo();
  const [confirmReset, setConfirmReset] = useState(false);
  const [testPanelOpen, setTestPanelOpen] = useState(false);
  const tapsRef = useRef<{ count: number; last: number }>({ count: 0, last: 0 });

  const openTestPanel = () => {
    const now = Date.now();
    const tally = now - tapsRef.current.last < 1500 ? tapsRef.current.count + 1 : 1;
    tapsRef.current = { count: tally, last: now };
    if (tally >= 7) {
      setTestPanelOpen(true);
      tapsRef.current = { count: 0, last: 0 };
    }
  };

  return (
    <SceneShell title="Nastavenia" onClose={onClose} className="bg-cream-deep">
      <div className="flex w-full flex-col gap-4">
        <button
          type="button"
          onClick={() => actions.setSound(!state.soundOn)}
          className="flex items-center justify-between rounded-3xl bg-white/80 px-5 py-4 font-display text-lg text-cocoa shadow"
        >
          <span>Zvuk</span>
          {state.soundOn ? <Volume2 className="size-6" /> : <VolumeX className="size-6" />}
        </button>

        <button
          type="button"
          onClick={openTestPanel}
          className="self-center px-3 py-2 text-xs text-cocoa/45"
        >
          MUMO P0
        </button>

        {testPanelOpen && (
          <div className="rounded-3xl border-2 border-dashed border-cocoa/30 bg-white/70 p-4">
            <p className="font-display text-base font-bold text-cocoa">Testovací panel (pre rodiča)</p>
            <div className="mt-3">
              <NeedIndicators needs={state.needs} showNumbers />
            </div>
            <dl className="mt-3 space-y-1 font-mono text-xs text-cocoa/80">
              <div>sýtosť: {state.needs.satiety.toFixed(1)}</div>
              <div>čistota: {state.needs.cleanliness.toFixed(1)}</div>
              <div>energia: {state.needs.energy.toFixed(1)}</div>
              <div>radosť: {state.needs.joy.toFixed(1)}</div>
              <div>spí: {state.sleeping ? "áno" : "nie"}</div>
              <div>v škole: {atSchool ? "áno" : "nie"}</div>
              <div>posun času: {(state.timeOffsetMs / 3_600_000).toFixed(1)} h</div>
              <div>škola otvorená: {schoolOpen ? "áno" : "nie"}</div>
            </dl>
            <div className="mt-3 rounded-2xl bg-white/70 p-3">
              <p className="font-display text-sm font-bold text-cocoa">Čas</p>
              <div className="mt-2 flex flex-col gap-2">
                {TIME_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => actions.setTimeMode(mode.id)}
                    aria-pressed={timeMode === mode.id}
                    className={
                      timeMode === mode.id
                        ? "min-h-11 rounded-xl bg-sky px-3 py-2 text-left text-sm font-bold text-cocoa ring-2 ring-cocoa/40"
                        : "min-h-11 rounded-xl bg-cream px-3 py-2 text-left text-sm text-cocoa"
                    }
                  >
                    {mode.id === "real" ? "Automaticky – skutočný čas" : mode.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-cocoa/60">
                Testovací čas platí len v tomto okne, po novom otvorení sa vráti skutočný čas.
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <button type="button" onClick={actions.finishActivityNow} className="rounded-xl bg-honey px-3 py-2 text-cocoa">
                Dokončiť školu
              </button>
              <button type="button" onClick={actions.restoreAllNeeds} className="rounded-xl bg-sage px-3 py-2 text-cocoa">
                Potreby na 100
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="col-span-2 min-h-12 rounded-xl bg-coral px-3 py-2 font-display text-cocoa"
              >
                Začať odznova
              </button>
            </div>
            {confirmReset && (
              <div className="mt-3 rounded-2xl bg-white/90 p-4 text-center">
                <p className="font-display text-base text-cocoa">Naozaj chceš začať odznova?</p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      actions.reset();
                      onClose();
                    }}
                    className="min-h-12 flex-1 rounded-xl bg-coral px-4 py-2 font-display text-cocoa"
                  >
                    Áno
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="min-h-12 flex-1 rounded-xl bg-cream-deep px-4 py-2 font-display text-cocoa"
                  >
                    Nie
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </SceneShell>
  );
}
