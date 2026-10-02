import { useState } from "react";
import { useMumo } from "@/game/store";
import { MumoCharacter } from "./MumoCharacter";

export function Onboarding() {
  const { actions } = useMumo();
  const [name, setName] = useState("");
  const [waking, setWaking] = useState(false);

  const wake = () => {
    setWaking(true);
    window.setTimeout(() => actions.completeOnboarding(name || "MUMO"), 900);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-night px-6 py-10">
      <MumoCharacter
        art="spanok"
        size="sm"
        animate={!waking}
        className={waking ? "motion-safe:animate-[mumo-jump_0.9s_ease-out] w-40" : "w-40"}
      />
      <h1 className="text-center font-display text-2xl font-bold text-cream">
        Ako sa bude tvoj medvedík volať?
      </h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={12}
        placeholder="MUMO"
        aria-label="Meno medvedíka"
        className="w-full max-w-xs rounded-3xl bg-cream px-5 py-4 text-center font-display text-xl text-cocoa outline-none placeholder:text-cocoa/40"
      />
      <button
        type="button"
        onClick={wake}
        disabled={waking}
        className="rounded-full bg-honey px-10 py-5 font-display text-2xl font-bold text-cocoa shadow-[0_8px_0_rgba(120,85,40,0.3)] active:translate-y-1 disabled:opacity-60 motion-reduce:active:translate-y-0"
      >
        Zobuď ho
      </button>
    </div>
  );
}
